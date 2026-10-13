Update the **accepted exchange state for Mila — Parallel #156**.
Do not redesign the interface. Only adjust copy, modal behavior, and prototype state persistence.

---

ACCEPTED STATE COPY

When the user taps **Accept Exchange** in the chat conversation, update the system card to read:

Exchange Request Accepted

You and Mila — Parallel #156 have agreed to a 15 minute exchange.

To begin the exchange, open Mila — Parallel #156’s profile and initiate the exchange when both of you are ready.

This message should remain in the conversation timeline.

---

PROFILE BEHAVIOR

In the profile for Mila — Parallel #156, show the accepted exchange state with a button labeled:

Initiate Exchange Now

Above the button include explanatory text:

Best practice is to coordinate with this parallel before beginning the exchange.

When the exchange begins, Mila — Parallel #156 will have one minute to activate the exchange on her side.

---

IN-APP CONFIRMATION MODAL

When the user taps **Initiate Exchange Now**, open a **modal inside the app interface**, not a Figma prototype modal.

The modal should appear as an in-app dialog overlay.

Modal content:

Initiate Exchange Now?

If you begin the exchange, Mila — Parallel #156 will have one minute to activate the exchange on her side.

If she accepts, you will temporarily swap places for 15 minutes.

Buttons:

Cancel
Start Exchange

Cancel closes the modal.

Start Exchange begins the exchange process.

---

STATE PERSISTENCE

If the user accepts the exchange request in chat and then navigates to the profile and back to the chat, the accepted state must remain unchanged.

Navigating between chat and profile must **not reset the exchange state**.

---

PROTOTYPE RESET RULE

The exchange state should only reset to the original incoming request state when the **entire prototype is refreshed**, not when navigating between screens.
