document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".habit-card").forEach(card => {
        const id = card.dataset.habitId;          // ex: "dinar"
        const cfg = HABIT_CONFIG[id];             // objecte amb hores

        if (!cfg) {
            console.warn("No config found for:", id);
            return;
        }

        // 1. Convert times to minutes
        function toMinutes(timeStr) {
            const [h, m] = timeStr.split(":").map(Number);
            return h * 60 + m;
        }

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

        // Apply widths (using flex-basis to override CSS flex values)
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
            // We iterate from startHour to endHour to generate the hour markers
            // However, we need to consider positioning if we want them to align perfectly, 
            // but the requirement says "justify-content: space-between" in logic overview (Step 5).
            // "Render them horizontally with: display: flex, justify-content: space-between"
            // So we just dump the spans.

            for (let h = startHour; h <= endHour; h++) {
                const hourStr = h.toString().padStart(2, '0') + ":00";
                rulerHtml += `<span>${hourStr}</span>`;
            }
            ruler.innerHTML = rulerHtml;
        }
    });

});