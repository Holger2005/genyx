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

## Manual verification

- Open `/es` and `/en` and check all six service descriptions.
- Check 320, 768, 1440, 1920 and 3840 CSS-pixel viewports without horizontal overflow.
- Open the menu with Enter, navigate with Tab, close with Escape and verify focus restoration.
- Check anchor navigation, language switching and reduced-motion behavior.
- Move the pointer and scroll; verify the sculpture reacts without a continuous render loop.
- Disable hardware acceleration or simulate WebGL context loss and verify the SVG fallback.
- Verify that unfinished commercial integrations do not claim to accept requests.
- Record Lighthouse and real-device measurements before claiming performance targets.
