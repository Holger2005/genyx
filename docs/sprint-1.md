# Sprint 1 — Visual experience

## Iteration 1.1

- Monochrome design tokens, fluid typography and responsive layout.
- Native modal navigation with keyboard dismissal and focus management.
- Bilingual content through the existing application repository contract.
- Six service cards and clearly labeled placeholders for commercial integrations.
- Lightweight decorative SVG sculpture concept with reduced-motion support.

No additional runtime packages or external requests were introduced. The SVG is not a real
WebGL model. The actual glass and titanium sculpture, scroll-linked geometry, adaptive rendering,
browser accessibility tests and device performance measurements remain future acceptance gates.

## Manual verification

- Open `/es` and `/en` and check all six service descriptions.
- Check 320, 768, 1440, 1920 and 3840 CSS-pixel viewports without horizontal overflow.
- Open the menu with Enter, navigate with Tab, close with Escape and verify focus restoration.
- Check anchor navigation, language switching and reduced-motion behavior.
- Verify that unfinished commercial integrations do not claim to accept requests.
- Record Lighthouse and real-device measurements before claiming performance targets.
