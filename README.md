# visionproeyecare

A **total redesign** of **visionproeyecare.com** (Vision Pro — Spring, TX; Paul Proske, O.D.)
— all 157 pages — built by the `site-reforge` pipeline and hardened for public hosting.

**Preview: https://sgencms.github.io/visionproeyecare/**

Pure static. No build step, no dependencies, no backend. Serve the folder, or use the preview
link above.

> This is an **unofficial development copy** published for build review. It is not operated
> by, affiliated with, or endorsed by Vision Pro. The real site is
> https://www.visionproeyecare.com/.

## What this is, and what it is not

This is **not** a pixel-faithful clone. It is a commissioned redesign:

| | |
| --- | --- |
| **Content, imagery, branding, contact details, URLs** | Vision Pro's own, from `visionproeyecare.com`. Nothing was written as new copy. |
| **Navigation model and page anatomy** | modelled on `eyetrendsclearlake.com` — top bar, a Services mega-menu grouped into care clusters, an Eyewear mega-menu with four featured categories, and a persistent *Book* call to action. **No content or asset came from that site.** |
| **Visual design** | new — the "Clear Focus" system, built on Vision Pro's own measured brand blue `#0e6ba4` and gold `#f9d446`. |
| **Platform** | removed. No WordPress, no EyeCarePro theme, no Gravity Forms, no Google Tag Manager, no trackers. |

Because it is a redesign rather than a clone, there is no pixel gate. That is why this preview
can carry a **rendered disclosure banner** on every page.

## Verification

These figures were measured by the pipeline, not judged by eye. The first six rows come from the
handoff build's audit. The last three were re-read from this tree as published.

| Check | Result |
| --- | --- |
| Content recall vs the live source, all 157 pages | **99.96% mean**; lowest page 95.24% (`/template/footer`, a noindex platform template); floor 95% |
| Pages mapped | **157 / 157** at their original URLs, 0 missing |
| Claims traced to the live site (`sr-fabrication`) | **SOURCED**: 491 claims across 159 files, 0 untraced |
| Platform decontamination | **CLEAN**: 0 findings across 168 files |
| Responsive + a11y sweep, 390 / 768 / 1024 / 1440 px | **0 findings** across 636 page × width sweeps |
| Gate (`sr-gate.mjs`) | 26 PASS · 3 FAIL · 0 UNPROVEN. Each red is explained below |
| Preview hardening, re-read from the shipped bytes | **159 / 159 pages** |
| Reference audit: every local `href` / `src` / `srcset` / `url()` resolved against its own page | **24,016 checked; 0 escape the site root, 0 missing, 0 root-relative** |
| Rendering at this preview's subpath, every page at 1440 and 390 px | **316 page loads (158 pages × 1440 / 390 px): 0 requests ≥ 400, 0 broken images, 0 console errors, 0 requests outside `/visionproeyecare/`, 0 horizontal overflow at 390** |

**Why the three red gate checks are red:**

- **C04, content captured for every page.** The live site itself serves 5 pages with no body
  text, among them `/eye-care-services/faq/` and `/contact-us/testimonials/`. This was confirmed
  in a real browser. The rebuild keeps them as they are and does not invent content for them.
- **C06, SEO inventory.** 6 source pages have an empty `<title>` on the live site. The rebuild
  derives a title from each page's own H1 and marks the page `noindex`.
- **C22, pixel parity.** This check measures fidelity to the design the brief asked to
  *replace*. The drift it reports is the deliverable.

## Hardening applied to this public copy

`PROVENANCE.json` counts every one of these changes.

1. `noindex, nofollow, noarchive, nosnippet` on every page, and `robots.txt` disallows
   everything. A public duplicate must not compete with the practice's own site.
2. `og:url` points at this preview, `og:description` is replaced with the disclosure, and
   `og:image` / `twitter:image` are removed. `noindex` does not stop link-unfurl crawlers, so
   without this a pasted link would render a card indistinguishable from the practice's own.
3. **JSON-LD removed.** It asserted the practice's identity, address, telephone and opening
   hours.
4. **Both patient forms made inert**: `action=""`, `onsubmit="return false"`,
   `data-preview="inert"`, plus a visible notice above each form. The registration form collects
   health information, and on a public URL nobody should believe they submitted it. The notice
   routes to the practice's real booking link and phone number. Site search still works.
5. `<meta name="referrer" content="no-referrer">`, so outbound clicks don't reveal this URL to
   third parties.
6. A **rendered disclosure banner** on every page.
7. `sitemap.xml` and `llms.txt` are not shipped, because both advertise the practice's real
   URLs and invite crawlers. The Netlify-only `_headers` / `_redirects` are not shipped either;
   GitHub Pages ignores them.
8. **The map embed uses no API key.** The live site embeds its map with its own Google Maps
   API key. A key pushed to a public GitHub repository is flagged by secret scanning to Google
   and to its owner. This key also renders from an unrelated origin (tested), so republishing it
   widens its exposure. The two map pages use Google's keyless embed of the same address instead.
   The pin lands in the same place, checked by screenshot.
9. `<link rel="canonical">` is **kept** pointing at the practice's real page. That is correct for
   a duplicate, and deliberately different from `og:url`.

## Known limits

- **The two patient forms do not submit.** This is deliberate (see 4 above). In the handoff
  build they are complete but unwired, waiting for the practice to point them at a
  HIPAA-eligible endpoint.
- **Outbound links still go to the practice's live services**: booking
  (`scheduleyourexam.com`), the patient history form (`crystalpm.com`), contact-lens reorders
  (`meetmarlo.com`) and payments (`square.link`). Navigation is not blocked, and `no-referrer`
  keeps this URL out of the request.
- **Three pages load a third-party frame** when viewed: www.youtube-nocookie.com on `/eye-care-services/eye-emergencies-pink-red-eyes/`; maps.google.com on `/hours-location/` and `/location/vision-pro/`. Nothing else leaves the page, because fonts, images, scripts and styles are all self-hosted.
- **27 images were refused by the live site's CDN (HTTP 403).** The pipeline does not retry past
  a refusal, so each placement uses another of Vision Pro's own images instead. The practice can
  supply the originals.
- **Six decorative product images are AI-generated** (fal.ai FLUX [dev]): the four eyewear
  category tiles, the eyewear mega-menu and two page heroes. Each shows only eyewear or a lens
  case: no person, no premises, no brand, no result. They live under
  `assets/img/generated/` so they can be identified as generated.
- **The live site contradicts itself, and the rebuild reproduces each conflict rather than
  choosing a side.** It gives two street numbers (20920 on every page and the storefront door,
  20290 in one home-page sentence) and two phone numbers. One blog post is titled "Spring, CO"
  and links four times to a Colorado practice. All of this is listed for the practice to settle
  in the handoff `CHANGE-LOG.md`.
- **Commit metadata is public**, including the committer email.

## Licence / ownership

All site content, imagery, trademarks and branding belong to Vision Pro. This repository is an
unaffiliated development artifact and asserts no rights over them. The typefaces are Plus
Jakarta Sans (SIL Open Font License 1.1) and Instrument Serif (SIL OFL 1.1), both self-hosted.
