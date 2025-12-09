# Anchor Roadmap

## MILESTONES

### Milestone 1.0 — Core App (Complete, No Notifications) - DONE

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

### Milestone 1.1 — Notification Engine - DONE

Add the notification layer on top of the existing logic:
    - Window-based notifications
    - Tone and escalation rules
    - View of upcoming triggers

Intention: Make Anchor proactive, not just reflective, while keeping the interaction minimal and intentional.

#### Milestone 2 — #NormalMode Timeline - #PLANNED

The issue with the current timeline is that it is slow to configure by the user side. The user has to give the exact time keys (start, whiteEnd, greenEnd, orangeEnd, redEnd). But in the new approach, the user will give the hour to start and the margins, letting the app calculate the ranges automatically.

    Related tasks:
    - #Improv #UX Make the timeline semaphor reactive to the habit state, showing the final chosed color. And remove the badge in order to compact the habit card.
    - #Improv #UI Substitute the current lime red line with a band long as the execution time of the habit. Add a new range of time equivalent to the execution time of the habit. For example, the user will spend 1h since start to the end, before mark it as Done. Then, the UI will help him to preview the time he needs.
    - #Improv #UI Make a colapsed version of the habit. 
        - Use expanded version only on the current habit.
        - Use colapsed version on finished, skipped and edited habits.

### Milestone 3 — Levels of burnout management - #DESIGN_PENDING

Add the burnout management layer on top of the existing logic:
    - Daily levels of burnout definition
    - Daily advice of health care reacting on the level of burnout
    - Trend of burnout in the header
    - Extended analytics in settings popup
    - Long-term insights

### Milestone 4 — Self care tasks - #DESIGN_PENDING

A new feature that inserts self care tasks in the habit panel. The user will have the opportunity to activate a single self care task that will be inserted in the habit panel to be executed every day along the week. Those self-care tasks are burnout solvers and are pre defined in the app.

    - Add a section in the settings to select the self care task
    - Add a text on the header when burnout level is high or the trend is negative.

Intention: Amplify the user's self-care routine in case of need.

### Milestone 5 — Cronobiology layer - #DESIGN_PENDING

Add the cronobiology layer on top of the existing logic:
    - Add a display to show the current phase of the circadian rhythm
    - Display the sunset and the sunrise times

Intention: Add an extra layer of awareness to the app.

===========

## FUTURE TASKS

### Ideas for Milestones

    - #UI Add dark mode.
    - #UI Add mobile support.
    - #NormalMode #Improv #UX Change the way the habit got old before the user set Done. Insert questions (I skipped it because...).

### Fixes & Improvements

Fixes & Improvements are defined by the user. These should be small tasks, not new features. Organized by areas.

#### #NormalMode Habit Panel (aka. cards)

    - #fix #UX The web should reload the database & update the UI with the data stored, in order to avoid user mistakes.
    - #fix #UX The notifications of the habit should stop once the user set the habit ends by any of the mechanisms designed.
    - #Impro #UI Add a flag to identify the cards that are indispensable in the Normal mode.
    - #Fix #UI Edit button ins't changing the color of the badge when clicked. (the issue happen only on the first habit card).
    - #Impro #UI Habit Edit button let switch between Green and Organge (discarding the red option).
    - #Impro #UI Remove the label "· Fet" that displays when a habit is set as Done.
    - #Impro #UI Substitute the "Editat" badge with a symbol 📝.
    - #Impro #UI Add the range "Prep" to the card timeline.
    - #Impro #UI Add a field to the habit to display messages, adapted to the time of the day, burnout level, etc.

    TASKS DONE
    - #fix #UI The normal mode tasks are not visible on iPhone Safari. - DONE

#### #SpecialMode tasks

    - #Impro #UI Omit feature: add a "Why?" dropdown, like Normal mode omits.

#### #TechDebt tasks

List of tasks defined by the AI. The user will move them to the appropriate milestone.

    - #ToDo Refactor legacy date handling logic for consistency.
    - #feature #iOS Implement in-app visual/audio alerts for habit reminders (works when app is open).
    - #feature #iOS Convert to Progressive Web App (PWA) with Service Workers for background notifications.
    - #feature #iOS Integrate Apple Push Notification service (APNs) for native-like notifications.
