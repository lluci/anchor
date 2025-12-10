# Prep Range Timeline Feature - Implementation Complete! ✅

## 🎯 Feature Overview

Added a **white prep segment** to the timeline that visualizes the preparation time before each habit starts. This helps users see when they should begin preparing for the habit.

## ✅ Changes Made

### 1. **HTML Structure** (`app.js`)

- Added `<div class="seg-white"></div>` to the timeline bar
- White segment appears **before** the green segment
- Timeline now shows: **White → Green → Orange → Red**

### 2. **Timeline Calculation** (`app.js`)

- Updated timeline to start from `prepTime` instead of `start`
- Calculates 4 segments instead of 3:
  - **White:** `prepTime` to `start` (e.g., 06:45 - 07:00 = 15 min)
  - **Green:** `start` to `greenEnd` (e.g., 07:00 - 08:00 = 60 min)
  - **Orange:** `greenEnd` to `orangeEnd` (e.g., 08:00 - 08:30 = 30 min)
  - **Red:** `orangeEnd` to `redEnd` (e.g., 08:30 - 09:00 = 30 min)

### 3. **Window Detection** (`app.js`)

- Updated `getCurrentWindow()` to return **"green"** during prep time
- **Key behavior:** If user marks "Done" during prep time, it saves as **green** (on time)
- Logic:

  ```javascript
  if (currentM >= prepTimeM && currentM < startM) return "green"; // Prep time
  if (currentM < greenEndM) return "green";                       // Green time
  if (currentM < orangeEndM) return "orange";                     // Orange time
  return "red";                                                    // Red time
  ```

### 4. **CSS Styling** (`index.html`)

- Added `.seg-white` class with light gray background (`#f5f5f5`)
- Added subtle border to separate white from green
- Maintains visual consistency with other segments

## 📊 Visual Example

### Before (3 segments)

```
Timeline: [====Green====][==Orange==][=Red=]
          07:00         08:00      08:30  09:00
```

### After (4 segments)

```
Timeline: [White][====Green====][==Orange==][=Red=]
          06:45  07:00         08:00      08:30  09:00
          ↑ Prep time (15 min)
```

## 🎨 UX Benefits

1. **Visual Preparation Cue:** Users can see when to start wrapping up current activities
2. **Encourages Early Action:** Marking "Done" during prep time still counts as "on time" (green)
3. **Better Time Awareness:** The timeline now shows the complete habit cycle including prep
4. **Consistent with Notifications:** Prep notification triggers at the start of the white segment

## 🧪 Testing

### Test Scenarios

1. **Visual Check:**
   - [ ] White segment appears before green
   - [ ] Proportions look correct (15 min white, 60 min green, etc.)
   - [ ] Time ruler starts from prep time

2. **Functional Check:**
   - [ ] Mark "Done" during prep time → Should save as "green"
   - [ ] Mark "Done" during green time → Should save as "green"
   - [ ] Mark "Done" during orange time → Should save as "orange"
   - [ ] Mark "Done" during red time → Should save as "red"

3. **Edge Cases:**
   - [ ] Different prep times (if you customize per habit)
   - [ ] Short habits (e.g., 30 min green duration)
   - [ ] Long habits (e.g., 90 min green duration)

## 📝 Configuration

Each habit now has a `prep` value that controls the white segment:

```javascript
dormir: {
    label: "Llevar-se",
    start: "07:00",
    prep: 15,              // ← Controls white segment (15 min before start)
    greenDuration: 60,
    margins: 30,
    icon: "😃",
    isEssential: true
}
```

**To customize:** Change the `prep` value (in minutes) for any habit.

## 🔮 Future Enhancements (Your "Second Idea")

You mentioned there's a **second way** to visualize execution time. When you're ready, we can implement that as well!

Possible ideas:

- Show expected duration as a band on the timeline
- Highlight the "ideal completion window"
- Add execution time markers
- Show historical completion patterns

## Files Modified

- ✅ `app.js` - HTML structure, timeline calculation, window detection
- ✅ `index.html` - CSS for white segment

## Success! 🎉

The prep range is now visible on all habit timelines. Users can see when to start preparing, and marking "Done" during prep time counts as being on time (green).

**Reload the page to see the white prep segment!**
