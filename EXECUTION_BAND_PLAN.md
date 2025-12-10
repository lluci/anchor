# Execution Time Band Feature - Implementation Plan

## 🎯 Objective

Add a visual band below the timeline that shows the time needed to complete the task from the current moment forward. This helps users with time blindness understand **how urgent** it is to start the action.

---

## 📊 Concept

### Visual Example

```
Timeline: [White][====Green====][==Orange==][=Red=]
          06:45  07:00         08:00      08:30  09:00
                      ↑ Now (07:30)

Execution Band:       [========30 min========]
                      07:30                 08:00
                      ↑ Start now           ↑ Must finish by
```

**Key Insight:** The band shows "if I start NOW, I need THIS much time to finish on time (before green ends)."

---

## 🎨 Design Specifications

### Visual Style

- **Position:** Below the timeline bar
- **Appearance:** Horizontal line/band with markers
- **Color:** Red/orange to indicate urgency
- **Height:** Thin (2-3px) with end markers
- **Opacity:** Semi-transparent to not overwhelm

### Behavior

- **Static (Phase 1):** Shows a fixed duration (e.g., 30 minutes)
- **Dynamic (Phase 2):** Updates every minute to reflect current time
- **Calculation:** `executionTime = greenEnd - currentTime`
- **Edge Cases:**
  - If `currentTime < start`: Show full green duration
  - If `currentTime > greenEnd`: Show 0 or hide (already late)

---

## 🔧 Implementation Plan

### **Phase 1: Add Static Band**

#### Step 1.1: Add Configuration for Execution Time

**File:** `config.js`

Add an `executionTime` property to each habit (in minutes):

```javascript
dormir: {
    label: "Llevar-se",
    start: "07:00",
    prep: 15,
    greenDuration: 60,
    margins: 30,
    executionTime: 30,  // ← NEW: Time needed to complete (30 min)
    icon: "😃",
    isEssential: true
}
```

**Default:** If not specified, use a default (e.g., 30 minutes or 50% of green duration)

#### Step 1.2: Add HTML Element

**File:** `app.js` (in `renderHabitCard`)

Add the execution band element to the timeline HTML:

```javascript
<div class="timeline">
    <div class="time-ruler"></div>
    <div class="timeline-bar">
        <div class="seg-white"></div>
        <div class="seg-green"></div>
        <div class="seg-orange"></div>
        <div class="seg-red"></div>
        <div class="now-indicator"></div>
    </div>
    <div class="execution-band"></div>  <!-- ← NEW -->
</div>
```

#### Step 1.3: Add CSS Styling

**File:** `index.html`

```css
.execution-band {
    position: relative;
    height: 3px;
    margin-top: 4px;
    background: transparent;
}

.execution-band::before {
    content: '';
    position: absolute;
    height: 3px;
    background: linear-gradient(90deg, #ff3b30 0%, #ff9500 100%);
    border-radius: 2px;
    opacity: 0.7;
    /* Position and width will be set dynamically */
}

.execution-band::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 8px;
    background: #ff3b30;
    top: -2px;
    /* Left position will be set dynamically */
}
```

#### Step 1.4: Calculate and Position Band (Static)

**File:** `app.js` (in `renderHabitCard`, after timeline calculation)

```javascript
// --- Execution Band Logic (Static) ---
const executionTime = cfg.executionTime || 30; // Default 30 min
const executionBand = card.querySelector(".execution-band");

if (executionBand) {
    // For now, show band starting from 'start' time
    const bandStartM = startM;
    const bandEndM = startM + executionTime;
    
    // Calculate position as percentage of total timeline
    const bandStartPct = ((bandStartM - minTime) / total) * 100;
    const bandWidthPct = (executionTime / total) * 100;
    
    // Apply styles
    executionBand.style.setProperty('--band-start', `${bandStartPct}%`);
    executionBand.style.setProperty('--band-width', `${bandWidthPct}%`);
}
```

Update CSS to use CSS variables:

```css
.execution-band::before {
    left: var(--band-start, 0%);
    width: var(--band-width, 30%);
}

.execution-band::after {
    left: var(--band-start, 0%);
}
```

---

### **Phase 2: Sync Band with Current Time**

#### Step 2.1: Create Update Function

**File:** `app.js`

Add a new function to update the execution band:

```javascript
function updateExecutionBand(card) {
    const id = card.dataset.habitId;
    const cfg = HABIT_CONFIG[id];
    if (!cfg) return;
    
    const executionBand = card.querySelector(".execution-band");
    if (!executionBand) return;
    
    const windows = calculateTimeWindows(cfg);
    const prepTimeM = windows.prepTime;
    const startM = windows.start;
    const greenEndM = windows.greenEnd;
    const redEndM = windows.redEnd;
    
    const now = getEffectiveTime();
    const currentM = now.getHours() * 60 + now.getMinutes();
    
    const executionTime = cfg.executionTime || 30; // Default 30 min
    const minTime = prepTimeM;
    const total = redEndM - minTime;
    
    // Calculate band position based on current time
    let bandStartM = currentM;
    let bandEndM = currentM + executionTime;
    
    // Edge cases
    if (currentM < startM) {
        // Before start: show from start
        bandStartM = startM;
        bandEndM = startM + executionTime;
    } else if (currentM >= greenEndM) {
        // Already late: hide band or show as expired
        executionBand.style.display = 'none';
        return;
    } else {
        // During green window: show from now to now + executionTime
        // But cap at greenEnd
        bandEndM = Math.min(bandEndM, greenEndM);
    }
    
    // Calculate percentages
    const bandStartPct = ((bandStartM - minTime) / total) * 100;
    const bandLength = bandEndM - bandStartM;
    const bandWidthPct = (bandLength / total) * 100;
    
    // Apply styles
    executionBand.style.display = 'block';
    executionBand.style.setProperty('--band-start', `${bandStartPct}%`);
    executionBand.style.setProperty('--band-width', `${bandWidthPct}%`);
    
    // Optional: Change color based on urgency
    const timeLeft = greenEndM - currentM;
    if (timeLeft < executionTime) {
        // Urgent: not enough time left in green window
        executionBand.style.setProperty('--band-color', '#ff3b30');
    } else {
        // Comfortable: enough time
        executionBand.style.setProperty('--band-color', '#ff9500');
    }
}
```

#### Step 2.2: Call Update Function

**File:** `app.js`

Call `updateExecutionBand()` in the same places where we update other time-based elements:

1. **Initial render:** After `renderHabitCard()` creates the card
2. **Periodic updates:** In `globalUpdate()` loop (every minute)
3. **Phase updates:** In `updateCardPhase()`

```javascript
// In globalUpdate() - Normal Mode section
if (currentMode === 'normal') {
    const cards = document.querySelectorAll(".habit-card");
    cards.forEach(card => {
        updateNowIndicator(card);
        updateCardPhase(card);
        updateExecutionBand(card);  // ← NEW
    });
}
```

---

## 🎨 Visual Design Options

### Option A: Simple Line

```
Timeline: [White][====Green====][==Orange==][=Red=]
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Band:              ▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                   ↑ Now        ↑ Finish by
```

### Option B: Gradient Bar (Recommended)

```
Timeline: [White][====Green====][==Orange==][=Red=]
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Band:              ████████████░░
                   ↑ Now        ↑ Finish by
                   (Red → Orange gradient)
```

### Option C: With Labels

```
Timeline: [White][====Green====][==Orange==][=Red=]
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Band:              ▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                   ↑            ↑
                   Now       30 min
```

**Recommendation:** Option B (gradient) - visually clear without being cluttered

---

## 🧪 Testing Scenarios

### Phase 1 (Static)

- [ ] Band appears below timeline
- [ ] Band has correct width (executionTime)
- [ ] Band starts at correct position (start time)
- [ ] CSS styling looks good (color, opacity, height)

### Phase 2 (Dynamic)

- [ ] Band updates every minute
- [ ] Band starts from current time
- [ ] Band shrinks as time passes
- [ ] Band disappears when past greenEnd
- [ ] Band color changes based on urgency
- [ ] Test mode time override works correctly

### Edge Cases

- [ ] Before start time (band shows from start)
- [ ] During green window (band shows from now)
- [ ] Near end of green (band is very short)
- [ ] Past greenEnd (band hidden)
- [ ] Different execution times per habit

---

## 📊 Example Calculations

### Habit: "Llevar-se"

- **Start:** 07:00
- **Green End:** 08:00
- **Execution Time:** 30 minutes

#### Scenario 1: Current time = 06:50 (before start)

```
Band: [07:00 ────────── 07:30]
      (30 min from start)
```

#### Scenario 2: Current time = 07:15 (during green)

```
Band:       [07:15 ────────── 07:45]
            (30 min from now)
```

#### Scenario 3: Current time = 07:40 (near end)

```
Band:                   [07:40 ── 08:00]
                        (20 min - urgent!)
```

#### Scenario 4: Current time = 08:05 (past green)

```
Band: [hidden - already late]
```

---

## 🎯 UX Benefits

1. **Time Awareness:** Users see exactly how much time they need
2. **Urgency Indicator:** Shrinking band creates visual urgency
3. **Planning Aid:** Helps decide "Can I start this now?"
4. **Reduces Anxiety:** Clear visual of time requirements
5. **Combats Time Blindness:** External representation of internal time

---

## 📝 Configuration Example

```javascript
const HABIT_CONFIG = {
    dormir: {
        label: "Llevar-se",
        start: "07:00",
        prep: 15,
        greenDuration: 60,
        margins: 30,
        executionTime: 30,  // ← Takes 30 min to complete
        icon: "😃",
        isEssential: true
    },
    dinar: {
        label: "Dinar",
        start: "13:00",
        prep: 15,
        greenDuration: 90,
        margins: 30,
        executionTime: 45,  // ← Takes 45 min to complete
        icon: "🍽",
        isEssential: true
    }
};
```

---

## 🚀 Implementation Order

### Phase 1: Static Band (30 min)

1. ✅ Add `executionTime` to config
2. ✅ Add HTML element
3. ✅ Add CSS styling
4. ✅ Calculate and position band (static)
5. ✅ Test visual appearance

### Phase 2: Dynamic Band (30 min)

1. ✅ Create `updateExecutionBand()` function
2. ✅ Add edge case handling
3. ✅ Integrate with update loops
4. ✅ Add urgency color logic
5. ✅ Test all scenarios

**Total Estimated Time:** 1 hour

---

## 🔮 Future Enhancements

- **Execution time estimation:** Learn from user's actual completion times
- **Multiple bands:** Show different completion strategies
- **Animation:** Smooth transitions as band updates
- **Tooltip:** Show exact time remaining on hover
- **Sound alert:** When band gets very short (< 5 min)

---

## Ready to Implement?

This plan provides a clear path to implement the execution time band feature. The two-phase approach allows us to:

1. First get the visual right (static)
2. Then add the dynamic behavior (sync with time)

Let me know when you're ready to start! 🚀
