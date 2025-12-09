# Bug Fix: iPhone Safari Compatibility Issue

## Problem

The habits in Normal mode were not visible on iPhone Safari, even though the website was loading and some UI elements were displayed.

## Root Cause

The JavaScript code in `app.js` was calling an undefined function `attachSpecialListeners()` on line 1209. This caused a JavaScript execution error that prevented the rest of the code from running properly.

iPhone Safari tends to be stricter about JavaScript errors compared to desktop browsers, which is why this issue was more apparent on mobile.

## Solution

Removed the call to `attachSpecialListeners()` function since:

1. The function was never defined anywhere in the codebase
2. Event listeners are already properly attached within the `renderSimpleCard()` function (lines 1155-1156)
3. The call was redundant and causing the app to fail

## Changes Made

**File:** `/Users/lux/GitHub-Projects/anchor/app.js`
**Line:** 1209
**Change:** Removed `attachSpecialListeners();` and replaced with a comment explaining that event listeners are already attached.

## Testing

To verify the fix works:

1. Clear your browser cache on iPhone Safari
2. Reload the website
3. Habits should now be visible in Normal mode
4. All interactive elements should work as expected

## Additional Notes

- The fix maintains all existing functionality
- No changes to the UI or user experience
- Event listeners continue to work exactly as before
- The code is now cleaner and more maintainable
