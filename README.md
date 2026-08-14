# Dr. Shubhang Aggarwal — Landing Page

Single-page, ad-ready landing page for **NHS Ortho Robotics, Jalandhar**.
Open `index.html` directly in a browser, or upload the whole folder to any host.

```
shubhangaggarwal/
├── index.html              ← the landing page (the only page)
├── README.md
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── images/             ← every media file copied from the original site
        ├── photos/         ← hospital gallery (pic1–pic9)
        └── videos/         ← YouTube poster frames
```

## Sections (all on one page)

Hero → trust stats → assurance strip → About the surgeon → **12 service cards** →
Robotic surgery explainer → Why choose us → Videos + testimonials → Hospital gallery →
Patient stories → Appointment form + contact → Map → FAQ → Areas served → Final CTA → Footer

## Services covered

Robotic Knee Replacement · Total Knee · Partial Knee · Revision Knee · Hip Replacement ·
Shoulder & Elbow Replacement · Arthroscopic Sports Injury (ACL / meniscus) ·
Scoliosis & Spine · Paediatric Orthopaedics · Advanced Trauma Reconstruction ·
Cartilage Preservation & Biologics · Second Opinion

## Mobile

The phone layout is a rebuild, not a reflow (see the `max-width: 700px` / `620px`
blocks in `style.css`):

- **Services (12 cards)** and **Patient Stories** become horizontal swipe rails
  with CSS scroll-snap and a "Swipe to see more" cue. This alone removed ~6,700px.
- **Why Choose Us**, **Assurance strip**, **testimonial videos** and the
  **footer links** go two-up instead of stacking.
- Section padding, headings, card padding and the hero figure are all reduced.
- The off-canvas nav drawer is `visibility: hidden` when closed, and
  `html/body` use `overflow-x: clip`, which is what removed the sideways scroll.

Measured with Chrome device emulation at 390 × 844:

| | before | after |
|---|---|---|
| page height | 25,407px | **13,142px** |
| horizontal scroll | 724px (side-scrolled) | **none** (390 = viewport) |

No horizontal scroll at 320 / 360 / 390 / 414 / 540 / 768 / 1024px.

## Google Ads safety

There are **no links to any other website**. Every navigation link is an in-page
anchor (`#about`, `#services`, …). Social-media icons were removed entirely.

The only off-page destinations left are the contact actions themselves:

| Type | Where | Why it stays |
|---|---|---|
| `wa.me` WhatsApp | header, hero, cards, form, floating widget, mobile bar | this is the requested chat CTA |
| `tel:` | header, hero, floating button, mobile bar | phone call, not a website |
| `mailto:` | top bar, contact block | email, not a website |

YouTube videos play **inside the page** (click-to-play iframe on
`youtube-nocookie.com`) — clicking never navigates away.
The Google Maps embed is the standard location iframe.

## Contact points used

- Phone / WhatsApp: **+91 98142 09405**
- Email: **robotics@drshubhangaggarwal.com**
- Address: NHS Hospital, Kapurthala Road, Opp. Sports College, Jalandhar, Punjab 144008

## Appointment form → Formester

Submissions go to Formester form `IIBNeuKFc`.

- `index.html` sets `action="https://app.formester.com/forms/IIBNeuKFc/submissions"` `method="POST"`.
- `assets/js/main.js` intercepts the submit, validates, then `fetch()`es the
  **JSON** endpoint `…/submissions.json`. This is deliberate: a plain form POST
  would navigate the visitor to app.formester.com, which is exactly the kind of
  off-site redirect we are avoiding. With the fetch, they stay on the page and
  see an inline "thank you" instead.
- If the request fails, an inline error appears with the phone number and the
  WhatsApp button as a fallback.

Fields stored, by `name`: `name`, `city`, `mobile`, `service`, `message`, `page`.

To change the destination, edit `FORMESTER_ENDPOINT` near the bottom of
`assets/js/main.js` and the `action` on the `<form id="apptForm">` tag.
