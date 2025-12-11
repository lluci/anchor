# ROADMAP (Refactored Labels + Restored Descriptions)

Below is the roadmap restored with **full original descriptions**, rewritten entirely in **English**, and formatted with the new deterministic labels.

---

# MILESTONE 1.0 — Core App (Complete, No Notifications) — DONE

**Description**
This milestone delivered the complete Anchor interaction model as initially designed: the daily panel, semaphor-based time windows, persistence, and both daily and weekly planning. The intention was to build a fully functional app without automation or notifications.

**Tasks**

* @Core @Feature @User — Daily habit panel.
* @Core @Feature @User — Semaphor time windows and proportional timeline.
* @UI @Feature @User — Hour ruler.
* @UI @UX @Feature @User — Done / Edit window / Skip.
* @Core @Feature @User — Skip‑reason categories.
* @Core @Feature @User — Full persistence (daily state, edits, skips).
* @Core @UX @Feature @User — Daily Plan.
* @Core @UX @Feature @User — Weekly Plan + Special Days.
* @Core @UX @Feature @User — Mode switching (Normal / Special).

---

# MILESTONE 1.1 — Notification Engine — DONE

**Description**
Added the proactive notification layer on top of the existing logic. Notifications now respect time windows, escalation tones, and provide visibility of upcoming triggers. The intention was to make Anchor proactive while keeping the interaction intentional.

**Tasks**

* @Core @Feature @User — Window‑based notifications.
* @Core @UX @User — Tone and escalation rules.
* @UI @Feature @User — View showing upcoming triggers.

---

# MILESTONE 2 — Normal Mode Timeline Review — WIP

**Description**
After releasing the first implementation and testing it over time, several UX issues and new insights appeared. This milestone refines how the timeline behaves, how configuration works, and how users with time‑blindness understand execution time.

## Prep Range — DONE

**Context**
The timeline needed a pre‑habit range that does not count as a window. Marking Done inside this white range should still result in a Green Done state.

**Task**

* @NormalMode @Feature @User — Add white preparatory range before habit start.

## Improved Habit Configuration — DONE

**Context**
The original timeline configuration required the user to manually provide all time boundaries (start, whiteEnd, greenEnd, orangeEnd, redEnd). This was slow and error‑prone. The new model lets the user provide only the start time and the margins, and the app calculates ranges automatically.

**Task**

* @Core @Improve @UX @User — Create margin‑based habit configuration model.

## "Now" Asset — WIP

**Context**
Users with time‑blindness need a sense of how long the habit takes from start to completion. The Now asset should display a vertical line with a band representing execution time. The UI must not dim this helper.

**Tasks**

* @NormalMode @Feature @UX @User — Add a visual execution‑time band corresponding to the habit duration.
* @UI @Improve @User — Increase the visual weight of the execution‑time band.

## Simplified Finished Timeline — PLANNED

**Context**
Once a habit is finished, the colored timeline becomes unnecessary clutter. A simplified result badge is enough and frees space for additional info, allowing more compact habit cards.

**Tasks**

* @NormalMode @Improve @UX @User — Replace finished timeline colors with a single achievement badge.
* @UI @Improve @User — Use freed layout space to compact the habit card.

---

# MILESTONE 2.1 — Collapsed Habit System

**Description**
Past and future habits should not compete visually with the current habit. They should collapse automatically to reduce noise and preserve attention.

**Tasks**

* @NormalMode @Feature @UX @User — Expanded view only for the current habit.
* @NormalMode @Feature @UX @User — Collapsed view for past habits (showing final status and edit).
* @NormalMode @Feature @UX @User — Collapsed view for future habits (showing skip).

---

# MILESTONE 3 — Burnout Management Layer — WAITING

**Description**
A new layer on top of the core logic to track burnout levels, provide self‑care recommendations, show trends, and offer long‑term insights.

**Tasks**

* @Core @Feature @User — Define daily burnout levels.
* @Core @UX @User — Daily health‑care advice based on level.
* @UI @Feature @User — Burnout trend displayed in the header.
* @Core @Feature @User — Extended analytics in settings.
* @Core @UX @User — Long‑term insights.

---

# MILESTONE 4 — Self‑Care Tasks — WAITING

**Description**
Allows inserting predefined self‑care tasks into the daily habit panel for a week, triggered by burnout state or manually activated.

**Tasks**

* @Core @Feature @User — Self‑care task selection in settings.
* @NormalMode @UX @Feature @User — Add self‑care task as a daily habit for the week.
* @UI @Improve @User — Header message triggered by high burnout level or negative trend.

---

# MILESTONE 5 — Cronobiology Layer — WAITING

**Description**
Adds circadian rhythm awareness to help the user understand energy phases throughout the day.

**Tasks**

* @Core @Feature @User — Display circadian phase.
* @UI @Feature @User — Show sunrise / sunset times.

---

# FUTURE TASKS

## Commitment Cards (Waiting)

**Idea**
A special type of card used to activate a personal commitment for a fixed duration (e.g., 7 days). Once activated, it cannot be disabled impulsively; cancellation requires passing through predefined reasons or conditions, preserving the integrity of the self‑agreement.

## Momentum Session Mode (Waiting)

**Idea**
A temporary mode that stacks several small tasks into a single accumulated timeline. The bar shows the expected finish time and shifts if tasks are delayed, helping trigger initiation through time visibility rather than semaphor logic.

## Adaptive Habit Guidance (Waiting)

**Idea**
Inside each habit, allow an expandable text or checklist explaining how to perform it. Content adapts to burnout level: fuller activation steps when energy is high, simplified options when energy is low.

## Site

* @Site @UI @Improve @User — Add flag for indispensable cards.
* @Site @UI @Improve @User — Add dark mode.
* @Site @UI @Improve @User — Add mobile support.
* @Site @Core @Feature @User — Sync all app instances by listening to database changes.

## Normal Mode

* @NormalMode @Fix @UX @User — Notifications must stop once a habit ends.
* @NormalMode @Fix @UI @User — Edit button not updating badge color.
* @NormalMode @Improve @UI @User — Edit button toggles Green/Orange.
* @NormalMode @Improve @UI @User — Remove label "· Fet".
* @NormalMode @Improve @UI @User — Replace Edited badge with an icon.
* @NormalMode @Feature @UX @User — Dynamic habit messages (time‑based, burnout‑based, etc.).
* @NormalMode @UX @User — New model for handling habits that become "old" before completion.

### Completed

* @NormalMode @Fix @UI @User — Normal mode tasks not visible on iPhone Safari.
* @NormalMode @Fix @UX @User — Web reloads DB and updates UI to prevent user mistakes.

## Special Mode

* @SpecialMode @Improve @UI @User — Add "Why?" dropdown for omit.

---

# TECH DEBT

* @Core @Refactor @AI — Refactor legacy date handling.
* @iOS @Feature @AI — In‑app visual/audio alerts for reminders.
* @Site @Feature @AI — Convert to PWA with Service Workers.
* @iOS @Feature @AI — Integrate APNs for native‑like notifications.

---

# TAG GUIDELINES (Updated and Deterministic)

These labels are designed to be **unambiguous for the assistant** and **easy for you to apply**. Each label corresponds to exactly one dimension.

## 1) AREA (one per task)

Defines *where* the change takes effect.

```
@Core        – Shared logic, data, persistence.
@NormalMode  – Features and UX of Normal Mode.
@SpecialMode – Features and UX of Special Mode.
@Site        – Website / cross-platform surface.
@iOS         – iOS-specific functionality.
@Android     – Android-specific functionality.
```

## 2) TYPE (can combine)

Defines *the nature of the work*.

```
@Fix         – Corrects a wrong behavior or inconsistency.
@Improve     – Small improvement, no model changes.
@Feature     – New functionality or capability.
@Refactor    – Internal structural change, no UX change.
@UX          – Conceptual or behavioral change.
@UI          – Visual or superficial interaction change.
```

These can be combined, e.g.: `@UI @Improve`, `@Core @Feature`, `@UX @Improve`.

## 3) ORIGIN (optional)

Defines *who proposed the task*.

```
@User        – Defined by you.
@AI          – Proposed by the assistant.
```

## 4) TASK vs MILESTONE (not labels)

This distinction is now **structural, not part of labeling**:

* **Task** → A single coherent action you want.
* **Milestone** → A group of tasks forming a conceptual upgrade.

This keeps labels clean and avoids forcing suffixes like “Task” or “Milestone”.
