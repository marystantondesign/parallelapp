Refine the Parallels discovery screen while keeping the existing layout, grid structure, card design, and navigation exactly as they are.

Do not redesign the screen.
Do not introduce new visual styles or experimental UI elements.
Only implement the structural updates described below.

1. Remove Redundant Title Section

Remove the content block under the navigation bar that currently contains:

Parallels
“New parallel identities you haven't connected with yet”

This section is redundant because the navigation bar already displays the screen title.

After removing it, the screen should no longer show this duplicate title block.

2. Replace Removed Section With Sorting + Search Controls

In the space where the redundant title block existed, add simple discovery controls that allow users to sort and search the list of identities.

Add the following two elements:

Sorting control

A sorting control that allows the user to reorder the identity cards.

Sorting options should include:

• Strongest Match
• Weakest Match
• Closest Universe
• Most Distant Universe

Changing the selected option should reorder the grid of identity cards accordingly.

Do not change the card design or card contents.

Search field

Add a search field that allows users to search identities by text.

The search should match against identity attributes such as:

• name
• job title
• interests
• descriptive keywords associated with that identity

Example: searching “design” should surface identities connected to design, art, or similar fields.

Search results should simply filter the visible cards in the grid.

3. Maintain Existing Card Design

Do not modify the card layout or visual styling.

Each card should remain exactly as it currently appears, including:

• avatar placeholder
• identity name
• identity number
• similarity percentage badge

Only the order and visibility of cards should change based on sorting or search.

4. Maintain Existing Grid Layout

Do not change:

• card size
• number of columns
• spacing between cards
• scrolling behavior

The grid should continue functioning exactly as it currently does.

5. Interaction Feedback

When a user taps a card, apply a subtle interaction state to indicate it has been selected.

Do not change colors or introduce new color tokens.
Use existing design system styling where possible.

6. Maintain Current Design System

Do not modify:

• navigation bar
• hamburger menu
• Chats entry point
• typography
• color palette
• avatar styling
• card structure

The goal is to extend the screen’s functionality without changing its visual system.