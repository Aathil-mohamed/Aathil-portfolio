# Aathil – Portfolio

A static portfolio site: plain HTML, CSS and JavaScript. No build step, no libraries, no network needed (only the Google Fonts stylesheet, which falls back to system fonts offline).

## Run it
Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder and visit http://localhost:8000.

## Structure
```
index.html             all page content
css/style.css          styles (image variables are at the top)
js/main.js             loader, scroll animations, accordion, clock
assets/images/         portrait, painting background, project screenshots (.webp)
assets/Aathil-CV.pdf   CV linked from the Contact section
assets/favicon.svg
```

## Sections and animations
- **Loader:** a line draws around the name, then the page reveals.
- **Hero:** headline sharpens in, portrait rises; both drift away as you scroll.
- **About:** the card grows to full screen, "ABOUT" and "ME" split apart, a spotlight scene appears.
- **Where I’ve been:** horizontal scroll with an RGB-split effect that follows scroll speed.
- **Skills, case studies:** content reveals on scroll.
- **Featured project:** a curved ribbon of project cards driven by scroll.
- **Works:** a rotating hexagon of project screenshots that becomes a vertical carousel.
- **What I build:** accordion.
- **Let’s talk:** contact links and CV download.

## Editing
- Text: `index.html`. Project cards and screenshots: the `fcard`, `hcard` and `case` blocks.
- Images: replace the files in `assets/images/` (same names), or edit the variables at the top of `css/style.css`.
- Scroll lengths: the `height` of `#about`, `#feat`, `#works` in `css/style.css`; `#exp` is computed in `js/main.js`.

## Deploy
Any static host: GitHub Pages, Netlify (drag the folder in), Vercel, Cloudflare Pages.
