# Design system

## Style direction

Pixture uses a pastel neobrutalist visual language:

- soft pastel fills
- strong dark borders
- offset hard shadows
- bold display typography for labels and headings
- rounded but chunky surfaces

## Token source of truth

All shared visual values live in:

- `apps/frontend/src/styles/_design-tokens.scss`

That file defines:

- color palette
- semantic aliases
- typography
- spacing
- radii
- border widths
- neobrutalist shadow system
- motion timing

## Reusable UI components

Shared frontend primitives live in:

- `apps/frontend/src/app/ui`

Current component set includes:

- button
- card
- input
- textarea
- checkbox
- select
- combobox
- accordion
- tabs
- tooltip
- spinner
- badge
- toast stack

## Rules for future work

- Prefer using the shared components before creating new page-specific UI
- Prefer tokens over hard-coded CSS values
- If a new reusable pattern is needed, add it to the shared UI folder and document it here
- Keep the index page usable as a living showcase for the design system
