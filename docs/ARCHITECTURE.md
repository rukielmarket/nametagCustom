# Architecture

## Runtime

React + TypeScript + Vite hosts a static client-side editor. Vite's `base: './'` keeps assets addressable under a GitHub Pages project path. Three.js via React Three Fiber loads only the currently selected GLB. Drei's OrbitControls provides pointer, wheel, and touch orbit/zoom.

## Configuration

`src/data/colors.ts` defines the shared palette. `src/products/*/config.ts` defines products, model choices, font preview metadata, configurable model paths, and part-to-mesh mappings. `src/types/configurator.ts` describes these contracts. UI components receive configuration and state; they do not contain product-specific mesh names or palette values.

## State and data flow

`App` owns one customization state: product ID, model ID, font ID, active part ID, and colors keyed by part ID. Product/model changes retain color choices for matching part IDs. The selected model path and part mappings flow to `ProductPreview`; loaded meshes are recolored by configured name, and absent files/names report a readable fallback/error. The selected color updates only the active part.

## Extension

Add a product configuration and place its assets in `public/models/<product-id>/`. Register it in `src/data/products.ts`. Shared selectors and preview render the new product from its definition. Font preview files live in `src/assets/fonts/` and are bundled with relative URLs for GitHub Pages.

## Current prototype assets

No GLB files were included at initialization. The name-tag demo therefore shows a lightweight procedural preview while clearly reporting that the selected GLB is unavailable. The eight supplied WOFF2 font files are connected to the font picker. Add each `model.path` asset and configure matching mesh names to enable production model coloring.
