---
name: Daybook
description: Small notes. Better recaps.
colors:
  action-violet: "#6246bc"
  hover-violet: "#5336ad"
  label-violet: "#6b50c4"
  violet-wash: "#f0ecfa"
  paper-ivory: "#fbfaf7"
  warm-canvas: "#f5f3ed"
  ink: "#25222d"
  muted-ink: "#77727c"
  recap-sand: "#f0ebe1"
  recap-rust: "#ad664e"
  danger-coral: "#ad5848"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "clamp(40px, 5vw, 62px)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "27px"
    fontWeight: 500
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "16px"
    lineHeight: 1.45
  label:
    fontFamily: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "11px"
    fontWeight: 800
    letterSpacing: "0.14em"
rounded:
  control-sm: "8px"
  control: "10px"
  action: "12px"
  history: "13px"
  capture: "18px"
  panel: "20px"
  dialog: "22px"
  pill: "999px"
spacing:
  tight: "10px"
  mobile-gutter: "18px"
  grid-gap: "24px"
  panel-inset: "28px"
  page-gutter: "32px"
components:
  button-primary:
    backgroundColor: "{colors.action-violet}"
    textColor: "{colors.white}"
    rounded: "{rounded.action}"
    padding: "0 19px"
  button-primary-hover:
    backgroundColor: "{colors.hover-violet}"
  button-complete:
    backgroundColor: "{colors.violet-wash}"
    textColor: "{colors.action-violet}"
    rounded: "{rounded.control-sm}"
    padding: "0 11px"
  button-danger:
    backgroundColor: "{colors.danger-coral}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "10px 15px"
  capture-mode-active:
    backgroundColor: "{colors.white}"
    textColor: "{colors.action-violet}"
    rounded: "{rounded.control-sm}"
    padding: "9px 16px"
  panel-default:
    backgroundColor: "rgba(255, 255, 255, 0.66)"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-inset}"
  history-current:
    backgroundColor: "{colors.violet-wash}"
    rounded: "{rounded.history}"
    padding: "13px"
---

# Design System: Daybook

## Overview

**Creative North Star: "Quiet Ledger"**

Daybook treats the workday as a record worth keeping without making it feel like bookkeeping. Calm and capable typography, warm ivory ground, violet decisions, and orderly groups make short notes easy to write and easy to recover. This is an operating interface, not a metrics dashboard.

The forms and panels are softly layered rather than flat or dramatically floating. Controls feel soft and precise: generous enough to invite quick capture, restrained enough to let the entries remain the focus. The one playful gesture is the slightly tilted spark mark; it does not become a decorative motif across the interface.

**Key Characteristics:**
- Warm paper-like canvas with translucent white work surfaces.
- Georgia headings paired with an Inter-first system sans stack for reading and controls.
- Violet for capture, completion, selection, and focus; warm rust for the previous-workday recap; coral for destructive actions.
- Rounded, lightly bordered surfaces with a stronger ambient lift around the capture form.

## Colors

Violet and ivory carry the system; the warmer recap surface distinguishes reflection from the active work area without turning the page into a second palette.

### Primary
- **Action Violet** (`action-violet`): high-commitment buttons and task-completion text; its darker partner (`hover-violet`) signals hover.
- **Ledger Violet** (`label-violet`): uppercase section labels and small mark details; related to the action color but not a substitute for it.
- **Violet Wash** (`violet-wash`): the mode selector, selected history day, completion controls, and count badges.

### Secondary
- **Recap Rust** (`recap-rust`): restrained previous-workday labeling and small check accents.
- **Recap Sand** (`recap-sand`): the previous-workday panel's warmer surface.

### Tertiary
- **Delete Coral** (`danger-coral`): destructive confirmation only; it does not compete with the main capture action.

### Neutral
- **Paper Ivory** (`paper-ivory`): dialog interiors and the upper canvas tone.
- **Warm Canvas** (`warm-canvas`): the lower canvas tone and root background.
- **Ink** (`ink`): primary reading text; **Muted Ink** (`muted-ink`): supporting copy.
- **White** (`white`): button text, selected mode, and the translucent panels when used with alpha.

**The One-Action Rule.** Use violet for ordinary action and coral only for destructive confirmation; do not give both meanings the same accent.

## Typography

Georgia supplies the gentle editorial voice; the body uses an Inter-first system sans stack. Inter is named in CSS but is not bundled or imported, so devices without it render with a system fallback. Do not assume a downloaded webfont exists.

The display role is the large capture question; the headline role names panels and history. Body text stays simple and readable; small uppercase labels organize rather than decorate. The hero supporting sentence is slightly larger than ordinary activity text, while metadata and history previews are smaller and more muted. The exact reusable role values live in the frontmatter.

**The Record-First Rule.** Use serif type for the prominent question and section headings; keep entries, dates, controls, and supporting instructions in sans serif so the record scans quickly.

## Layout

The page has a centered maximum width (1180px) with desktop side gutters (32px). The introductory capture area is narrower (850px) and centered above the task panels. To-dos take a full-width panel; below them, today's work and the previous workday form an asymmetric grid (1.55fr / 0.85fr) with a gap (24px). Seven history tiles form a single row at wide widths, then four columns at 960px and two at 680px.

At 960px the work panels stack. At 680px the page gutters shrink (18px), the capture input and button stack, panels tighten their padding (21px), and the header hides the date text while retaining its status dot. Internal list scrolling starts after five visible entries; do not turn the whole layout into a dense dashboard grid. The mobile page minimum is 320px.

## Elevation & Depth

Depth is softly layered: the canvas combines a warm vertical gradient with a faint violet glow; translucent panels have hairline borders and low ambient shadows. The capture form has stronger elevation and gains a violet focus halo; history tiles lift slightly on hover, while dialogs use the deepest shadow against a blurred, darkened backdrop. The exact shadow and motion values are recorded in the sidecar.

**The Quiet Elevation Rule.** Keep resting surfaces subtly separated by translucency and border; reserve noticeable lift for input focus, hover feedback, and modal overlays.

## Shapes

Controls, history tiles, panels, and dialogs use successively larger soft corners, with their actual radii in the frontmatter. Status dots, activity check marks, and count badges are circular or pill-shaped. Delicate dividers separate entries instead of enclosing every row in its own card; the brand mark is the only rotated shape.

## Components

### Buttons
- **Primary capture:** solid action violet, white text, rounded corners, a small shadow, and a short rise with a darker violet on hover. Disabled state lowers opacity. On mobile it becomes a full-width stacked-row action with a minimum height (48px).
- **Completion:** compact lavender action with violet text, embedded beside a pending to-do.
- **Icon actions:** edit and delete are quiet until row hover or keyboard focus; pending to-do actions remain visible. Destructive hover changes to pale coral.
- **Destructive confirmation:** coral-filled button paired with a neutral cancel action; it appears only inside the confirmation dialog.

### Chips
- **Mode switch:** lavender enclosing surface with two compact segments; the selected segment becomes white with a slight shadow. Its state is represented by `aria-pressed`.
- **Count / date badges:** small pill labels; violet-on-lavender counts and a warm, translucent date chip on the recap panel.

### Cards / Containers
- **Work panels:** translucent white, hairline borders, large soft corners, restrained ambient shadow, and generous internal space. The previous-workday panel substitutes a warm sand tone; the today's-work panel is slightly more opaque.
- **History tiles:** compact cards with clipped text previews and a small count circle; today uses a lavender surface and violet count. Hover adds a small rise, and keyboard focus receives a visible outline.
- **Dialogs:** ivory interiors with the largest corners and strongest elevation; the backdrop is blurred and dimmed.

### Inputs / Fields
- **Capture field:** borderless input inside an elevated, translucent form shell; focus strengthens its border and adds a violet halo. The submit action sits beside it on desktop and beneath it on mobile.
- **Inline edit:** a pale field with a violet border and a small focus ring, followed by compact Save and Cancel controls.

### Activity rows
- Completed entries use a filled lavender check circle; pending to-dos use an outlined circle. Hairline top dividers and muted time metadata keep the rows scannable without adding nested cards.

## Do's and Don'ts

### Do:
- **Do** keep a clear path from capture to to-dos, today's work, previous workday, and history.
- **Do** use warm surfaces and light borders to separate work areas, reserving the most prominent in-page shadow for the capture form and deeper elevation for dialogs.
- **Do** retain distinct keyboard-focus treatments and the existing reduced-motion behavior when extending controls.

### Don't:
- **Don't** turn the page into a corporate dashboard with dense metric widgets, heavy navigation chrome, or data-viz decoration.
- **Don't** use coral as a general CTA or make ordinary actions look destructive.
- **Don't** replace every row divider with another floating card; the entries should remain the content.
