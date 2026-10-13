Edit the existing **Echoes Transmission Complete screen and Echoes log behavior**.
Do not redesign the Echoes interface. Only adjust layout, button behavior, and saved session logic.

---

TRANSMISSION COMPLETE SCREEN CHANGES

1. NOTES LABEL

Change the label **“Type Notes”** to simply:

Notes

The input field placeholder text can remain the same.

---

2. PHILOSOPHICAL ANALYSIS SECTION

Replace the current Jung analysis button with a section containing:

Button label:
Philosophical Analysis

Underneath the button, add descriptive text:

Analyze audio recording and/or written notes through the lens of the brilliant philosopher Carl Jung.

This descriptive text should appear as a smaller informational line below the button, not inside the button.

---

3. SAVE EXPERIENCE BUTTON POSITION

Move the **Save Experience** button to the very bottom of the screen so it sits as the final action.

The screen order should be:

Audio Reflections
Notes
Philosophical Analysis
Save Experience (bottom)

---

BUTTON ENABLE / DISABLE LOGIC

Add conditional behavior:

If there is **no audio recording AND no written notes**, then:

• Save Experience button should appear **disabled / grayed out**
• Philosophical Analysis button should also appear **disabled**

Once the user:

• records audio OR
• types any text in Notes

Then both buttons become **active and clickable**.

---

ECHOES LOG BEHAVIOR

When the user saves an experience, it should appear in the **Echoes log list**.

Each saved entry should display:

• session date
• time of session
• indicator if audio recording exists
• preview of written notes if present

---

OPENING A SAVED SESSION

When the user taps a saved Echoes session:

Display a session detail page showing:

Audio recording player (if audio exists)
Written notes (if present)
Philosophical Analysis section (if it has been generated)

---

AUDIO PLAYBACK SIMULATION

If the saved session includes audio:

Display a playback interface containing:

• play / pause button
• progress bar
• elapsed time indicator

When the user taps play, simulate playback by moving the progress bar across the recording duration.

---

JUNGIAN INTERPRETATION ACCORDION

If philosophical analysis has been generated:

Display it in an **expandable accordion section** labeled:

Jungian Interpretation

Collapsed by default.

When expanded, show the interpretation text referencing themes such as:

• archetypes
• shadow
• symbolism
• transformation
• collective unconscious

---

ANALYSIS AVAILABILITY

If a saved session contains audio or notes but **analysis has not yet been generated**, show the Philosophical Analysis button so the user can run it later.

If the session contains **no notes and no audio**, analysis should not appear.
