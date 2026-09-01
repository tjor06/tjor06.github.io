# Tomas Jonsson — Portfolio

Single-page personal site: **Home · About · Projects · In the Works · Sandbox (encrypted)**,
with an interactive Three.js background. No build step — plain HTML/CSS/JS.

## Structure

```
├── index.html          # the whole site
├── css/style.css       # theme (colors/fonts in :root at the top)
├── js/data.js          # ✏️ EDIT ME — Projects & In-the-Works content + links
├── js/main.js          # rendering, nav, Sandbox decryption
├── js/three-bg.js      # 3D hero background
├── js/sandbox-data.js  # encrypted Sandbox payload (safe to commit)
└── tools/encrypt.html  # local tool to edit Sandbox content / change password
```

## Editing content

- **Add a project link:** open `js/data.js`, find the project, add
  `{ label: "Demo", url: "https://…" }` to its `links` array. An entry with
  `url: ""` shows as a muted "coming soon" chip.
- **Add/edit projects or In-the-Works items:** same file — they're plain arrays.
- **About / contact info:** directly in `index.html`.

## Sandbox (private area)

The Sandbox section is encrypted with **AES-256-GCM**; the key is derived from
`username:password` via PBKDF2 (310k iterations, SHA-256) in the browser.
The ciphertext in `js/sandbox-data.js` is safe to publish — without the
password the content is unreadable, even with full source access.

**To edit Sandbox content or change the credentials:**

1. Open `tools/encrypt.html` in your browser (double-click the file).
2. Paste/edit the Sandbox HTML (use `<div class="sb-card">…</div>` blocks).
3. Enter username + password (entering new ones changes the login).
4. Click **Encrypt**, copy the output over `js/sandbox-data.js`, commit.

Never commit the plaintext. If you forget the password there is no recovery —
just re-encrypt fresh content with a new one.

## Deployment

This repo is a GitHub Pages user site: anything on `main` is automatically
published at **https://tjor06.github.io** — push to deploy, nothing to configure.
Everything is static; WebCrypto (Sandbox) requires HTTPS or `localhost`/`file://`,
all of which Pages and local previews satisfy.

## 3D background

`js/three-bg.js` — a particle sphere (Fibonacci distribution) with a wireframe
icosahedron and orbit ring. Drag to spin, double-click for a pulse, mouse
parallax when idle. It pauses off-screen and honors `prefers-reduced-motion`.
