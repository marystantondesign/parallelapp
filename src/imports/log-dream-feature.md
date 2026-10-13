Add the ability to **log a new dream** to the Dreams section of the app.

Do not redesign the existing Dreams list or Dream Detail screens. Only add the entry point and the Dream Capture screen.

---

NEW DREAM ENTRY POINT

On the **Dreams List screen**, add a button in the top right corner labeled:

New Dream

Tapping this button should open a new screen titled:

Log Dream

---

DREAM CAPTURE SCREEN

The Log Dream screen should contain the following fields.

Dream Title
• single-line text field

Date
• automatically set to today's date by default
• the user can tap the date to open a calendar picker
• the user may select a **past date**
• selecting a **future date should not be allowed**

---

DREAM DESCRIPTION

Add a section labeled:

Dream Description

This should be a multiline text field where the user can describe the dream in detail.

---

AUDIO DREAM RECORDING

Add a section labeled:

Audio Recording

Include a button to:

Record Dream

After recording, display an audio playback component including:

• play / pause button
• progress bar
• elapsed time and total duration

---

REQUIRED CONTENT RULE

The user must either:

• record an audio dream description
OR
• write text in the dream description

before the Save Dream button becomes active.

If both fields are empty, the Save Dream button should remain disabled.

---

JUNGIAN ANALYSIS

Include a section labeled:

Philosophical Analysis

Helper text:

Analyze your dream through the lens of Carl Jung's theories of the unconscious.

Add a button:

Generate Jungian Analysis

When tapped, generate a **Jungian Interpretation** section.

Display the interpretation as a **collapsible accordion** that can be expanded or hidden.

The analysis may reference:

• archetypes
• symbolism
• shadow
• unconscious desires
• transformation themes

---

SAVE DREAM

At the bottom include a button labeled:

Save Dream

The button should become active only after the user has entered either:

• text description
OR
• audio recording

---

STORAGE

After saving, the dream should appear in the **Dreams List**.

Each dream entry should show:

• dream title
• date
• short preview of the description

Opening the dream should display the **Dream Detail screen** with the saved content and Jungian analysis.
