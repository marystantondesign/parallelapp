Update the **Parallel Exchange feature behavior** so the exchange card behaves like a system event inside the chat timeline rather than a persistent bottom panel.

Do not redesign the UI. Only adjust the placement and behavior of the Parallel Exchange card.

---

EXCHANGE CARD AS A TIMELINE EVENT

When the Parallel Exchange feature becomes available in a conversation, insert the **Parallel Exchange Beta card** directly into the chat timeline as a system message.

This card represents the moment the exchange opportunity became available.

The card should appear between existing messages in the conversation timeline.

Example timeline:

Message
Message
Parallel Exchange Beta card
Message
Message

---

MESSAGE ORDER BEHAVIOR

After the Parallel Exchange card appears:

• New messages must always appear **below the card**, not above it.
• The card should move upward in the conversation as more messages are sent.
• It should behave like a permanent timeline marker.

Do not keep the card pinned to the bottom of the chat interface.

---

CARD PERSISTENCE

The Parallel Exchange card should **remain in the conversation history permanently** once it appears.

Users can scroll past it but it should not disappear.

It should function similarly to system messages like:

“Conversation started”
or
“User joined the chat”

---

PROFILE VISIBILITY

If a Parallel Exchange opportunity exists for a conversation, the same exchange state should also appear on the **Parallel Profile screen**.

Example behavior:

If the exchange card appears in the chat with Mila — Parallel #18, then opening the profile for Mila — Parallel #18 should show the **Parallel Exchange Beta section**.

This allows users to apply for the exchange later even if they have scrolled past the card in the chat timeline.

---

REQUEST STATE

If the user taps **Apply for Exchange**, update both locations:

In chat:
The timeline card updates to show
Exchange Request Sent
Waiting for Mila — Parallel #18 to respond.

In the profile:
The Parallel Exchange section should show the same request status.

---

CONSTRAINTS

Do not pin the card to the bottom of the chat.
Do not remove the card when navigating away from the conversation.
The card must behave like a timeline event that moves upward as messages are added.
