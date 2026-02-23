---
name: system-build
description: general rules for building frontend
---

## GENERAL RULES

### Responsiveness
- when designing for mobile, use component size that fits within their width and height margin
- when designing for tablet, use component size that fits within their width and height margin
- when designing for laptop, desktop, and large screens/higher resolutions, primarily use a fixed zoom level and scale the component size accordingly
    - example: for standard laptop size, use % zoom level
    - example: for mid-range to high-res size, use % zoom level
    - example: for higher full-hd / ultra wide higher than 1920 size, use % zoom level

### Layout
- use flexbox generally for layout of components, sections, containers
- use grid for layout of components, containers that are required to use grid
- create own scrollbar instead of the default scrollbar of browsers

### Designing
- primarily use rem for sizing of all components and layouts for responsive design
- if corresponding size can be translated to for example: h-24, instead of rem, use it
- use rem for font sizing
- use @theme for the color palette, font-family, font-color, etc.
- use icons from lucide-react instead of emojis

### Structure
- make sure theses functions update in real-time when data changes, for appropriate showing in UI
- always end the line with semicolon
- for naming convention use camelCase
- **useState**: 
    - use only for data that must trigger a UI re-render when changed
    - avoid storing derived data in state (e.g., if you have `items`, don't create an `itemsLength` state; just calculate `items.length` directly in the component body)
- **useEffect**: 
    - use strictly for syncing with external systems (API calls, subscriptions, global event listeners)
    - always return a cleanup function for listeners or intervals to prevent memory leaks
    - do not use to chain state updates or transform data (handle data transformations during the render phase instead)
    
- **useCallback**: 
    - use to memoize functions that are passed as props to optimized child components (e.g., children wrapped in `React.memo`)
    - use when a function is required as a dependency in another hook (like `useEffect`)
    - avoid wrapping every function in `useCallback` as the memoization process itself adds unnecessary overhead for basic components
- **useMemo**: 
    - use to cache computationally expensive calculations so they don't run on every single render
    - use to preserve referential equality of objects or arrays passed as props to prevent child re-renders
    - avoid using for simple math or basic variable assignments
- **useRef**: 
    - use for direct DOM element manipulation when absolutely necessary
    - use to hold mutable values that need to persist across renders but should **not** trigger a re-render when updated (like `setTimeout` IDs, previous state values, or tracking flags)

### JSON DATA
- use .json files for data storage in the data folder
- use object for data structure
    example:
        ```
            {
                "name": "John Doe",
                "age": 30,
                "city": "New York"
            }
        ```
- use array for data structure
    example:
        ```
            [
                {
                    "name": "John Doe",
                    "age": 30,
                    "city": "New York"
                },
                {
                    "name": "Jane Doe",
                    "age": 25,
                    "city": "Los Angeles"
                }
            ]
        ```