---
name: figma-to-code
description: |
  Turn a Figma frame into a page or component in this dashboard, matching the design pixel for pixel using the project's own tokens, shadcn components and icons. Use whenever the user shares a figma.com link, says "implement this design", "build this from Figma", "match the mockup", or pastes a design screenshot to build.
---

# Figma to Code

Builds UI from Figma with the project's design system, never with hardcoded values.

## Needs

- The **Figma MCP server** from `.mcp.json` (`https://mcp.figma.com/mcp`). On first use run `/mcp`, pick **figma**, then **Authenticate**.
- A Figma **Dev or Full seat** on a paid plan. Starter/View/Collab seats get about 6 calls a month, which isn't enough.
- No access? Work from a screenshot the user pastes plus the values they give you, and say the result is approximate.

## Steps

1. **Read the design.** With the frame URL (or node id): `get_design_context` for structure and styles, `get_screenshot` for the visual reference, `get_variable_defs` for the design tokens used.
2. **Map, don't copy.** Translate every value to the project's system:
   - Colors map to theme tokens (`bg-background`, `text-muted-foreground`, `bg-primary`, `border-border`, `bg-card`, `text-destructive`, `bg-sidebar`, `chart-1..5`). They're defined per theme in `src/styles/themes/*.css`. Never hex or `oklch()` literals in components.
   - Radius maps to `rounded-sm|md|lg|xl` (from `--radius`). Shadows map to `shadow-xs..2xl`. Fonts map to `font-sans|serif|mono`.
   - Spacing maps to the Tailwind scale. If Figma says 18px, pick the nearest step and mention it rather than using `p-[18px]`.
   - If a Figma color has no matching token, add a semantic token once in `src/styles/theme.css` (`:root`, `.dark`, `--color-<name>` in `@theme inline`) and tell the user which one you added.
3. **Reuse before you build.** Check `src/components/ui/` (shadcn on Base UI), `src/components/forms/fields/`, `src/components/data-table/`, `src/components/stat-card.tsx` (KPI cards) and `src/components/layout/page-container.tsx` first. Add a missing shadcn component with `bunx shadcn@latest add <name>`.
4. **Icons** come only from `@/components/icons`. If one is missing, register its Tabler icon there.
5. **Images** go to `public/images/` as WebP/AVIF (`bun run images:check`), rendered with `next/image` and `sizes`.
6. **Structure**: the page in `src/app/dashboard/<name>/page.tsx` (server component); UI in `src/features/<name>/components/`; data through `api/service.ts` → `queries.ts` (see the nextjs-starter skill). Copy the shape of a close match: `src/features/partners` (table + detail page), `src/features/payouts` (table + sheet form), `src/features/overview` (cards + chart in parallel-route slots).
7. **Responsive**: build mobile first. If Figma only has desktop, ask or make a sensible stack, and say which.
8. **Verify visually.** Run `bun run dev`, open the page, screenshot it and compare with `get_screenshot`: spacing, alignment, type sizes, colors in light and dark mode. Fix and repeat until it matches. Report anything you couldn't match.
9. **Gates**: `bun run typecheck && bun run lint && bun run build && bun run bundle:check`.

## Don'ts

- No inline styles or arbitrary values (`text-[13px]`, `#1a1a1a`) when a token or scale step exists.
- No new UI libraries for something shadcn already covers.
- No `<img>`, no PNG/JPG assets.
