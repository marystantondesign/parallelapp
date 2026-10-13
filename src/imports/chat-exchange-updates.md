Edit the existing Parallel Chats chat screen and the Parallel Profile / exchange flow. Do not redesign the app. Only update the chat behavior and the Parallel Exchange interaction to match the current design direction.

1. CHAT COMPOSER BEHAVIOR

Make the message composer behave more like native iOS Messages.

Empty state

When the user has tapped into the message field but has not typed anything yet:

do not show the blue send arrow button

show the plus button on the left

show the voice memo / audio waveform icon on the right

keep the text field empty with placeholder text

This should feel like iOS Messages when the input is active but blank.

Typed state

When the user types text into the field:

replace the voice memo icon on the right with the blue send arrow

allow the typed message to send

after sending, the new message should appear in the chat history

Message feedback

After a sent message, add realistic messaging feedback such as:

Delivered

Read 1:28 PM

Use iOS-style read receipt behavior.

Reply simulation

After the user sends a message, simulate a reply flow:

briefly show a typing indicator with animated dot-dot-dot bubble

then show a reply message from the other parallel

This reply simulation can be short and simple.

2. ESTABLISHED CHAT REQUIREMENT

Only in chats where the user has already exchanged enough messages with a parallel, add a new expandable feature inside the conversation flow:

Entry point

Add a button-like row or card in the chat thread labeled:

Parallel Exchange [Beta chip]

Use the same small Beta chip style already used in Echoes.

The title should be:

centered

bold

clearly styled like a feature title

This should feel like a tappable in-chat module, not a normal message bubble.

Expand / collapse behavior

By default, only the Parallel Exchange + Beta chip row is visible.

When tapped, it expands to reveal the full information below it.

3. EXPANDED PARALLEL EXCHANGE CONTENT

When expanded, show:

Parallel Exchange [Beta]

You and this parallel have built enough resonance to apply for a temporary exchange experience.

A parallel exchange allows two highly compatible versions of yourself to temporarily experience each other’s lives.

Initial exchanges are limited to short durations while compatibility is tested.

Then show the duration list:

15 minutes — available

1 hour — locked

24 hours — locked

Then show the main button:

Apply for Exchange

4. MODAL + POST-REQUEST STATE

Keep the existing confirmation modal behavior when the user taps Apply for Exchange.

After the user taps Send Request, replace the expanded exchange section with a sent state showing:

Request Sent
March 9, 2026

This should appear in the same in-chat exchange module area.

Do not remove the rest of the chat.

5. IMPORTANT CONSTRAINTS

do not redesign the entire chat screen

only update the chat composer to match iOS behavior more closely

do not show the blue send arrow when no text has been typed

keep the plus button on the left

use the voice memo icon on the right when the field is empty

use the blue send arrow only when text is present

the Parallel Exchange feature should only appear in chats with enough message history

use the same Beta chip style already used in Echoes