Fix the behavior of the **Parallel Exchange feature** so that the exchange state is shared between the chat conversation and the parallel's profile page.

Do not redesign the UI. Only correct the feature logic and visibility.

---

SHARED EXCHANGE STATE

The Parallel Exchange opportunity should be treated as a **conversation-level feature state**, not a UI element that exists only inside the chat.

When the exchange opportunity becomes available between two parallels, the state must be visible in both places:

1. The chat timeline
2. The parallel's profile screen

---

CHAT TIMELINE BEHAVIOR

Insert a **Parallel Exchange Beta system card** into the chat timeline at the moment the exchange opportunity becomes available.

The card should behave like a system event and remain in the conversation history.

New messages should appear **below the card**, pushing it upward in the timeline.

Sending messages must **not remove the card**.

---

PROFILE SCREEN BEHAVIOR

If an exchange opportunity exists between two parallels, opening that parallel's profile must also display the **Parallel Exchange Beta section**.

Example:

Profile → Mila — Parallel #18

Below the Life Summary, show the Parallel Exchange section with:

Parallel Exchange (Beta)

The description text
Duration options (15 minutes available, longer durations locked)
Apply for Exchange button

---

REQUEST STATE SYNCHRONIZATION

If the user taps **Apply for Exchange**, update both locations:

In chat:
The system card should update to

Exchange Request Sent
Waiting for Mila — Parallel #18 to respond

In profile:
The Parallel Exchange section should show the same request state.

---

NAVIGATION PERSISTENCE

If the user:

• sends new messages
• leaves the chat
• opens the profile
• returns to the chat

the exchange state must remain visible in both the conversation timeline and the profile screen.

---

CONSTRAINTS

Do not treat the exchange card as a temporary banner.

It must persist as a conversation milestone and remain accessible through the parallel's profile page.
