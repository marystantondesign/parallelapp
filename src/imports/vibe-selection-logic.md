Edit the existing prototype. Do not redesign the visual styling yet and do not implement the theme aesthetics. Focus only on navigation structure, screen architecture, and interaction behavior.

Preserve the existing side panel menu layout exactly as it currently appears. The menu should contain the following items in this order:

Parallels
Dreams
Echoes (with the NEW indicator)
Settings

Do not add additional items to this menu and do not change its visual structure.

Selecting **Settings** opens a Settings screen with two options only:

Profile
Account

The **Profile** screen contains editable personal identity fields and personalization controls. Include:

Display Name
Profile Photo
Bio
Vibe

Tapping **Vibe** opens a screen titled **Choose Your Vibe**.

On the **Choose Your Vibe** screen, show three selectable options in this exact order:

Liminal Cream
Scarlet Beam
Lavender Dream

Liminal Cream is the default theme and should appear selected when the screen loads. Only one vibe can be selected at a time and the current selection should display a selection indicator such as a checkmark or radio indicator.

A **Save** button should always be visible at the bottom of the screen. However, the Save button must be **disabled and not tappable** when the currently selected vibe matches the user's saved theme.

Interaction behavior:

• When the screen first loads for a new user, **Liminal Cream** is selected and the Save button is visible but disabled.
• If the user taps **Scarlet Beam** or **Lavender Dream**, that theme is temporarily previewed in the interface and the Save button becomes **enabled and tappable**.
• If the user taps **Save**, the selected vibe becomes the active theme for the app and persists across sessions.
• After saving, the user is returned to the **Profile** screen.

Persistence behavior:

When the user returns to **Settings → Profile → Vibe** later, the previously saved theme should appear selected. The Save button should again be **visible but disabled** unless the user selects a different theme.

The **Account** screen contains login and security information. Include:

Email Address
Password or PIN
Log Out (placed at the bottom of the screen)

Do not implement the visual design for the themes yet. Only build the architecture and interaction logic for selecting and saving the user's vibe.
