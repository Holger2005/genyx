# Sprint 1 — Visual experience

## Iteration 1.1

- Monochrome design tokens, fluid typography and responsive layout.
- Native modal navigation with keyboard dismissal and focus management.
- Bilingual content through the existing application repository contract.
- Six service cards and clearly labeled placeholders for commercial integrations.
- Lightweight decorative SVG sculpture concept with reduced-motion support.

## Iteration 1.2

- Native WebGL mesh with two geometric rings and stylized metallic and translucent shading.
- Pointer and scroll-driven rotation; no continuous animation loop.
- Render only when visible, cap canvas resolution and respect reduced-motion preference.
- Preserve the SVG fallback on unsupported devices or context loss.
- Dispose GPU resources and disconnect browser listeners on unmount.
- Unit tests for mesh generation and resolution limits.

No additional runtime packages or external requests were introduced. Native WebGL was
selected for this prototype instead of Three.js to avoid introducing unverified dependencies.
The shading is stylized, not physically accurate glass or titanium. Browser verification,
performance measurements, final art direction and accessibility tests remain acceptance gates.

## Iteration 1.3

- CSS entry motion for the hero and staggered modal navigation.
- Progressive scroll-linked section reveals and reading progress in supported browsers.
- Scroll-driven circular-to-hexagonal ring deformation with eased, bounded parameters.
- Refined metallic rim lighting and translucent blending.
- Focusable anchor destinations and focus transfer when choosing a modal menu link.
- Reduced-motion preference disables decorative motion; unsupported CSS falls back to static content.
- Unit tests for deformation boundaries and invalid input.

No new dependencies were added. Page entry motion is implemented, but a full cross-route
exit/entry transition is not yet implemented. Shader normals are approximate during deformation;
the materials remain stylized rather than physically based.

## Manual verification

- Open `/es` and `/en` and check all six service descriptions.
- Check 320, 768, 1440, 1920 and 3840 CSS-pixel viewports without horizontal overflow.
- Open the menu with Enter, navigate with Tab, close with Escape and verify focus restoration.
- Check anchor navigation, language switching and reduced-motion behavior.
- Move the pointer and scroll; verify the sculpture reacts without a continuous render loop.
- Disable hardware acceleration or simulate WebGL context loss and verify the SVG fallback.
- Verify that unfinished commercial integrations do not claim to accept requests.
- Verify scroll-linked reveals and progress in supported browsers and static fallback elsewhere.
- Check geometry morphing and keyboard focus after selecting a modal link.
- Record Lighthouse and real-device measurements before claiming performance targets.
