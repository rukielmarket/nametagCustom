# Rukiel Market Color Studio

- Use React, TypeScript, and Vite; keep the app deployable as a static GitHub Pages site (`base: './'`).
- Design mobile-first and verify layouts at phone, tablet, and desktop widths.
- Define products, models, parts, and color options in configuration/data, not product-specific UI branches.
- Keep 3D model assets organized by product under `public/models/` and load only the currently selected GLB.
- Apply colors to configured mesh/material names per part; missing assets or meshes must produce a usable fallback and a clear message.
- Do not generate 3D geometry from user-entered text. Use prebuilt GLB/GLTF models.
- Prioritize extensibility: new products should work by adding product configuration and assets.
- Keep colors in the shared color configuration; do not hardcode color values in UI components.
