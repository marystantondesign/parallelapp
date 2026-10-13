Update the **Parallel messaging conversation interface** to properly support the Parallel Exchange request lifecycle.

Do not redesign the chat layout. Only adjust how exchange requests appear within the conversation and add the acceptance and rejection states.

---

EXCHANGE REQUEST AS A SYSTEM CARD

When a user taps **Apply for Exchange** from the parallel's profile, the request should appear inside the chat conversation as a **system card**, not a normal chat message.

This system card should appear in the conversation timeline and represent the moment the request was sent.

The card should display:

Parallel Exchange Request
Duration: 15 minutes

Waiting for Mila — Parallel #84 to respond.

---

MESSAGE ORDER BEHAVIOR

After the request appears in the conversation:

• Any **new chat messages should appear below the request card**
• The request card should remain in the timeline where it was created
• It should not move above newer messages

The request card behaves like a permanent conversation milestone.

---

REQUEST ACCEPTED STATE

If the other parallel accepts the exchange request, update the system card to display:

Exchange Accepted

15 minute exchange scheduled.

Preparing synchronization between parallels.

Add a subtle visual confirmation state such as a checkmark or highlighted border.

---

REQUEST REJECTED STATE

If the other parallel declines the exchange request, update the system card to display:

Exchange Declined

This parallel is not available for an exchange at this time.

The visual style should appear neutral and non-negative.

---

SYSTEM CARD STYLE

The exchange request card should appear visually different from chat bubbles.

It should look like a centered system event in the conversation timeline.

Example structure:

[ Parallel Exchange Request ]
Duration: 15 minutes
Waiting for response

---

CONSTRAINTS

Do not modify the standard chat message layout.

Only add the system card behavior and acceptance/rejection states for Parallel Exchange requests.
