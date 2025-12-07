document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("habit-container");
    if (!container) return;

    // Helper: map window key → label and badge classes
    // WINDOW_VARIANTS is defined in config.js

    function cycleWindow(windowKey) {
        if (windowKey === "green") return "red"; // Start reverse cycle
        if (windowKey === "orange") return "green";
        if (windowKey === "red") return "orange";
        return "green"; // Default fallback
    }

    function updateCardUI(card) {
        const windowKey = card.dataset.window;
        const state = card.dataset.state;

        const statusLine = card.querySelector(".js-status-line");
        const completedInfo = card.querySelector(".js-completed-info");
        const badge = card.querySelector(".js-badge-window");
        const btnFet = card.querySelector(".js-btn-fet");
        const btnEdit = card.querySelector(".js-btn-edit");
        const btnOmit = card.querySelector(".js-btn-omit");

        const config = WINDOW_VARIANTS[windowKey];

        // Reset badge classes
        badge.classList.remove("badge-green", "badge-orange", "badge-red");
        badge.classList.add(config.badgeClass);
        badge.textContent = config.label;

        if (state === "pending") {
            // Pending, normal mode
            card.classList.remove("skipped");
            completedInfo.style.visibility = "hidden";

            // Show badge if manually edited, otherwise hide
            const isEdited = card.dataset.edited === "true";
            badge.style.visibility = isEdited ? "visible" : "hidden";

            statusLine.innerHTML = `Estat actual: <strong>${config.statusText}</strong> – franja activa.`;

            // Reset buttons (might have been disabled by expiry)
            btnFet.disabled = false;
            btnEdit.disabled = false;
            btnOmit.disabled = false;

            // Check if expired to show red badge immediately
            // But ONLY if not manually edited
            if (!isEdited) {
                updateTimeRules(card);
            } else {
                // Determine button states for edited cards too
                updateTimeRules(card);
            }
        } else if (state === "done") {
            // Completed
            card.classList.remove("skipped");
            completedInfo.style.visibility = "visible";
            badge.style.visibility = "visible"; // Show status badge
            statusLine.textContent = `Hàbit completat en ${config.label.toLowerCase()}.`;

            btnFet.disabled = true;
            btnOmit.disabled = true;
            // Editar franja continua actiu
            btnEdit.disabled = false;
        } else if (state === "skipped") {
            // Skipped
            card.classList.add("skipped");
            completedInfo.style.visibility = "hidden";
            statusLine.innerHTML = `<span class="skipped-label">Omet avui</span>`;

            btnFet.disabled = true;
            btnEdit.disabled = true;
            btnOmit.disabled = true;
        }
    }

    // Helper components
    function toMinutes(timeStr) {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
    }

    // Global Loop
    const globalUpdate = () => {
        document.querySelectorAll(".habit-card").forEach(card => {
            updateNowIndicator(card);
            updateTimeRules(card);
        });
    };

    setInterval(globalUpdate, 60000); // 1 minute

    // Test Mode Logic
    const testToggle = document.getElementById("test-mode-toggle");
    const testRadios = document.getElementsByName("test-time");

    function getEffectiveTime() {
        const now = new Date();
        // If toggle is checked, force time to selected radio value
        if (testToggle && testToggle.checked) {
            const selected = document.querySelector('input[name="test-time"]:checked');
            if (selected) {
                const [h, m] = selected.value.split(":").map(Number);
                now.setHours(h);
                now.setMinutes(m);
                now.setSeconds(0);
            }
        }
        return now;
    }

    if (testToggle) {

        // Apply Configuration from config.js
        if (typeof TEST_MODE_CONFIG !== "undefined") {
            // Visibility Check
            if (TEST_MODE_CONFIG.isVisible === false) {
                const devTools = document.getElementById("dev-tools");
                if (devTools) devTools.style.display = "none";
            }

            testToggle.checked = TEST_MODE_CONFIG.enabled;

            // Set initial radio
            if (TEST_MODE_CONFIG.initialTime) {
                const radioToSelect = document.querySelector(`input[name="test-time"][value="${TEST_MODE_CONFIG.initialTime}"]`);
                if (radioToSelect) radioToSelect.checked = true;
            }

            // If enabled via config, trigger update
            if (TEST_MODE_CONFIG.enabled) {
                // We need to wait for cards to be rendered? 
                // No, they are rendered above synchronously.
                // call this after a micro-tick just to be safe or immediately
                setTimeout(globalUpdate, 0);
            }
        }

        const closeBtn = document.getElementById("dev-tools-close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                const devTools = document.getElementById("dev-tools");
                if (devTools) devTools.style.display = "none";
            });
        }

        testToggle.addEventListener("change", () => {
            // Immediate update when toggled
            globalUpdate();
        });

        if (testRadios) {
            testRadios.forEach(radio => {
                radio.addEventListener("change", () => {
                    if (testToggle.checked) globalUpdate();
                });
            });
        }
    }

    // --- REPLACED HELPERS TO USE getEffectiveTime ---

    function updateTimeRules(card) {
        const id = card.dataset.habitId;
        const cfg = HABIT_CONFIG[id];
        if (!cfg) return;

        const now = getEffectiveTime();
        const currentM = now.getHours() * 60 + now.getMinutes();

        const startM = toMinutes(cfg.start);
        const redEndM = toMinutes(cfg.redEnd);

        const isFuture = currentM < startM;
        const isExpired = currentM > redEndM;
        const isActive = !isFuture && !isExpired;

        const state = card.dataset.state;
        const isEdited = card.dataset.edited === "true";

        const btnFet = card.querySelector(".js-btn-fet");
        const btnEdit = card.querySelector(".js-btn-edit");
        const btnOmit = card.querySelector(".js-btn-omit");
        const badge = card.querySelector(".js-badge-window");

        // --- DONE / OMIT BUTTONS ---
        // Enabled ONLY if: (Pending) AND (Active OR Edited)
        if (state === "pending") {
            if (isActive || isEdited) {
                if (btnFet) btnFet.disabled = false;
                if (btnOmit) btnOmit.disabled = false;
            } else {
                // Future or Expired(un-edited)
                if (btnFet) btnFet.disabled = true;
                if (btnOmit) btnOmit.disabled = true;
            }
        } else {
            // Already Done or Skipped -> Actions disabled
            if (btnFet) btnFet.disabled = true;
            if (btnOmit) btnOmit.disabled = true;
        }

        // --- EDIT BUTTON ---
        // User Rule: "Only past cards have Edit button active."
        // Interpretations:
        // - Future: Disabled
        // - Active (Pending): Disabled (Allow system to track)
        // - Done/Skipped: Enabled (Fix history)
        // - Expired (Pending): Enabled (Rescue/Late entry)
        // - Edited (Pending): Enabled (Continue editing)

        if (isFuture) {
            if (btnEdit) btnEdit.disabled = true;
        } else if (state === "pending" && isActive && !isEdited) {
            if (btnEdit) btnEdit.disabled = true;
        } else {
            // Done, Skipped, Expired, or already Edited
            if (btnEdit) btnEdit.disabled = false;
        }

        // --- EXPIRY VISUALS ---
        if (state === "pending") {
            const redConfig = WINDOW_VARIANTS["red"];
            if (isExpired && !isEdited) {
                // Show Red Badge
                badge.classList.remove("badge-green", "badge-orange", "badge-red");
                badge.classList.add(redConfig.badgeClass);
                badge.textContent = redConfig.label;
                badge.style.visibility = "visible";
            } else if (!isEdited) {
                // Hide Badge (Future or Active)
                badge.style.visibility = "hidden";
            }
            // If isEdited, visibility is handled by updateCardUI (kept visible)
        }
    }

    function updateNowIndicator(card) {
        const id = card.dataset.habitId;
        const cfg = HABIT_CONFIG[id];
        if (!cfg) return;

        const startM = toMinutes(cfg.start);
        const redEndM = toMinutes(cfg.redEnd);

        const now = getEffectiveTime(); // CHANGED
        const currentM = now.getHours() * 60 + now.getMinutes();

        const indicator = card.querySelector(".now-indicator");
        if (!indicator) return;

        if (currentM >= startM && currentM <= redEndM) {
            const total = redEndM - startM;
            const elapsed = currentM - startM;
            const pct = (elapsed / total) * 100;

            indicator.style.display = "block";
            indicator.style.left = `${pct}%`;
        } else {
            indicator.style.display = "none";
        }
    }

    function getCurrentWindow(cfg) {
        const now = getEffectiveTime(); // CHANGED
        const currentM = now.getHours() * 60 + now.getMinutes();

        const greenEndM = toMinutes(cfg.greenEnd);
        const orangeEndM = toMinutes(cfg.orangeEnd);

        if (currentM < greenEndM) return "green";
        if (currentM < orangeEndM) return "orange";
        return "red";
    }

    function renderHabitCard(id, cfg) {
        const card = document.createElement("div");
        card.className = "habit-card";
        card.dataset.habitId = id;
        card.dataset.window = "green"; // Default start window
        card.dataset.state = "pending"; // Default state

        // HTML Structure
        card.innerHTML = `
            <div class="habit-card-header">
                <div class="habit-icon">${cfg.icon}</div>
                <div class="habit-name">${cfg.label}</div>
            </div>

            <div class="timeline">
                <div class="time-ruler"></div>
                <div class="timeline-bar">
                    <div class="seg-green"></div>
                    <div class="seg-orange"></div>
                    <div class="seg-red"></div>
                    <div class="now-indicator"></div>
                </div>
            </div>

            <div class="status-line js-status-line"></div>

            <div class="buttons-row">
                <button class="btn btn-primary js-btn-fet">${BUTTON_LABELS.done}</button>
                <button class="btn btn-ghost js-btn-edit">${BUTTON_LABELS.edit}</button>
                <button class="btn js-btn-omit">${BUTTON_LABELS.omit}</button>
            </div>

            <div class="meta-row">
                <div class="status-completed js-completed-info" style="visibility:hidden;">
                    <span class="status-dot"></span>
                    <span>${BUTTON_LABELS.done}</span>
                </div>
                <div>
                     <div class="badge-window badge-edited js-badge-edited" style="display:none; padding: 2px 6px; border-radius: 4px;">${BUTTON_LABELS.edited}</div>
                     <div class="badge-window js-badge-window badge-green" style="display:inline-block"></div>
                </div>
            </div>
        `;

        // --- Timeline Logic ---
        const startM = toMinutes(cfg.start);
        const greenEndM = toMinutes(cfg.greenEnd);
        const orangeEndM = toMinutes(cfg.orangeEnd);
        const redEndM = toMinutes(cfg.redEnd);

        const minTime = startM;
        const maxTime = redEndM;
        const total = maxTime - minTime;

        const greenLen = greenEndM - startM;
        const orangeLen = orangeEndM - greenEndM;
        const redLen = redEndM - orangeEndM;

        const greenPct = (greenLen / total) * 100;
        const orangePct = (orangeLen / total) * 100;
        const redPct = (redLen / total) * 100;

        const segGreen = card.querySelector(".seg-green");
        const segOrange = card.querySelector(".seg-orange");
        const segRed = card.querySelector(".seg-red");

        if (segGreen) segGreen.style.flex = `0 0 ${greenPct}%`;
        if (segOrange) segOrange.style.flex = `0 0 ${orangePct}%`;
        if (segRed) segRed.style.flex = `0 0 ${redPct}%`;

        // Time ruler
        const ruler = card.querySelector(".time-ruler");
        if (ruler) {
            // Generate ticks every 30 minutes from minTime to maxTime
            let rulerHtml = "";
            for (let m = minTime; m <= maxTime; m += 30) {
                const h = Math.floor(m / 60);
                const min = m % 60;
                const timeStr = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                rulerHtml += `<span>${timeStr}</span>`;
            }
            ruler.innerHTML = rulerHtml;
        }

        // --- Interaction Logic ---
        const btnFet = card.querySelector(".js-btn-fet");
        const btnEdit = card.querySelector(".js-btn-edit");
        const btnOmit = card.querySelector(".js-btn-omit");
        const badgeEdited = card.querySelector(".js-badge-edited");

        btnFet.addEventListener("click", () => {
            card.dataset.state = "done";
            card.dataset.window = getCurrentWindow(cfg);
            updateCardUI(card);
        });

        btnEdit.addEventListener("click", () => {
            const current = card.dataset.window || "green";
            const next = cycleWindow(current);
            card.dataset.window = next;

            // Mark as manually edited
            card.dataset.edited = "true";

            // Show "Edited" badge
            if (badgeEdited) badgeEdited.style.display = "inline-block";

            if (card.dataset.state === "done" || card.dataset.state === "pending") {
                updateCardUI(card);
            }
        });

        btnOmit.addEventListener("click", () => {
            card.dataset.state = "skipped";
            updateCardUI(card);
        });

        // Initial UI Update
        updateCardUI(card);

        // Initial Indicator Update
        updateNowIndicator(card);

        return card;
    }

    // Main Render Loop
    Object.keys(HABIT_CONFIG).forEach(habitId => {
        const config = HABIT_CONFIG[habitId];
        const cardElement = renderHabitCard(habitId, config);
        container.appendChild(cardElement);
    });

});