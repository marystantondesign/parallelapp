Edit the **Echoes intro screen and Echoes Log screen**. Do not redesign the Echoes feature or change any of the written copy. Only adjust the header layout and the log delete interaction.

---

ECHOES LOG DELETE INTERACTION

On the **Echoes Log** screen, update the swipe-to-delete interaction.

Current behavior shows a very large red delete block on the right side of the list.

Change this so that:

• Swiping left reveals a **small red trash icon button** instead of a full-height red delete area.
• The trash icon should appear on the right edge of the row.
• The row should stay mostly visible, similar to standard iOS swipe actions.
• Tapping the trash icon deletes the session.

Do not show a large red panel. Only show a compact trash icon action.

---

HEADER CLEANUP ON ECHOES INTRO SCREEN

Simplify the Echoes intro screen header.

The top navigation bar should contain:

Left: hamburger menu icon
Center: Echoes
Right: Log

The word **Log** should be horizontally aligned with the hamburger icon and the Echoes label in the same navigation bar.

---

REMOVE DUPLICATE TITLE

Currently the screen shows a large **Echoes** title with a **Beta** chip below the navigation bar.

Remove this duplicated title section.

The Echoes title should only appear once in the navigation bar.

---

BETA CHIP PLACEMENT

Move the **Beta** chip into the navigation bar so it appears next to the Echoes label.

Example structure:

[ hamburger ]   Echoes  [Beta]        Log

---

OPTIONAL LOGO MARK

Add a small circular placeholder logo next to the Echoes title in the navigation bar if needed.

This can simply be a small circle representing the Echoes logo.

---

LOG BUTTON STATE

If the Echoes Log contains **no saved sessions**, the **Log** button in the header should appear disabled.

If at least one Echoes session exists, the **Log** button should appear active and tappable.

---

CONSTRAINTS

Do not change the Echoes descriptive text.
Do not redesign the content of the intro page.
Only adjust the header layout and the delete interaction.
