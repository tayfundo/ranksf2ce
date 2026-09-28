# Project guide

## Architecture

This is a TanStack Start single-page search experience deployed on Netlify. The index route renders the player search component, which fetches a static ranking snapshot in the browser.

## Key paths

- `src/routes/__root.tsx`: document shell and social metadata
- `src/routes/index.tsx`: landing route
- `src/components/PlayerSearch.tsx`: search, matching, result, loading, and error states
- `src/styles.css`: visual system and responsive behavior
- `public/data/sf2ce-rankings.json`: source ranking snapshot

## Conventions

Use TypeScript for application code. Keep visible copy in Turkish. Preserve accessible labels, keyboard focus behavior, responsive layouts, and reduced-motion support. Avoid adding a database for the static snapshot; if data becomes user-editable or must be updated at runtime, use a Netlify platform persistence primitive.

## Data behavior

Search is case-insensitive, begins at two characters, and limits the suggestion panel to eight results. Player time is stored in seconds and displayed as rounded hours.
