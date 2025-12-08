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
                updateCardPhase(card);
            } else {
                // Determine button states for edited cards too
                updateCardPhase(card);
            }
        } else if (state === "done") {
            // Completed
            card.classList.remove("skipped");
            completedInfo.style.visibility = "visible";
            badge.style.visibility = "visible"; // Show status badge
            statusLine.textContent = `Hàbit completat en ${config.label.toLowerCase()}.`;

            // Delegate button state to the central authority
            updateCardPhase(card);
        } else if (state === "skipped") {
            // Skipped
            card.classList.add("skipped");
            completedInfo.style.visibility = "hidden";

            const reasonKey = card.dataset.skipReason || "";
            const reasonLabel = SKIP_REASONS[reasonKey] || reasonKey;

            statusLine.innerHTML = `<span class="skipped-label">Omet avui</span> ${reasonLabel ? `– ${reasonLabel}` : ""}`;

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
            updateCardPhase(card);
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

    function getEffectiveDayMode() {
        if (testToggle && testToggle.checked) {
            const selected = document.querySelector('input[name="test-mode-type"]:checked');
            return selected ? selected.value : 'normal';
        }
        // In real mode, we would check WEEKLY_CONFIG for today
        // For now, default to normal
        const todayKey = new Date().toISOString().split("T")[0];
        return WEEKLY_CONFIG[todayKey] || 'normal';
    }

    if (testToggle) {

        // ... (existing config loading logic)

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

        // New Mode Radios
        const modeRadios = document.getElementsByName("test-mode-type");
        if (modeRadios) {
            modeRadios.forEach(radio => {
                radio.addEventListener("change", () => {
                    console.log("Test Mode Type Changed:", radio.value);
                    if (testToggle.checked) globalUpdate();
                });
            });
        }
    }

    // --- REPLACED HELPERS TO USE getEffectiveTime ---

    function updateCardPhase(card) {
        const id = card.dataset.habitId;
        const cfg = HABIT_CONFIG[id];
        if (!cfg) return;

        const now = getEffectiveTime();
        const currentM = now.getHours() * 60 + now.getMinutes();

        const startM = toMinutes(cfg.start);
        const redEndM = toMinutes(cfg.redEnd);

        // 1. Determine Phase
        let phase = "future";
        if (currentM >= startM && currentM <= redEndM) {
            phase = "active";
        } else if (currentM > redEndM) {
            phase = "expired";
        }

        // 2. Set Phase Attribute
        card.dataset.phase = phase;

        // 3. Apply Rules based on (Phase + State)
        const state = card.dataset.state; // pending, done, skipped
        const isEdited = card.dataset.edited === "true";
        const isLocked = card.dataset.locked === "true";

        const btnFet = card.querySelector(".js-btn-fet");
        const btnEdit = card.querySelector(".js-btn-edit");
        const btnOmit = card.querySelector(".js-btn-omit");
        const badge = card.querySelector(".js-badge-window");

        // --- LOCK OVERRIDE ---
        // If locked (user saved an edit), ALL interactions are disabled forever.
        if (isLocked) {
            if (btnFet) btnFet.disabled = true;
            if (btnOmit) btnOmit.disabled = true;
            if (btnEdit) btnEdit.disabled = true;
            // But we still update visuals (below)
        } else {
            // ... Normal Logic ...

            // --- DONE / OMIT BUTTONS ---
            // Enabled ONLY if: (Pending) AND (Phase=Active)
            // If Phase=Future -> Disabled
            // If Phase=Expired -> Disabled (even if Edited, per user request)
            if (state === "pending") {
                if (phase === "active") {
                    if (btnFet) btnFet.disabled = false;
                    if (btnOmit) btnOmit.disabled = false;
                } else {
                    if (btnFet) btnFet.disabled = true;
                    if (btnOmit) btnOmit.disabled = true;
                }
            } else {
                // Already Done or Skipped
                if (btnFet) btnFet.disabled = true;
                if (btnOmit) btnOmit.disabled = true;
            }

            // --- EDIT BUTTON ---
            // Enabled ONLY if: NOT (Phase=Active AND State=Pending AND !Edited)
            // i.e. Disabled during the normal active execution window.
            // Enabled in Future? No, keep disabled in future.
            // NEW: If State=Done, Disabled (Final)

            if (state === "done") {
                if (btnEdit) btnEdit.disabled = true;
            } else if (phase === "future") {
                if (btnEdit) btnEdit.disabled = true;
            } else if (phase === "active" && state === "pending" && !isEdited) {
                if (btnEdit) btnEdit.disabled = true;
            } else {
                // Expired (Pending), Skipped, or Edited (Pending) -> Enable
                if (btnEdit) btnEdit.disabled = false;
            }
        }

        // --- EXPIRY VISUALS ---
        if (state === "pending") {
            const redConfig = WINDOW_VARIANTS["red"];
            if (phase === "expired" && !isEdited) {
                // Show Red Badge
                badge.classList.remove("badge-green", "badge-orange", "badge-red");
                badge.classList.add(redConfig.badgeClass);
                badge.textContent = redConfig.label;
                badge.style.visibility = "visible";
            } else if (!isEdited) {
                // Hide Badge (Future or Active)
                badge.style.visibility = "hidden";
            }
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
        card.dataset.phase = "future"; // Default phase (will be updated immediately)

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
                
                <button class="btn btn-primary js-btn-accept" style="display:none; background-color: #4cd964; color: white; border: none;">${BUTTON_LABELS.accept}</button>
                <button class="btn js-btn-cancel" style="display:none;">${BUTTON_LABELS.cancel}</button>
            </div>
            
            <div class="skip-ui js-skip-ui" style="display:none; margin-top: 10px;">
                <select class="form-select js-skip-reason" style="margin-right: 5px; padding: 5px;">
                    <option value="" disabled selected>${BUTTON_LABELS.selectReason}</option>
                    ${Object.entries(SKIP_REASONS).map(([key, label]) => `<option value="${key}">${label}</option>`).join('')}
                </select>
                <button class="btn btn-warning js-btn-confirm-skip">${BUTTON_LABELS.confirmSkip}</button>
                <button class="btn js-btn-cancel-skip">${BUTTON_LABELS.cancel}</button>
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
            card.dataset.locked = "true"; // LOCK ON DONE
            card.dataset.window = getCurrentWindow(cfg);
            updateCardUI(card);
        });

        const btnAccept = card.querySelector(".js-btn-accept");
        const btnCancel = card.querySelector(".js-btn-cancel");

        // Helper to toggle Edit Mode UI
        const toggleEditMode = (active) => {
            if (active) {
                btnFet.style.display = "none";
                btnOmit.style.display = "none";
                btnAccept.style.display = "inline-block";
                btnCancel.style.display = "inline-block";
                // Keep Edit button visible to allow cycling
            } else {
                btnFet.style.display = "inline-block";
                btnOmit.style.display = "inline-block";
                btnAccept.style.display = "none";
                btnCancel.style.display = "none";
            }
        };

        btnEdit.addEventListener("click", () => {
            const isEditMode = card.dataset.editMode === "true";

            if (!isEditMode) {
                // ENTER EDIT MODE
                card.dataset.editMode = "true";

                // Store original state to revert if cancelled
                card.dataset.originalWindow = card.dataset.window || "green"; // Default safe
                card.dataset.originalEdited = card.dataset.edited || "false";

                toggleEditMode(true);

                // Initial Cycle on Entry
                // If first time editing ever, ignore the stale dataset.window (default "green")
                // and start cycling from the ACTUAL current visual window.
                let current = card.dataset.window;
                if (card.dataset.edited !== "true") {
                    current = getCurrentWindow(cfg);
                    // Also update dataset.originalWindow to this 'real' starting point
                    // so Cancel reverts to what user actually SAW, not 'green'
                    card.dataset.originalWindow = current;
                }

                const next = cycleWindow(current);
                card.dataset.window = next;

                // We show "Edited" immediately while cycling? 
                // Or only on save?
                // Visual feedback is needed. Let's show badge or just change color.
                // Changing dataset.window changes color via updateCardUI (called below).

            } else {
                // ALREADY IN EDIT MODE -> Just Cycle
                const current = card.dataset.window;
                const next = cycleWindow(current);
                card.dataset.window = next;
            }

            // In Edit Mode, we don't commit 'edited=true' yet, 
            // but we need to update UI to show the new color.
            // We temporarily set edited=true for visual consistency (badges etc)?
            // Actually, let's keep edited=false (if it was false) until Save.
            // But updateCardUI uses dataset.window to set color, which is what we want.
            updateCardUI(card);

            // Re-apply toggle to ensure correct buttons are shown (updateCardUI might reset them?)
            // updateCardUI resets buttons disabled state but not display. 
            // However, let's be safe.
            toggleEditMode(true);
        });

        // ACCEPT (Save)
        btnAccept.addEventListener("click", () => {
            // Commit changes
            card.dataset.edited = "true";
            card.dataset.locked = "true"; // LOCK ON SAVE
            delete card.dataset.editMode;
            delete card.dataset.originalWindow;
            delete card.dataset.originalEdited;

            // Show "Edited" badge
            if (badgeEdited) badgeEdited.style.display = "inline-block";

            // Return to normal UI
            toggleEditMode(false);
            updateCardUI(card);

            // Here we would send to DB...
            console.log(`Saved habit ${id}: window=${card.dataset.window}`);
        });

        // CANCEL (Revert)
        btnCancel.addEventListener("click", () => {
            // Revert changes
            card.dataset.window = card.dataset.originalWindow;
            card.dataset.edited = card.dataset.originalEdited;

            delete card.dataset.editMode;
            delete card.dataset.originalWindow;
            delete card.dataset.originalEdited;

            // Return to normal UI
            toggleEditMode(false);
            updateCardUI(card);
        });

        // SKIP LOGIC
        const skipUI = card.querySelector(".js-skip-ui");
        const selectReason = card.querySelector(".js-skip-reason");
        const btnConfirmSkip = card.querySelector(".js-btn-confirm-skip");
        const btnCancelSkip = card.querySelector(".js-btn-cancel-skip");

        // Toggle Skip Mode
        const toggleSkipMode = (active) => {
            if (active) {
                btnFet.style.display = "none";
                btnEdit.style.display = "none";
                btnOmit.style.display = "none";
                skipUI.style.display = "flex"; // or block
                skipUI.style.alignItems = "center";
                skipUI.style.gap = "5px";
            } else {
                btnFet.style.display = "inline-block";
                btnEdit.style.display = "inline-block";
                btnOmit.style.display = "inline-block";
                skipUI.style.display = "none";
            }
        };

        btnOmit.addEventListener("click", () => {
            toggleSkipMode(true);
        });

        btnCancelSkip.addEventListener("click", () => {
            toggleSkipMode(false);
            // Reset selection?
            selectReason.selectedIndex = 0;
        });

        btnConfirmSkip.addEventListener("click", () => {
            const reason = selectReason.value;
            if (!reason) {
                alert("Si us plau, selecciona un motiu.");
                return;
            }

            card.dataset.state = "skipped";
            card.dataset.skipReason = reason;
            card.dataset.locked = "true"; // LOCK ON SKIP

            updateCardUI(card);
            toggleSkipMode(false);
        });

        // Initial UI Update
        updateCardUI(card);

        // Initial Indicator Update
        updateNowIndicator(card);

        return card;
    }

    // --- SETTINGS PANEL LOGIC ---

    const btnSettings = document.getElementById("btn-settings");
    const settingsOverlay = document.getElementById("settings-overlay");
    const btnCloseSettings = document.getElementById("btn-close-settings");

    if (btnSettings && settingsOverlay) {
        btnSettings.addEventListener("click", () => {
            settingsOverlay.style.display = "flex";
            renderWeeklyGrid();
        });

        btnCloseSettings.addEventListener("click", () => {
            settingsOverlay.style.display = "none";
        });
    }

    // Weekly Pact State (In-memory for now)
    // Key: YYYY-MM-DD, Value: 'normal' | 'special'
    const WEEKLY_CONFIG = {};

    function getNext7Days() {
        const days = [];
        const today = getEffectiveTime(); // Use test time if active

        for (let i = 1; i <= 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            days.push(d);
        }
        return days;
    }

    function renderWeeklyGrid() {
        const grid = document.getElementById("weekly-pact-grid");
        if (!grid) return;

        grid.innerHTML = "";
        const days = getNext7Days();

        const daysOfWeek = ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"];

        days.forEach(date => {
            const dateKey = date.toISOString().split("T")[0];
            const dayName = daysOfWeek[date.getDay()];
            const dayNum = date.getDate();
            const label = `${dayName} ${dayNum}`;

            // Default to 'normal' if not set
            if (!WEEKLY_CONFIG[dateKey]) WEEKLY_CONFIG[dateKey] = 'normal';
            const currentType = WEEKLY_CONFIG[dateKey];

            const col = document.createElement("div");
            col.className = "pact-col";

            col.innerHTML = `
                <div class="pact-header">${label}</div>
                <button class="pact-btn ${currentType === 'normal' ? 'active' : ''}" data-date="${dateKey}" data-type="normal">Normal</button>
                <button class="pact-btn ${currentType === 'essential' ? 'special-active' : ''}" data-date="${dateKey}" data-type="essential">Essencials</button>
                <button class="pact-btn ${currentType === 'flexible' ? 'special-active' : ''}" data-date="${dateKey}" data-type="flexible">Totes</button>
            `;

            // Add listeners
            const btnNormal = col.querySelector('[data-type="normal"]');
            const btnEssential = col.querySelector('[data-type="essential"]');
            const btnFlexible = col.querySelector('[data-type="flexible"]');

            btnNormal.addEventListener("click", () => {
                WEEKLY_CONFIG[dateKey] = 'normal';
                renderWeeklyGrid();
            });

            btnEssential.addEventListener("click", () => {
                WEEKLY_CONFIG[dateKey] = 'essential';
                renderWeeklyGrid();
            });

            btnFlexible.addEventListener("click", () => {
                WEEKLY_CONFIG[dateKey] = 'flexible';
                renderWeeklyGrid();
            });

            grid.appendChild(col);
        });
    }

    // --- SKIP TODAY LOGIC ---
    const btnSkipToday = document.getElementById("btn-skip-today");
    const statusSkipToday = document.getElementById("skip-today-status");
    const btnRestoreToday = document.getElementById("btn-restore-today");
    const mainContainer = document.getElementById("habit-container");

    // Check if we need header disabled too? Ideally entire body except settings.
    // But let's stick to disabling the container as requested.

    function toggleTodaySkipped(skipped) {
        if (skipped) {
            mainContainer.classList.add("app-disabled");
            btnSkipToday.style.display = "none";
            statusSkipToday.style.display = "block";

            // Should we show a big overlay on the main screen?
            // "Dia No Disponible - Descansa"
            let overlay = document.getElementById("today-skipped-overlay");
            if (!overlay) {
                overlay = document.createElement("div");
                overlay.id = "today-skipped-overlay";
                overlay.className = "skip-day-overlay";
                overlay.innerHTML = `<h3>Dia No Disponible</h3><p>Descansa i recupera't.</p>`;
                document.body.appendChild(overlay);
            }
            overlay.style.display = "block";

        } else {
            mainContainer.classList.remove("app-disabled");
            btnSkipToday.style.display = "block";
            statusSkipToday.style.display = "none";

            const overlay = document.getElementById("today-skipped-overlay");
            if (overlay) overlay.style.display = "none";
        }
    }

    if (btnSkipToday && btnRestoreToday) {
        btnSkipToday.addEventListener("click", () => {
            toggleTodaySkipped(true);
        });

        btnRestoreToday.addEventListener("click", (e) => {
            e.preventDefault();
            toggleTodaySkipped(false);
        });
    }

    // Main Render Loop
    Object.keys(HABIT_CONFIG).forEach(habitId => {
        const config = HABIT_CONFIG[habitId];
        const cardElement = renderHabitCard(habitId, config);
        container.appendChild(cardElement);
    });

});