# visionproeyecare

A **total redesign** of **visionproeyecare.com** (Vision Pro — Spring, TX; Paul Proske, O.D.) —
all 157 pages — built by the `site-reforge` pipeline and hardened for public hosting.

**Preview: https://sgencms.github.io/visionproeyecare/**

This is a pure static site with no build step, no dependencies and no backend. Serve the
folder, or use the preview link above.

> This is an **unofficial development copy** published for build review. It is not operated
> by, affiliated with, or endorsed by Vision Pro. The real site is
> https://www.visionproeyecare.com/.

## What this is, and what it is not

This is **not** a pixel-faithful clone. It is a commissioned redesign:

| | |
| --- | --- |
| **Content, imagery, branding, contact details, URLs** | All from `visionproeyecare.com`, except five decorative AI-generated product images (see *Known limits*). No page copy was written: every sentence of body text comes from the practice's live site. Some of it, such as the contact-lens product descriptions, is manufacturer copy the practice republished. The redesign adds only interface text: menu-group labels, section labels such as "Related eye care" and "On this page", and descriptive alt text for the practice's photographs. Where a label touches a fact ("Spring, TX", "An independent practice"), the fact is the live site's own. |
| **Navigation model and page anatomy** | Modelled on `eyetrendsclearlake.com`: a top bar, a Services mega-menu grouped into care clusters, an Eyewear mega-menu with four featured categories, and a persistent *Book* call to action. **No content or asset came from that site.** |
| **Visual design** | New. It is the "Clear Focus" system, built on Vision Pro's own measured brand blue `#0e6ba4` and gold `#f9d446`. |
| **Platform** | Removed: no WordPress, no EyeCarePro theme, no Gravity Forms, no Google Tag Manager, no trackers. |

Because this is a redesign rather than a clone, matching the old design pixel for pixel is not
a goal.

## Verification

These figures were measured by the pipeline, not judged by eye, and filled in from the
measurement files. The first six rows come from the handoff build's audit. The last three were
re-read from this tree as published.

| Check | Result |
| --- | --- |
| Content recall vs the live source, all 157 pages | **99.96% mean; lowest page 95.24% (`/template/footer`, a noindex platform template); floor 95%** |
| Pages mapped | **157 / 157** at their original URLs, 0 missing |
| Claims traced to the live site (`sr-fabrication`) | **SOURCED: 491 claims across 159 files, 0 untraced** |
| Platform decontamination | **CLEAN: 0 findings across 168 files** |
| Responsive + a11y sweep, 390 / 768 / 1024 / 1440 px | **0 blocker · 0 major** across 636 page × width sweeps. Also 12 minor, all “Text clipped by overflow:hidden” on screen-reader-only text, which is clipped by design; and 4 nit, all “Heading level skipped”. |
| Gate (`sr-gate.mjs`) | 26 PASS · 3 FAIL · 0 UNPROVEN. The verdict is NOT-READY, and the handoff zip was packaged with a recorded override. Each red is explained below |
| Preview hardening, re-read from the shipped bytes | **159 / 159 pages** |
| Reference audit: every local `href` / `src` / `srcset` / `url()` resolved against its own page | **24,016 checked; 0 escape the site root, 0 missing, 0 root-relative** |
| Rendering at this preview's subpath, every page at 1440 and 390 px | **316 page loads (158 pages × 1440 / 390 px): 0 requests ≥ 400, 0 broken images, 0 console errors, 0 requests outside `/visionproeyecare/`, 0 horizontal overflow at 390** |

**Why the three red gate checks are red:**

- **C04, content captured for every page.** The live site itself serves 5 pages with no body
  text, among them `/eye-care-services/faq/` and `/contact-us/testimonials/`. This was
  confirmed in a real browser. The rebuild keeps them as they are and does not invent content
  for them.
- **C06, SEO inventory.** 6 source pages have an empty `<title>` on the live site. The rebuild
  derives each title from the page's own H1 and marks the page `noindex`.
- **C22, pixel parity.** This check measures fidelity to the design the brief asked to
  *replace*. The drift it reports is the deliverable.

## Hardening applied to this public copy

`PROVENANCE.json` counts every one of these changes.

1. **`noindex, nofollow, noarchive, nosnippet` on every page.** This is the control that
   actually keeps the pages out of search results. A `robots.txt` with `Disallow: /` is also
   shipped, but it has **no effect** here: crawlers read `robots.txt` only at the host root
   (`sgencms.github.io/robots.txt`, which this project site cannot provide), not under
   `/visionproeyecare/`. GitHub Pages cannot send an `X-Robots-Tag` header either. That leaves
   the non-HTML files with no index control of their own, such as the practice's privacy-notice
   PDF, images and `search-index.json`. On this site they are linked only from pages marked
   `nofollow`. The repository itself is public, and github.com shows its files like any public
   repository's.
2. `og:url` points at this preview and `og:description` carries the disclosure. `og:image`,
   `twitter:image` and the old theme's `og:featured_image` are removed. `noindex` does not stop
   link-unfurl crawlers, so without this a pasted link would render a card indistinguishable from
   the practice's own.
3. **JSON-LD removed.** It asserted the practice's identity, address, telephone and opening
   hours.
4. **Both patient forms made inert, with or without JavaScript.**
   - Each form gets `action=""`, `onsubmit="return false"` and `data-preview="inert"`.
   - Each **submit button is replaced by a disabled `type="button"`**. With no submit control
     and several text fields there is no Enter-key submission either, so the forms cannot post
     even when scripting is off.
   - A visible notice above each form says so and points to the practice's real booking link
     and phone number.

   The registration form collects health information, and on a public URL nobody should believe
   they submitted it. Site search still works.
5. `<meta name="referrer" content="no-referrer">`, so outbound clicks don't reveal this URL to
   third parties. The only exceptions are the YouTube video frames (`/eye-care-services/eye-emergencies-pink-red-eyes/` and `/our-eye-doctors/`). YouTube
   refuses to play without a referrer (player Error 153), so those frames alone send the bare
   origin (`https://sgencms.github.io/`), never a path.
6. **No on-page disclosure banner.** One was shown on every page until 2026-09-24, when it was
   withdrawn at the operator's request. The disclosure is still carried by `noindex`, by
   `og:description` / `twitter:description` (a pasted link unfurls as the disclosure), by the
   notice on each patient form, and by this README.
7. `sitemap.xml` and `llms.txt` are not shipped, because both advertise the practice's real
   URLs and invite crawlers. The Netlify-only `_headers` / `_redirects` are not shipped either,
   since GitHub Pages ignores them.
8. **The map embed uses no API key.** The live site embeds its map with its own Google Maps API
   key. A key pushed to a public GitHub repository is flagged by secret scanning to Google and to
   its owner. This key also renders from an unrelated origin (tested), so republishing it would
   widen its exposure. The two map pages use Google's keyless embed of the same address instead,
   and a screenshot check confirms the pin lands in the same place.
9. `<link rel="canonical">` is **kept** pointing at the practice's real page. That is correct for a
   duplicate, and deliberately different from `og:url`.

## Known limits

- **The two patient forms do not submit.** This is deliberate (see 4 above). In the handoff build
  they are complete but unwired, waiting for the practice to point them at a HIPAA-eligible
  endpoint.
- **Outbound links still go to the practice's live services**: booking
  (`scheduleyourexam.com`), the patient history form (`crystalpm.com`), contact-lens reorders
  (`meetmarlo.com`) and payments (`square.link`). Navigation is not blocked, and `no-referrer`
  keeps this URL out of the request.
- **4 pages load a third-party frame** when viewed: www.youtube-nocookie.com on `/eye-care-services/eye-emergencies-pink-red-eyes/` and `/our-eye-doctors/`; maps.google.com on `/hours-location/` and `/location/vision-pro/`. Nothing else leaves the page, because fonts, images, scripts and styles are all self-hosted.
- **27 images were refused (HTTP 403)**: 26 by the live site's image CDN (`da4e1j5r7gw87.cloudfront.net`) and 1 by the old web vendor's server (`www.eyecarepro.net`, a background image in its theme stylesheet). The pipeline does not retry past a refusal. Each placement uses another image instead (one of Vision Pro's own, or a generated product image as a page hero), or none, inside article text. The practice can supply the originals.
- **5 decorative product images are AI-generated** (fal.ai FLUX [dev]): `eyewear-contacts`, `eyewear-frames`, `eyewear-kids`, `eyewear-sunglasses` and `frames-flatlay`. They appear in the four eyewear category tiles, in the eyewear mega-menu and as the page hero on `/benefits-of-prescription-sunglasses-for-everyday-eye-protection/`, `/contact-lenses/` and `/eyeglasses/`. That includes a blog post whose own photograph was refused by the CDN. Each shows eyewear or contact-lens care items. None shows a person, the practice or its premises, a readable brand, or a clinical result; a few frames carry garbled, illegible pseudo-lettering. What each one shows, checked by eye, is listed in the handoff `CHANGE-LOG.md`. They live under `assets/img/generated/` so they can be identified as generated.
- **The live site contradicts itself, and the rebuild reproduces each conflict rather than
  choosing a side.** Some examples:
  - Two street numbers: 20920 on every page and on the storefront door, 20290 in a home-page
    sentence and in one blog post's "Address:" line.
  - Two phone numbers.
  - A blog post titled "Spring, CO" that links four times to a Colorado practice.
  - Empty template tokens on the Stellest and scleral-lens pages ("At Vision Pro in , we…",
    "call to discuss", "a consultation with and…").

  All of them are listed for the practice to settle in the handoff `CHANGE-LOG.md`.
- **Commit metadata is public**, including the committer email.

## Licence / ownership

This repository is an unaffiliated development artifact and asserts no rights over any of its
content.
- The practice's own writing, its photography and the Vision Pro name and logo belong to Vision
  Pro.
- The practice's site also republished third-party material, and this copy carries it as found.
  The owners' rights remain theirs:
  - product descriptions and images supplied by contact-lens and eyewear manufacturers;
  - the Systane iLux patient-education video;
  - two embedded YouTube videos;
  - the logos of the insurance plans it accepts (United Healthcare, Blue Cross Blue Shield, Cigna,
    Humana, Medicare, VSP and others).

  The trademarks among them (ACUVUE, Alcon, Bausch + Lomb, CooperVision, Latisse, Systane and
  others) belong to their owners.
- The decorative images under `assets/img/generated/` were generated for this redesign.
- The typefaces are Plus Jakarta Sans (SIL Open Font License 1.1) and Instrument Serif (SIL OFL
  1.1), both self-hosted.
