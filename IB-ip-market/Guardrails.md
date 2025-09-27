## Project Guardrails (Webflow + Process)

These are the essential, high-impact rules. Follow them by default.

- Publishing: Never publish without explicit approval. Use preview/staging only.
- URLs: Keep slugs stable; prepare 301 redirects before any change.
- Reversibility: Do not delete pages/components/classes/CMS objects; archive instead. Export a backup before structural changes.
- Components: Prefer Components; do not modify a base Component with live instances without approval.
- Styles: Reuse existing classes; follow BEM naming; do not edit global tag styles; verify all breakpoints (xxl → tiny).
- CMS: Do not change collection slugs. Add fields as optional → migrate data → then mark required. Archive items, do not delete. Test imports/updates in staging first.
- Performance & SEO: Optimize media and lazy-load; target Lighthouse ~90+. Set alt text, semantic headings, and consistent meta/Open Graph. Ensure staging is noindex.
- Accessibility: Maintain logical heading order, keyboard navigation, visible focus states, and WCAG AA contrast.
- Scripts & Secrets: No third-party scripts or trackers without approval; keep secrets out of code; version and document custom scripts.
- Process: Summarize planned changes before; summarize diffs after; keep a lightweight changelog; ask when requirements are ambiguous or risky.


---
Owner: Owen Koh  
Last updated: 2025-09-24
