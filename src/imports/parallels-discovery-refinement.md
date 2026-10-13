Refine the Parallels discovery screen to improve interaction behavior, layout density, and filtering logic while maintaining the existing design system.

Do not redesign the interface.
Do not introduce new visual styles.
Only adjust layout density and interaction behavior.

1. Reduce Card Vertical Height

The identity cards currently take up too much vertical space.

Make the cards slightly more compact vertically by reducing padding and spacing between elements.

Each card should still contain:

• avatar
• name
• identity number
• match percentage

Do not change the three-column grid layout.

2. Remove Hover States

This interface is designed for iPhone, so hover states should not exist.

Remove any hover behavior.

Cards should only respond to:

• tap
• press/active state

3. Show Distance Metadata Only When Relevant

Sorting options include:

• Closest Universe
• Most Distant Universe

When one of these sorting options is selected, display a short distance label inside each card.

Do not display this metadata when sorting by match percentage.

Distance labels should be short and readable, for example:

• 4 light years
• 22 solar systems
• 3 LY

Do not use the phrase “Universe distance” inside the card.

Distance should appear as small secondary metadata below the identity number or match percentage.

4. Improve Search Interaction

When the user taps the search field:

• the iPhone keyboard should slide up from the bottom of the screen
• users type letter-by-letter

Search should match:

• identity name
• identity attributes such as job titles or interests

Search results should filter the grid of cards.

Results should update after the user submits the search using the keyboard search/return key.

5. Preserve Search and Sort State

When a user:

• performs a search
• selects a sorting option
• opens an identity profile
• then navigates back

The screen should preserve the previous search query, sorting selection, and scroll position.

Do not reset the screen.

6. Add Clear Filters Control

The sorting controls currently take up more space than necessary.

Refine this area so that it includes:

• the sorting control
• a Clear Filters button to the right of the sorting control

The Clear Filters button should:

• reset search text
• reset sorting to default
• restore the full grid of identities

7. Fix Data Consistency

Ensure that all identity data remains consistent across screens.

The following values must always match between:

• card view
• sorting logic
• identity profile screen

These include:

• match percentage
• universe distance values

Example issue to prevent:

A card showing 52% match must not display 94% match on the profile screen.

All screens should use the same underlying data source.

8. Chat Creation Behavior

When a user taps Start Chat from an identity profile:

• a new conversation thread should be created
• the chat should open immediately
• the conversation should appear in the Chats tab

Each identity should have its own unique conversation thread.

9. Maintain Existing Design System

Do not modify:

• navigation bar
• hamburger menu
• Chats entry point
• typography
• card styling
• grid structure
• avatar placeholders

Only refine layout density and interaction behavior.