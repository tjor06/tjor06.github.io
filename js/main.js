/* Renders data.js content, handles nav, reveal animations, and the
   encrypted Sandbox (AES-GCM via WebCrypto — see tools/encrypt.html). */
(function () {
  "use strict";

  /* ——— projects ——— */
  const grid = document.getElementById("project-grid");
  if (grid && typeof PROJECTS !== "undefined") {
    PROJECTS.forEach((p) => {
      const card = document.createElement("article");
      card.className = "card reveal";
      const links = (p.links || [])
        .map((l) =>
          l.url
            ? `<a href="${l.url}" target="_blank" rel="noopener">${l.label} ↗</a>`
            : `<span class="link-stub" title="Link coming soon">${l.label} — soon</span>`
        )
        .join("");
      card.innerHTML = `
        <div class="card-head"><h3>${p.title}</h3><span class="card-period">${p.period}</span></div>
        <div class="card-tag">${p.tag}</div>
        <p class="card-summary">${p.summary}</p>
        <div class="card-stack">${p.stack.map((s) => `<span>${s}</span>`).join("")}</div>
        <div class="card-links">${links}</div>`;
      grid.appendChild(card);
    });
  }

  /* ——— in the works ——— */
  const list = document.getElementById("inworks-list");
  if (list && typeof INWORKS !== "undefined") {
    INWORKS.forEach((w) => {
      const row = document.createElement("div");
      row.className = "work-row reveal";
      row.innerHTML = `
        <span class="work-status">${w.status}</span>
        <div class="work-main">
          <h3>${w.title}</h3><span class="work-org">${w.org}</span>
          <p class="work-note">${w.note}</p>
        </div>
        <span class="work-pulse"></span>`;
      list.appendChild(row);
    });
  }

  /* ——— nav ——— */
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  document.querySelectorAll(".nav-link").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
  window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 30), { passive: true });

  const sections = [...document.querySelectorAll("section[id], header[id]")];
  const navLinks = [...document.querySelectorAll(".nav-link")];
  new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  ).observe && sections.forEach((s) => {
    new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting)
          navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + s.id));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    ).observe(s);
  });

  /* ——— reveal on scroll ——— */
  const revealObs = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ——— sandbox ——— */
  const form = document.getElementById("sandbox-form");
  const locked = document.getElementById("sandbox-locked");
  const open = document.getElementById("sandbox-open");
  const errEl = document.getElementById("sandbox-error");
  const contentEl = document.getElementById("sandbox-content");

  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  async function deriveKey(user, pass, salt) {
    const material = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(user.trim().toLowerCase() + ":" + pass),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 310000, hash: "SHA-256" },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
  }

  async function unlock(user, pass) {
    const key = await deriveKey(user, pass, b64(SANDBOX_VAULT.salt));
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64(SANDBOX_VAULT.iv) },
      key,
      b64(SANDBOX_VAULT.ct)
    );
    return new TextDecoder().decode(plain);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errEl.hidden = true;
    const btn = form.querySelector("button");
    btn.textContent = "Unlocking…";
    try {
      const html = await unlock(
        document.getElementById("sb-user").value,
        document.getElementById("sb-pass").value
      );
      contentEl.innerHTML = html;
      locked.hidden = true;
      open.hidden = false;
    } catch {
      errEl.hidden = false;
    } finally {
      btn.textContent = "Unlock";
    }
  });

  document.getElementById("sandbox-lock-btn").addEventListener("click", () => {
    contentEl.innerHTML = "";
    open.hidden = true;
    locked.hidden = false;
    form.reset();
  });
})();
