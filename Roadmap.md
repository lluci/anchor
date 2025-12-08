# Anchor — Roadmap

## Milestone v1.0 — Core App (Complete, No Notifications)

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

## Milestone v1.1 — Notification Engine

Add the notification layer on top of the existing logic:
 • Window-based notifications
 • Tone and escalation rules
 • View of upcoming triggers

Intention: Make Anchor proactive, not just reflective, while keeping the interaction minimal and intentional.

## Milestone v1.2 — Levels of energy management

Add the energy management layer on top of the existing logic:
 • Daily levels of burnout definition
    • Daily advice of health care reacting on the level of burnout
 • Trend of energy in the header
 • Extended analytics in settings popup
 • Long-term insights

Intention: Make Anchor a manager of the energy, not just a tracker of it.

## Milestone v1.2.1 — Self care tasks

A new feature that inserts self care tasks in the habit panel. The user will have the opportunity to activate a single self care task that will be inserted in the habit panel to be executed every day along the week. Those self-care tasks are burnout solvers and are pre defined in the app.

    • Add a section in the settings to select the self care task
    • Add a text on the header when burnout level is high or the trend is negative.

Intention: Amplify the user's self-care routine in case of need.

## Milestone v1.3 — Cronobiology layer

Add the cronobiology layer on top of the existing logic:
    •   Add a display to show the current phase of the circadian rhythm
    •   Display the sunset and the sunrise times

Intention: Add an extra layer of awareness to the app.

## Milestone v1.4 — Tech debt and small fixes

Fix the pending issues and tech debt.

-------

## Future Directions (Not Milestones Yet)

    • Add dark mode
    • Add mobile support

## Pending fixes & tech debt

    • Special mode Omit: add "Why?" field, like regular omits.
    • Normal mode: Editar button don't change color of the badge when clicked. (the issue happen only on the first card).
    • Add a way to identify the cards that are indispensable in the Normal mode (a flag in the corner or something similar)
    • Add a questionary below the card when the card got old before the user set Done. The questions are: I didn't do it because... (the answers will come at the right time).
