/* Interactive 3D hero background — particle sphere + wireframe icosahedron.
   Drag to rotate, gentle idle spin, mouse parallax. Pauses off-screen and
   respects prefers-reduced-motion. */
(function () {
  const canvas = document.getElementById("bg3d");
  if (!canvas || typeof THREE === "undefined") return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 7.5;

  const group = new THREE.Group();
  scene.add(group);

  // Particle shell — Fibonacci sphere so points spread evenly.
  const COUNT = 1100;
  const R = 3.1;
  const pos = new Float32Array(COUNT * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    pos[i * 3] = Math.cos(t) * r * R;
    pos[i * 3 + 1] = y * R;
    pos[i * 3 + 2] = Math.sin(t) * r * R;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const basePos = pos.slice();
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: 0x64f0d2,
      size: 0.035,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(points);

  // Inner wireframe icosahedron.
  const ico = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.7, 1)),
    new THREE.LineBasicMaterial({ color: 0x64f0d2, transparent: true, opacity: 0.22 })
  );
  group.add(ico);

  // Faint outer ring, tilted like an orbit.
  const ring = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, 4.1, 4.1, 0, Math.PI * 2).getPoints(120).map((p) => new THREE.Vector3(p.x, p.y, 0))
    ),
    new THREE.LineBasicMaterial({ color: 0x9aa5bd, transparent: true, opacity: 0.16 })
  );
  ring.rotation.x = Math.PI / 2.4;
  group.add(ring);

  // ——— interaction state ———
  let targetRX = 0.15, targetRY = 0, velX = 0, velY = 0.0016;
  let dragging = false, lastX = 0, lastY = 0, wave = 0;

  function onDown(e) {
    dragging = true;
    canvas.classList.add("dragging");
    lastX = e.clientX; lastY = e.clientY;
    const hint = document.getElementById("drag-hint");
    if (hint) hint.style.opacity = "0";
  }
  function onMove(e) {
    if (dragging) {
      velY = (e.clientX - lastX) * 0.0035;
      velX = (e.clientY - lastY) * 0.0025;
      targetRY += velY;
      targetRX += velX;
      lastX = e.clientX; lastY = e.clientY;
    } else {
      // parallax when idle
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      camera.position.x += (nx * 0.9 - camera.position.x) * 0.03;
      camera.position.y += (-ny * 0.6 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
    }
  }
  function onUp() { dragging = false; canvas.classList.remove("dragging"); }

  canvas.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerup", onUp);
  canvas.addEventListener("dblclick", () => { wave = 1; }); // double-click: radial pulse

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // Only animate while the hero is on screen.
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.02 })
    .observe(canvas);

  let t = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    t += 0.016;

    if (!dragging) {
      velY += (0.0016 - velY) * 0.02; // ease back to idle spin
      velX *= 0.95;
      targetRY += velY;
      targetRX += velX;
    }
    targetRX = Math.max(-1.2, Math.min(1.2, targetRX));
    group.rotation.y += (targetRY - group.rotation.y) * 0.08;
    group.rotation.x += (targetRX - group.rotation.x) * 0.08;

    ico.rotation.y -= 0.0022;
    ico.rotation.z += 0.0011;
    ring.rotation.z += 0.0008;

    // breathing + double-click pulse on the particle shell
    if (!reduced) {
      const p = geo.attributes.position.array;
      const breathe = 1 + Math.sin(t * 0.6) * 0.012;
      const pulse = wave > 0 ? 1 + Math.sin((1 - wave) * Math.PI) * 0.22 * wave : 1;
      if (wave > 0) wave = Math.max(0, wave - 0.02);
      const s = breathe * pulse;
      for (let i = 0; i < p.length; i++) p[i] = basePos[i] * s;
      geo.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  if (reduced) {
    // static render, no loop
    group.rotation.set(0.15, 0.5, 0);
    renderer.render(scene, camera);
  } else {
    frame();
  }
})();
