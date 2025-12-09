# Anchor Roadmap

## MILESTONES

### Milestone v1.0 — Core App (Complete, No Notifications)

Includes everything defined in the initial design:
 • Daily habit panel
 • Semaphor time windows + proportional timeline
 • Hour ruler
 • Done / Edit Window / Skip
 • Four skip-reason categories
 • Full persistence (daily state, edits, skips)
 • Daily Plan
 • Weekly Plan + Special Days
 • Mode switching (Normal / Special)

Intention: Deliver the complete Anchor interaction model, fully functional and persistent, without time-based automation.

### Milestone v1.1 — Notification Engine

Add the notification layer on top of the existing logic:
 • Window-based notifications
 • Tone and escalation rules
 • View of upcoming triggers

Intention: Make Anchor proactive, not just reflective, while keeping the interaction minimal and intentional.

### Milestone v1.2 — Levels of burnout management

Add the burnout management layer on top of the existing logic:
 • Daily levels of burnout definition
• Daily advice of health care reacting on the level of burnout
 • Trend of burnout in the header
 • Extended analytics in settings popup
 • Long-term insights

### Milestone v1.2.1 — Self care tasks

A new feature that inserts self care tasks in the habit panel. The user will have the opportunity to activate a single self care task that will be inserted in the habit panel to be executed every day along the week. Those self-care tasks are burnout solvers and are pre defined in the app.

    • Add a section in the settings to select the self care task
    • Add a text on the header when burnout level is high or the trend is negative.

Intention: Amplify the user's self-care routine in case of need.

### Milestone v1.3 — Cronobiology layer

Add the cronobiology layer on top of the existing logic:
    •   Add a display to show the current phase of the circadian rhythm
    •   Display the sunset and the sunrise times

Intention: Add an extra layer of awareness to the app.

### Milestone v1.4 — Tech debt and small fixes

Fix the pending issues and tech debt.

## FUTURE TASKS

### Ideas for Milestones

    • Add dark mode
    • Add mobile support
    - #NormalMode #Improv #UX Change the way the habit got old before the user set Done. Insert questions (I skipped it because...).
    - #NormalMode #Improv #UX Make the timeline semaphor reactive to the habit state, and remove the badge.

### Fixes & Improvements

Fixes & Improvements are told by the user. These should be small tasks, not new features. Organized by areas.

#### Normal mode Habit Panel (aka. cards)

    • #Impro #UI Add a flag to identify the cards that are indispensable in the Normal mode.
    • #Fix #UI Edit button ins't changing the color of the badge when clicked. (the issue happen only on the first card).
    • #Impro #UI Habit Edit button let switch between Green and Organge (discarding the red option).
    • #Impro #UI Remove the label "· Fet" that displays when a habit is set as Done.
    • #Impro #UI Substitute the "Editat" badge with a symbol 📝.
    • #Impro #UI Add the range "Prep" to the card timeline.
    • #Impro #UI Add a field to the habit to display messages, adapted to the time of the day, burnout level, etc.

#### Special mode

 • #Impro #UI Omit feature: add a "Why?" dropdown, like Normal mode omits.

#### Tech debt

Tech debt is told by the developer

    • #ToDo Refactor legacy date handling logic for consistency.
    
