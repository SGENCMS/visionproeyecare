# PROVENANCE

This tree is a **redesign** of `https://www.visionproeyecare.com/`, covering all 157 pages, which
was then modified for public hosting. Because it was modified, **this tree is not the handoff
deliverable** and must not be cited as one. Machine-readable counts are in `PROVENANCE.json`.
Every deviation is listed below.

## Capture

| | |
| --- | --- |
| Content source | `https://www.visionproeyecare.com/`: 157 pages, found through the sitemap and a same-origin BFS crawl. robots.txt was honoured, no page failed, no host refused, and the crawl was not truncated. |
| Structure source | `https://eyetrendsclearlake.com/`: **navigation model and page anatomy only**. No content, image, asset or word from that site appears here. |
| Captured | 2026-09-23 |
| Method | The `site-reforge` pipeline (crawl → extract → assets → capture → tokens → motion → plan → build → SEO → rebase), plus a zero-dependency Chrome DevTools Protocol bridge for the browser stages |
| Platform of origin | WordPress with the EyeCarePro theme, Gravity Forms and Google Tag Manager. All of it has been removed. |
| Design baseline | Computed style measured in a real browser at 390 / 768 / 1024 / 1440 px (799–817 elements per viewport), not read from source CSS |

### Forty thin pages were confirmed in a real browser

The static fetch flagged 40 pages as possible script-rendered shells, with little body text
against a lot of script. Each one was loaded in headless Chrome and its post-JavaScript DOM
saved. **None** carried materially more text once rendered. These pages are genuinely thin on
the live site, among them `/eye-care-services/faq/` and `/contact-us/testimonials/`, so they
are kept thin rather than filled. The untouched static capture is kept separately as the
evidence record and was not edited.

## What the redesign changed, and what it preserved

| | |
| --- | --- |
| **Preserved** | Every page's text (99.96% mean; lowest page 95.24% (`/template/footer`, a noindex platform template); floor 95%). All 157 URLs are unchanged, along with titles, meta descriptions, canonicals, both patient forms (every field, label and option), contact details and hours. |
| **Written** | No page copy. The only new text is interface text: menu-group labels, section labels ("Related eye care", "On this page", "In this section", "Page tools") and descriptive alt text for the practice's photographs. Any fact a label touches is from the live site. |
| **Added** | 7 sections, by change-control decision: Site search page; Host 404 page; home: "One of the few independent optometry clinics" band; Doctor band on service pages; Related care cards; Book-an-appointment band before the footer; Page tools panel. |
| **Removed** | No section: the 662 change-control rows are 235 IMPROVE, 420 PRESERVE, 7 ADD and **0 REMOVE / 0 REPLACE**. Platform plumbing is gone: GTM, the voice-search widget, the seasonal snow effect, and the "Powered by EyeCarePro" credit. |
| **Generated** | 5 decorative product images (fal.ai FLUX [dev]), in the eyewear tiles and mega-menu and as the page hero on `/benefits-of-prescription-sunglasses-for-everyday-eye-protection/`, `/contact-lenses/` and `/eyeglasses/`. They show eyewear or a lens case only, with no person, no premises, no brand and no result, and live under `assets/img/generated/`. A further 1 (`lens-light`) was generated but is used nowhere, so it is not shipped. |

## Deviations applied for public hosting

The "Rendered?" column says whether the change can affect what is painted on the page.

| # | Change | Pages | Rendered? |
| --- | --- | --- | --- |
| 1 | `robots` set to `noindex, nofollow, noarchive, nosnippet`. The build shipped `max-image-preview:large` (indexable) on 146 pages and `noindex, follow` on 13. **This is the effective index control**; see #9. | 159 | No |
| 2 | `<meta name="referrer" content="no-referrer">` inserted. On its own it stopped the YouTube player (Error 153); #14 exempts that one frame. | 159 | Only via the video, fixed by #14 |
| 3 | `<title>` **not** prefixed. This follows the org's standing rule; the prefix was withdrawn from the urbanoptics preview on 2026-09-22. The banner, `og:description` and `noindex` carry the disclosure instead. | — | — |
| 4 | `og:url` repointed at this preview; `og:description` and `twitter:description` replaced with the disclosure. `og:image` / `twitter:image` removed, and so is the old theme's non-standard `og:featured_image` (66 pages), so no image-bearing meta remains. | 159 | No |
| 5 | `schema.org` JSON-LD removed (1,138 blocks). It asserted the practice's identity, address, telephone and opening hours. | 159 | No |
| 6 | Every `<form>` marked `data-preview="inert"`. The two patient forms also get `action=""` and `onsubmit="return false"`, and each **submit button becomes a disabled `type="button"`**. Without that last step, a browser with JavaScript off still posted every field, as an adversarial review found; see *Review after the first publish*. | 318 forms | **Yes** (button shown disabled) |
| 7 | A visible notice above each patient form: "This form is disabled in this preview", followed by the practice's real booking link and phone number from the build's sourced config | 2 | **Yes** |
| 8 | A rendered disclosure banner inserted as the first child of `<body>` (after the skip link), with its own stylesheet, `styles/preview-banner.css`. It sits at `z-index: 1`, so it never covers the skip link, header, menus or drawer. | 159 | **Yes** |
| 9 | `robots.txt` replaced with `Disallow: /`. **It has no effect here**, because crawlers read only `https://sgencms.github.io/robots.txt` (the host root, a 404 for this org) and never a project subpath. GitHub Pages cannot send `X-Robots-Tag`, so non-HTML files (PDF, images, JSON, the markdown) have no index control. The file is kept only in case this tree is ever served from a domain root. | — | No |
| 10 | `sitemap.xml` and `llms.txt` not shipped, because both advertise the practice's real URLs. `_headers` and `_redirects` are Netlify-only and GitHub Pages ignores them. | — | No |
| 11 | `404.html` rewritten to absolute `/visionproeyecare/` references. GitHub Pages answers a missing path at any depth with it, so it is the one page that cannot use relative references. | 1 | Yes |
| 12 | `.nojekyll` added | — | No |
| 13 | The map embed on `/hours-location/` and `/location/vision-pro/` switched from the Maps Embed API (which carries the practice's own key) to Google's keyless embed of the same sourced address, with `referrerpolicy="no-referrer"`. See *The map key*. | 2 | **Yes** |
| 14 | The YouTube frame on `/eye-care-services/eye-emergencies-pink-red-eyes/` gets `referrerpolicy="strict-origin"`: it sends the bare origin `https://sgencms.github.io/`, never a path, because YouTube will not play without a referrer. | 1 | **Yes** (video plays) |
| 15 | Line endings normalised to LF. All 159 pages carried CRs, and every one sat inside the inline path-resolution script that the `sr-rebase` stage injects; no page text had any. The repository's `.gitattributes` would make git do this on commit anyway, and an HTML parser treats both forms the same. Doing it here means the bytes verified are the bytes published. | 159 | No |

### The map key

The live site embeds its map as `maps/embed/v1/place?key=AIza…&q=place_id:…`. The key is the
practice's own. It is public on their live site, and Maps Embed keys are designed to be shipped
to browsers. It is still left out of this repository, for two reasons:

- A Google API key pushed to a public GitHub repository is picked up by GitHub secret scanning
  and reported to Google, which notifies the key's owner. Publishing this preview should not
  raise a credential-leak alert against a third party.
- The key is **not** locked to the practice's domain. The keyed embed rendered normally from an
  unrelated local origin when tested on 2026-09-23. Republishing it in a second public place
  widens the exposure of a credential that is billed to the practice.

The keyless embed shows "Vision Pro, 20920 Kuykendahl Rd., Ste C, Spring, TX 77379". It was
screenshotted next to the keyed embed, and both drop the pin labelled *Vision Pro* on Kuykendahl
Rd at the same spot. Every part of that address string comes from the sourced `PRACTICE` config.
The handoff build keeps the original keyed embed unchanged. The unrestricted key is worth raising
with the practice or its web vendor on its own merits.

## Deliberately NOT changed

| | Why |
| --- | --- |
| `<link rel="canonical">` → the practice's own URL, on every page | Correct for a duplicate, and deliberately different from `og:url`, which drives unfurl cards |
| The live site's internal contradictions: two street numbers (20290 appears in a home-page sentence and in one blog post's "Address:" line), two phone numbers, a post titled "Spring, CO" that links to a Colorado practice, and empty template tokens on the Stellest and scleral-lens pages and in one `<title>` | These are the practice's own words, so choosing between them is the practice's call. All of them are listed in the handoff `CHANGE-LOG.md`. One of the gaps sits in the scleral page's meta description. The build never reuses that text as a card summary, hero lead or search snippet, so it stays in that page's `<head>` and is not shown on other pages. |
| Outbound links to `scheduleyourexam.com`, `crystalpm.com`, `meetmarlo.com` and `square.link` | These are the practice's real booking, history-form, contact-lens and payment services. Navigation is not blocked, and `no-referrer` keeps this URL out of the request. |
| `site.css`, `tokens.css`, `motion.css`, `scripts/site.js` and every other non-HTML file except the named preview additions | Byte-identical to the handoff build; `preview-verify.mjs` compares them. The banner and notice styles live only in `preview-banner.css`. |

## Not published here

These are **not** in this repository:

- The `audit/` tree: the raw capture of the practice's site, computed-style captures,
  screenshots and reports. It is bulky, it carries absolute build paths from the capture machine,
  and a preview has no use for a full raw copy of the practice's site.
- `src/`, the generator and tools.
- `assets/source/`, the original downloads.

Both `src/` and `assets/source/` belong to the handoff package.

## Review after the first publish — 2026-09-23

The first publish (commit `20ba765`) passed every check in `preview-verify.mjs`. A four-lens
adversarial review of the live site then found defects those checks could not see. Each one was
reproduced independently before it was fixed:

| Found | Fix |
| --- | --- |
| **With JavaScript off, both patient forms POSTed every field to GitHub Pages**, while the notice read "Nothing you type here is sent anywhere". The inert markup (`onsubmit`, `site.js`) was all script, and the verifier had only tested with scripting on. | Submit buttons become disabled `type="button"` (#6). The verifier now repeats the test with scripting **off**. Enter and click must produce zero non-GET requests, and a **positive control** re-arms the button through the DevTools protocol and must be caught submitting, so the test cannot pass by being blind. Run against the first publish while it was still live, the test caught both defects: Enter and click each POSTed, on both forms. Every request was failed locally, so nothing was sent. |
| **The YouTube video showed "Error 153"**, because the `no-referrer` hardening stopped it | The frame sends its bare origin (#14). `src/tools/preview-youtube-check.mjs` reads the player frame itself: the first publish showed "Video player configuration error / Error 153" with `Referer: null`, and the fixed frame loads the player while sending only the origin. |
| **`robots.txt` was presented as working** when it has no effect at a project subpath | Documented as such (#9), and meta `noindex` is named as the control that works |
| The rebuild **reused the scleral page's gap-bearing meta description** ("Located in , we offer…") as card text on two other pages | Fixed in the handoff build: a description with an unfilled template token is never reused as visible text |
| Documentation errors: the AI-image count and placement, the sweep result ("0 findings" instead of 0 blocker / 0 major, 12 minor, 4 nit), the 403 image hosts, a second 20290 address, undercounted template gaps, and an overstated "nothing written" | Corrected here, in README.md and in the handoff `CHANGE-LOG.md` / `README.md`. The audit figures in both files are now filled from the audit files rather than typed. |
| **The banner covered controls.** Its `z-index: 200` (carried over from the org's urbanoptics banner) painted it over the **focused skip link** at every width and over the **mobile drawer's close button**. The review's rendering lens stalled and never reported, so a direct browser pass found this one. | The banner is in normal flow above the header and never needs to cover anything, so it now sits at `z-index: 1`, under the skip link (100), header (50), menus (60) and drawer (80). The verifier hit-tests both controls at their centres. The check fails on the first publish's CSS and passes on this one. |
| The disabled Submit button still looked active (full colour, pointer cursor) | `preview-banner.css` renders it visibly disabled |
| The old theme's `og:featured_image` survived on 66 pages | Removed (#4). It is not an Open Graph property that unfurlers read, and its URL is not an image, but no image-bearing meta should remain. |
| The recorded verification had run **before** README.md and PROVENANCE.md existed | `preview-docs.mjs` now re-runs the static checks over the finished tree after writing these files, and refuses to finish unless they pass |

## Verification after modification

Every figure below was re-read by `src/tools/preview-verify.mjs` (in the handoff build) from this
tree and from a browser rendering of it. None was taken from the tool that wrote them.

- **Hardening**: 159/159 pages carry exactly one robots meta reading `noindex, nofollow, noarchive, nosnippet`. On every page:
  - the referrer is set;
  - there is no JSON-LD;
  - there is exactly one banner, directly after the skip link, with its stylesheet linked;
  - the canonical is still the practice's own;
  - `og:url` is this preview and `og:description` is the disclosure;
  - there is no image-bearing meta (`og:image`, `twitter:image`, `og:featured_image`, `image_src`);
  - there are no CR bytes;
  - there is exactly one `<h1>`.

  Other hardening results:
  - 3 iframes carry the permitted referrer policy.
  - 318/318 forms are inert.
  - Both patient forms have `action=""`, `onsubmit="return false"`, an empty `data-endpoint` and **no submit control** (2/2), each with its notice.
  - No title carries a prefix.
- **Byte identity**: all 511 non-HTML files except the named preview additions (`.gitattributes`, `.gitignore`, `.nojekyll`, `PROVENANCE.json`, `robots.txt`, `styles/preview-banner.css`) are byte-identical to the handoff build.
- **Secrets**: 171 text files were scanned for credential-shaped strings (Google API keys, the fal.ai key format, GitHub, OpenAI, Slack and AWS tokens, private keys) and for build-machine paths. There were 0 hits.
- **Reference audit**: 24,016 local references (18,666 href, 1,737 src, 316 action, 3,292 srcset, 1 poster, 4 css url()) were resolved against the file that carries each one.
  - 0 escape the site root, 0 point at a missing file, and 0 are root-relative.
  - The exception is `404.html`, whose references are all absolute under `/visionproeyecare/` by design.
- **Rendering at the preview's subpath** (`served exactly as GitHub Pages serves a project site: only under /visionproeyecare/, a missing path answered by 404.html`):
  - Every page was loaded in headless Chrome at 1440 and 390 px (316 loads), with lazy images forced to load.
  - The result was 0 responses ≥ 400, 0 broken images, 0 console errors, 0 requests outside the prefix, 0 horizontal overflow at 390, and the banner visible on every load.
  - Chrome cancelled 1 request itself (`the-staff/@390 Image`). This was a duplicate fetch of the logo, which `/the-staff/` shows three times. No image was left broken.
- **404 at depth**: `no-such-page/`, `a/b/c/d/no-such-page`, `eye-care-services/nope/` each returned 404 and rendered the styled page with its banner, 0 failed subresources and 0 broken images.
- **Search**: `/search/?q=dry eye` returned 18 results at the subpath, all inside `/visionproeyecare/`. The first one opens (HTTP 200).
- **Patient forms, JavaScript on**: a submit on each was cancelled, the page did not navigate, 0 requests were sent, and the notice was present.
- **Patient forms, JavaScript off**: on both forms, Enter in a text field and a click that landed on the button (hit-tested) produced 0 and 0 non-GET requests, and the page stayed put.
  - Positive control: the same button was re-armed through the DevTools protocol, with no page script, and clicked again. Each form's click was **caught** submitting (POST /visionproeyecare/contact-us/appointment-request-form/; POST /visionproeyecare/contact-us/patient-registration-form/), which proves the test can see a submission.
  - Every non-GET request was failed locally, so none left the machine.
- **The banner covers no control**: hit-tested at each control's centre, the focused skip link is topmost at 390 px and 1440 px, and the open mobile drawer's close button is topmost at 390 px.
- **Tree**: `sitemap.xml`, `llms.txt`, `_headers`, `_redirects`, `audit/` and `src/` are absent. `.nojekyll` is present. `robots.txt` reads `Disallow: /`, which has no effect at this subpath (deviation #9).
- **After this file was written**, `preview-docs.mjs` re-ran the static checks (tree, byte identity, secrets, hardening, references) over the finished tree, including README.md, PROVENANCE.md and PROVENANCE.json. It would have refused to finish unless they passed.
