Fix the behavior of the Parallel Exchange request when the user taps Decline.

Do not redesign the UI. Only correct the decline interaction logic.

---

DECLINE BEHAVIOR

When the user taps the Decline Exchange button on an incoming exchange request:

Do NOT remove the exchange card.

Instead, update the card to a declined status.

---

CHAT TIMELINE

In the conversation timeline, replace the request card with:

Parallel Exchange Request Declined

You declined Mila — Parallel #156’s exchange request.

This card must remain permanently in the conversation history.

New messages should appear below it.

---

PROFILE SCREEN

On the parallel's profile page, update the Parallel Exchange section to display:

Exchange Request Declined

You declined Mila — Parallel #156’s exchange request.

The Accept and Decline buttons should disappear.

---

PERSISTENCE

The declined state must remain visible when:

• sending messages
• leaving and returning to the chat
• opening the profile
• refreshing the prototype

The exchange state should not disappear after declining.
