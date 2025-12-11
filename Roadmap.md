# MILESTONES

## Milestone 1.0 — Core App (Complete, No Notifications) - DONE

Includes everything defined in the initial design:

- Daily habit panel
- Semaphor time windows + proportional timeline
- Hour ruler
- Done / Edit Window / Skip
- Four skip-reason categories
- Full persistence (daily state, edits, skips)
- Daily Plan
- Weekly Plan + Special Days
- Mode switching (Normal / Special)

Intention: Deliver the complete Anchor interaction model, fully functional and persistent, without time-based automation.

## Milestone 1.1 — Notification Engine - DONE

Add the notification layer on top of the existing logic:

- Window-based notifications
- Tone and escalation rules
- View of upcoming triggers

Intention: Make Anchor proactive, not just reflective, while keeping the interaction minimal and intentional.

## Milestone 2 — @NormalMode Timeline Review - #WIP

After the first implementation, the user had the time to test the feature and appeared some issues and new ideas to improve the experience.

### Better HABIT_CONFIG - DONE

The issue with the current timeline is that it is slow to configure by the user side. The user has to give the exact time keys (start, whiteEnd, greenEnd, orangeEnd, redEnd). But in the new approach, the user will give the hour to start and the margins, letting the app calculate the ranges automatically.

### @Improv Now asset - WIP

The user with time blindness need to see how long it takes to finish the habit. The Now asset should be a vertical line with a band long as the execution time of the habit. Add a new range of time equivalent to the execution time of the habit. For example, the user will spend 1h since start to the end, before mark it as Done. Then, the UI will help him to preview the time he needs.

- @Fix @UI: The execution time is a user helper. It should be more visible. Don't dimm it. Use stronger colors.

### @Improv @UX Simplify Finished Timeline - PLANNED

The timeline colors aren't needed once the habit is finished. It could be simplified to a single badge, showing the achievement. Also, the row can be used to show more info, permitting the compacting of the habit card.

## Milestone 2.1 — @NormalMode Colapsed Habit

Past and future habits should be compacted to save space, and help the user to pay all the attention in the current habit.

### @Improv @UI/UX collapsable habits

- Current habit: use expanded version with helpers (edit, skip, done).
- Past habit: use colapsed version with final status & edit.
- Future habit: use colapsed version with skip.

## Milestone 3 — Levels of burnout management - @WAITING

Add the burnout management layer on top of the existing logic:

- Daily levels of burnout definition
- Daily advice of health care reacting on the level of burnout
- Trend of burnout in the header
- Extended analytics in settings popup
- Long-term insights

## Milestone 4 — Self care tasks - @WAITING

A new feature that inserts self care tasks in the habit panel. The user will have the opportunity to activate a single self care task that will be inserted in the habit panel to be executed every day along the week. Those self-care tasks are burnout solvers and are pre defined in the app.

- Add a section in the settings to select the self care task
- Add a text on the header when burnout level is high or the trend is negative.

Intention: Amplify the user's self-care routine in case of need.

## Milestone 5 — Cronobiology layer - @WAITING

Add the cronobiology layer on top of the existing logic:

- Add a display to show the current phase of the circadian rhythm.
- Display the sunset and the sunrise times.

Intention: Add an extra layer of awareness to the app.

===========

## FUTURE TASKS

### Ideas for Milestones

- @Site @UI Add dark mode.
- @Site @UI Add mobile support.
- @NormalMode @Improv @UX Change the way the habit got old before the user set Done. Insert questions (I skipped it because...).

### Fixes & Improvements

Fixes & Improvements are defined by the user. These should be small tasks, not new features. Organized by areas.

### @NormalMode Habit Panel (aka. cards)

- @NormalMode @FIx @UX The notifications of the habit should stop once the user set the habit ends by any of the mechanisms designed.
- @NormalMode @Impro @UI Add a flag to identify the cards that are indispensable in the Normal mode.
- @NormalMode @FIx @UI Edit button ins't changing the color of the badge when clicked. (the issue happen only on the first habit card).
- @NormalMode @Impro @UI Habit Edit button let switch between Green and Organge (discarding the red option).
- @NormalMode @Impro @UI Remove the label "· Fet" that displays when a habit is set as Done.
- @NormalMode @Impro @UI Substitute the "Editat" badge with a symbol 📝.
- @NormalMode @Impro @UI Add the range "Prep" to the card timeline.
- @NormalMode @Impro @UI Add a field to the habit to display messages, adapted to the time of the day, burnout level, etc.

#### @NormalMode Tasks done

- @NormalMode @FIx @UI The normal mode tasks are not visible on iPhone Safari. - DONE
- @NormalMode @FIx @UX The web should reload the database & update the UI with the data stored, in order to avoid user mistakes. - DONE

### @SpecialMode tasks

- @SpecialMode @Impro @UI Omit feature: add a "Why?" dropdown, like Normal mode omits.

## Tech Debt

List of tasks defined by the AI. The user will move them to the appropriate milestone.

- @ToDo Refactor legacy date handling logic for consistency.
- @Feature @iOS Implement in-app visual/audio alerts for habit reminders (works when app is open).
- @Feature @iOS Convert to Progressive Web App (PWA) with Service Workers for background notifications.
- @Feature @iOS Integrate Apple Push Notification service (APNs) for native-like notifications.
