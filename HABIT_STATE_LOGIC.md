# Anchor Habit State Logic - Complete Guide

## Overview

This document explains the complete state management system for habits in Anchor, including all possible states, phases, and how they interact with the database persistence layer.

---

## 🎯 Core Concepts

### 1. **State** (User Actions)

The `state` represents what the user has done with the habit:

| State | Meaning | Trigger | Persisted? |
|-------|---------|---------|------------|
| `pending` | Not yet completed | Default on load | ❌ No |
| `done` | Completed | "Fet" button | ✅ Yes |
| `skipped` | Intentionally skipped | "Ometre" → Select reason → "Confirmar" | ✅ Yes |

### 2. **Phase** (Time-based)

The `phase` represents where we are in the habit's timeline:

| Phase | Meaning | Time Range |
|-------|---------|------------|
| `future` | Before start time | `now < start` |
| `active` | Within the habit window | `start ≤ now ≤ redEnd` |
| `expired` | Past the red deadline | `now > redEnd` |

### 3. **Window** (Color Zones)

The `window` represents which time zone the habit is in or was completed in:

| Window | Label | Meaning | Time Range |
|--------|-------|---------|------------|
| `green` | "A temps" | On time | `start ≤ now < greenEnd` |
| `orange` | "Tard" | Late but acceptable | `greenEnd ≤ now < orangeEnd` |
| `red` | "Urgent" | Very late | `orangeEnd ≤ now ≤ redEnd` |

### 4. **Edited Flag**

A special flag that indicates the user manually changed the window:

| Flag | Meaning | Trigger |
|------|---------|---------|
| `edited: "true"` | User manually set window | "Editar" → Cycle window → "Guardar" |

---

## 🔄 State Transitions

### Normal Mode (Detailed Habits)

```text
┌─────────┐
│ PENDING │ ◄─── Initial state on page load
└────┬────┘
     │
     ├──► [User clicks "Fet"] ──────────► DONE (locked, window = current)
     │
     ├──► [User clicks "Editar"] ──────► EDIT MODE
     │                                     │
     │                                     ├─► Cycle windows (green→orange→red→green)
     │                                     │
     │                                     ├─► [Click "Guardar"] ──► DONE (locked, edited=true)
     │                                     │
     │                                     └─► [Click "Cancel·lar"] ──► PENDING (reverted)
     │
     └──► [User clicks "Ometre"] ──────► SKIP MODE
                                           │
                                           ├─► Select reason
                                           │
                                           ├─► [Click "Confirmar"] ──► SKIPPED (locked)
                                           │
                                           └─► [Click "Cancel·lar"] ──► PENDING (cancelled)
```

### Special Mode (Simple Cards)

```text
┌─────────┐
│ PENDING │ ◄─── Initial state on page load
└────┬────┘
     │
     ├──► [User clicks "Fet"] ──────────► DONE (locked, green button)
     │
     └──► [User clicks "Ometre"] ───────► SKIPPED (locked, gray button)
```

---

## 💾 Database Persistence

### What Gets Saved

When a user completes an action, the following is logged to the database:

| Action | State | Detail | Example |
|--------|-------|--------|---------|
| Click "Fet" | `done` | Current window | `"green"` or `"orange"` or `"red"` |
| Edit + Save | `done` | "Edited: {window}" | `"Edited: orange"` |
| Skip with reason | `skipped` | Reason key | `"work_block"` or `"health_block"` |

### Database Schema (Logs Sheet)

| Column | Type | Description |
|--------|------|-------------|
| Timestamp | DateTime | When the action occurred |
| Date | String | YYYY-MM-DD format |
| HabitID | String | e.g., "dormir", "dinar" |
| State | String | "done" or "skipped" |
| Detail | String | Additional context (window, reason, etc.) |

### What Gets Restored on Page Load

When the page loads, it:

1. Renders all habits with default `state: "pending"`
2. Fetches today's saved states from database
3. For each saved habit:
   - Restores `state` (done/skipped)
   - Restores `window` (if saved)
   - Restores `edited` flag (if detail starts with "Edited:")
   - Restores `skipReason` (if skipped)
   - Sets `locked: "true"` to prevent re-interaction
   - Updates UI to reflect the restored state

---

## 🎨 Visual States

### Normal Mode Card Appearance

#### Pending (Active Phase)

```text
┌─────────────────────────────┐
│ 😃 Llevar-se                │
│ ─────────────────────────   │ ← Timeline (green/orange/red)
│ 07:00 ─────────────── 09:00 │
│                             │
│ [Fet] [Editar] [Ometre]     │ ← All buttons enabled
└─────────────────────────────┘
```

#### Done (Locked)

```text
┌─────────────────────────────┐
│ 😃 Llevar-se                │
│ ─────────────────────────   │
│ 07:00 ─────────────── 09:00 │
│ ● Fet · A temps             │ ← Status with dot + window badge
│ [Fet] [Editar] [Ometre]     │ ← All buttons disabled
└─────────────────────────────┘
```

#### Edited (Locked)

```text
┌─────────────────────────────┐
│ 😃 Llevar-se                │
│ ─────────────────────────   │
│ 07:00 ─────────────── 09:00 │
│ [Editat] Tard               │ ← "Editat" badge + window
│ [Fet] [Editar] [Ometre]     │ ← All buttons disabled
└─────────────────────────────┘
```

#### Skipped (Locked, Faded)

```text
┌─────────────────────────────┐
│ 😃 Llevar-se                │ ← Card opacity: 0.6
│ ─────────────────────────   │
│ 07:00 ─────────────── 09:00 │
│ Omet avui – Feina           │ ← Skip reason displayed
│ [Fet] [Editar] [Ometre]     │ ← All buttons disabled
└─────────────────────────────┘
```

#### Expired (Pending, Not Done)

```text
┌─────────────────────────────┐
│ 😃 Llevar-se                │
│ ─────────────────────────   │
│ 07:00 ─────────────── 09:00 │
│ [Urgent]                    │ ← Red badge appears
│ [Fet] [Editar] [Ometre]     │ ← All buttons enabled
└─────────────────────────────┘
```

### Special Mode Card Appearance

#### Pending

```text
┌─────────────────────────────┐
│ 😃 Llevar-se   [Fet] [Ometre] │ ← Simple layout
└─────────────────────────────┘
```

#### Done in Special Mode (Locked)

```text
┌─────────────────────────────┐
│ 😃 Llevar-se   [Fet] [Ometre] │ ← "Fet" button green, both disabled
└─────────────────────────────┘   Opacity: 0.7
```

#### Skipped in Special Mode (Locked)

```text
┌─────────────────────────────┐
│ 😃 Llevar-se   [Fet] [Ometre] │ ← "Ometre" button gray, both disabled
└─────────────────────────────┘   Opacity: 0.7
```

---

## 🔒 Locking Behavior

### When Does a Card Lock?

A card becomes locked (`dataset.locked = "true"`) when:

1. ✅ User clicks "Fet" (Done)
2. ✅ User edits and clicks "Guardar" (Edited)
3. ✅ User skips and clicks "Confirmar" (Skipped)
4. ✅ State is restored from database on page load

### What Happens When Locked?

- All action buttons are disabled
- Card cannot be interacted with again
- Notifications stop for this habit
- Visual state is frozen

### Can You Unlock a Card?

Currently: **No**. Once a habit is marked as done/skipped, it's locked for the day.

Future consideration: Add a "Reset" or "Undo" button for accidental clicks.

---

## 🔔 Notification Integration

Notifications are **suppressed** for habits that are:

- `state === "done"`
- `state === "skipped"`

This is checked in `NotificationManager.checkHabit()`:

```javascript
const card = document.querySelector(`.habit-card[data-habit-id="${id}"]`);
if (card) {
    const state = card.dataset.state;
    if (state === "done" || state === "skipped") return; // No notification
}
```

---

## 🧪 Testing Scenarios

### Scenario 1: Normal Completion

1. User marks habit as "Fet" at 07:15 (green window)
2. Database logs: `state: "done"`, `detail: "green"`
3. Page reload → Card shows "Fet · A temps" (locked)

### Scenario 2: Late Completion

1. User marks habit as "Fet" at 08:15 (orange window)
2. Database logs: `state: "done"`, `detail: "orange"`
3. Page reload → Card shows "Fet · Tard" (locked)

### Scenario 3: Manual Edit

1. User clicks "Editar" → Cycles to "orange" → Clicks "Guardar"
2. Database logs: `state: "done"`, `detail: "Edited: orange"`
3. Page reload → Card shows "[Editat] Tard" (locked, edited badge visible)

### Scenario 4: Skip with Reason

1. User clicks "Ometre" → Selects "Feina / Obligacions" → Clicks "Confirmar"
2. Database logs: `state: "skipped"`, `detail: "work_block"`
3. Page reload → Card shows "Omet avui – Feina / Obligacions" (locked, faded)

### Scenario 5: Multiple Actions (Edge Case)

1. User marks habit as "Fet" at 07:15
2. User reloads page (state restored)
3. User cannot interact again (locked)
4. If user somehow marks it again (shouldn't be possible), database gets new log
5. On next reload, **most recent** state is used

---

## 📊 Data Flow Diagram

```text
┌──────────────┐
│  User Action │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Update UI State  │ (dataset.state, dataset.window, etc.)
│ Lock Card        │
│ Update Visual    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ logHabitToDB()   │ ──► POST to backend
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Google Sheets    │
│ Logs Sheet       │ (Append row: Timestamp, Date, HabitID, State, Detail)
└──────────────────┘

═══════════════════════════════════════════════════════════════

On Page Load:

┌──────────────────┐
│ renderNormalFlow │
│ or               │
│ renderSpecialFlow│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Render all cards │ (default state: "pending")
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ loadTodayState() │ ──► GET from backend
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Google Sheets    │
│ Logs Sheet       │ (Query today's rows, return most recent per habit)
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│ restoreHabitState()  │ (for each saved habit)
│ or                   │
│ restoreSimpleCard()  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│ Update UI        │ (set state, lock, update visual)
└──────────────────┘
```

---

## 🐛 Known Edge Cases

### 1. Multiple Actions in Same Minute

If a user marks a habit as done, then immediately skips it (within the same minute), both actions are logged. On reload, the **most recent** (last in the sheet) is used.

### 2. No Database Connection

If `API_URL` is not configured or the fetch fails:

- Habits render normally
- Actions are NOT saved
- Page reload shows fresh "pending" state
- No errors thrown (graceful degradation)

### 3. Test Mode Interference

When Test Mode is active with time override:

- `getEffectiveTime()` returns the test time
- This affects which window is "current"
- Database logs use the test date
- This is intentional for testing purposes

### 4. Day Mode Changes

If you mark a habit as "Done" in Normal Mode, then switch to Special Mode:

- The habit's state is NOT visible in Special Mode (different card type)
- But the database still has the "done" state
- If you switch back to Normal Mode, it will show as "Done"

---

## 🔮 Future Enhancements

### Potential Improvements

1. **Undo/Reset Button**: Allow users to undo accidental clicks
2. **Edit History**: Show all edits for a habit in the day
3. **Streak Tracking**: Count consecutive days of completion
4. **Analytics**: Show completion patterns over time
5. **Partial Completion**: Allow marking habits as "partially done"

### State Expansion Ideas

- `state: "partial"` - Habit partially completed
- `state: "postponed"` - Moved to later in the day
- `state: "delegated"` - Someone else will do it

---

## 📝 Summary

The Anchor habit state system is built on **four key attributes**:

1. **`state`** - What the user did (pending/done/skipped)
2. **`phase`** - Where in time we are (future/active/expired)
3. **`window`** - Which time zone (green/orange/red)
4. **`edited`** - Whether manually adjusted (true/false)

These combine to create a rich, nuanced system that:

- ✅ Persists across page reloads
- ✅ Prevents accidental re-interaction
- ✅ Provides clear visual feedback
- ✅ Integrates with notifications
- ✅ Supports both Normal and Special modes

The persistence layer ensures that **user actions are never lost**, making Anchor a reliable daily companion.
