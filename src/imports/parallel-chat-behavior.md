Edit the **Parallel Chats conversation screen**. Do not redesign the layout of the chat. Only update the behavior of the message composer and the empty chat state so it behaves more like iOS Messages.

EMPTY CHAT STATE

When a user opens a brand new chat with a parallel and no messages exist yet:

• the conversation area should be empty
• show a subtle placeholder message centered in the thread:

Start a conversation with this parallel.

Do not show any pre-generated messages.

---

MESSAGE COMPOSER (iOS-LIKE BEHAVIOR)

Update the bottom message composer so it behaves similarly to native iOS Messages.

The composer should contain:

Left side: plus (+) button
Center: message text field
Right side: audio / voice memo icon

---

EMPTY INPUT STATE

When the user has **not typed anything yet**:

• the blue send arrow should NOT appear
• the right-side icon should be the **voice memo / audio waveform icon**

This allows the user to record a voice memo.

---

TEXT TYPING STATE

When the user types text into the input field:

• replace the voice memo icon with the **blue send arrow**
• tapping the arrow sends the typed message

---

VOICE MEMO BEHAVIOR

When the user taps the voice memo icon:

• simulate a recording interface
• show a recording timer
• allow the user to send the recorded audio as a message bubble

The voice memo should appear in the conversation as an audio message.

---

MESSAGE FEEDBACK

After sending a message:

• show “Delivered” under the message
• when the other parallel reads the message, show a read receipt such as:

Read 1:28 PM

---

TYPING INDICATOR

After the user sends a message, briefly show a typing indicator in the chat:

…

This should appear as a typing bubble from the other parallel.

After a short moment, simulate a reply message.

---

CONSTRAINTS

Do not redesign the chat layout.
Do not modify the header or profile area.
Only update the composer behavior and empty conversation state.
