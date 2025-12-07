document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("habit-container");
    if (!container) return;

    // Helper: map window key → label and badge classes
    // WINDOW_VARIANTS is defined in config.js

    function cycleWindow(windowKey) {
        if (windowKey === "green") return "orange";
        if (windowKey === "orange") return "red";
        return "green";
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

            statusLine.innerHTML = `Estat actual: <strong>${config.statusText}</strong> – franja activa.`;

            btnFet.disabled = false;
            btnEdit.disabled = false;
            btnOmit.disabled = false;
        } else if (state === "done") {
            // Completed
            card.classList.remove("skipped");
            completedInfo.style.visibility = "visible";
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

    function updateNowIndicator(card) {
        const id = card.dataset.habitId;
        const cfg = HABIT_CONFIG[id];
        if (!cfg) return;

        const startM = toMinutes(cfg.start);
        const redEndM = toMinutes(cfg.redEnd);

        const now = new Date();
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
                <div class="badge-window js-badge-window badge-green"></div>
            </div>
        `;

        // --- Timeline Logic ---
        // 1. Convert times to minutes
        const startM = toMinutes(cfg.start);
        const greenEndM = toMinutes(cfg.greenEnd);
        const orangeEndM = toMinutes(cfg.orangeEnd);
        const redEndM = toMinutes(cfg.redEnd);

        // 2. Define full timeline span
        const minTime = startM;
        const maxTime = redEndM;
        const total = maxTime - minTime;

        // 3. Compute window lengths
        const greenLen = greenEndM - startM;
        const orangeLen = orangeEndM - greenEndM;
        const redLen = redEndM - orangeEndM;

        // 4. Convert durations to percentages
        const greenPct = (greenLen / total) * 100;
        const orangePct = (orangeLen / total) * 100;
        const redPct = (redLen / total) * 100;

        // Apply widths
        const segGreen = card.querySelector(".seg-green");
        const segOrange = card.querySelector(".seg-orange");
        const segRed = card.querySelector(".seg-red");

        if (segGreen) segGreen.style.flex = `0 0 ${greenPct}%`;
        if (segOrange) segOrange.style.flex = `0 0 ${orangePct}%`;
        if (segRed) segRed.style.flex = `0 0 ${redPct}%`;

        // 5. Generate the time ruler
        const ruler = card.querySelector(".time-ruler");
        if (ruler) {
            const startHour = Math.floor(minTime / 60);
            const endHour = Math.ceil(maxTime / 60);

            let rulerHtml = "";
            for (let h = startHour; h <= endHour; h++) {
                const hourStr = h.toString().padStart(2, '0') + ":00";
                rulerHtml += `<span>${hourStr}</span>`;
            }
            ruler.innerHTML = rulerHtml;
        }

        // --- Interaction Logic ---
        const btnFet = card.querySelector(".js-btn-fet");
        const btnEdit = card.querySelector(".js-btn-edit");
        const btnOmit = card.querySelector(".js-btn-omit");

        btnFet.addEventListener("click", () => {
            card.dataset.state = "done";
            updateCardUI(card);
        });

        btnEdit.addEventListener("click", () => {
            const current = card.dataset.window || "green";
            const next = cycleWindow(current);
            card.dataset.window = next;

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

    // Global Loop to update indicators every minute
    setInterval(() => {
        document.querySelectorAll(".habit-card").forEach(card => {
            updateNowIndicator(card);
        });
    }, 60000); // 1 minute

});