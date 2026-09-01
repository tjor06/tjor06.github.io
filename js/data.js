/* ============================================================
   EDIT ME — all Projects / In-the-Works content lives here.
   To add a link to a project: append {label: "...", url: "..."}
   to its `links` array. Empty url ("") renders as a muted
   "coming soon" chip, so you can stub links before they exist.
   ============================================================ */

const PROJECTS = [
  {
    title: "TruePoker — Poker Analytics",
    period: "Jul – Aug 2025",
    tag: "Personal Project",
    summary:
      "Multi-user poker session tracker in Python with a separation-of-concerns " +
      "architecture across five files. Normalized SQLite schema with foreign-key " +
      "constraints and cascade deletes. Uses bcrypt-salted login and is a statistics engine " +
      "computing profit, hourly winrate, and BB/hour filtered by game type. Currently exists as an " +
      "installable PWA web interface with a JSON API.",
    stack: ["Python", "SQLite", "bcrypt", "JSON API", "PWA"],
    links: [
      { label: "GitHub", url: "https://github.com/tjor06/TruePoker" },
      { label: "Live demo", url: "" }
    ]
  },
  {
    title: "MCP Server — UN Learning Corpus",
    period: "Jun 2026 – Present",
    tag: "United Nations · AI Learning & Digital Safety",
    summary:
      "Architected and shipped a Model Context Protocol server exposing a learning " +
      "corpus through tools and resources. Hexagonal architecture with a " +
      "configuration-driven composition root, lazy adapter loading, automatic " +
      "credential redaction, and per-user session isolation as a hard constraint. " +
      "Found 6 defects reviewing an untested Google Drive integration and designed " +
      "the corrected API contract; authored the full developer documentation.",
    stack: ["Python", "MCP", "Hexagonal architecture", "stdio", "LaTeX docs"],
    links: [
      { label: "Write-up", url: "" }
    ]
  },
  {
    title: "Codex Training Seminar",
    period: "Jan 2026",
    tag: "Eclipse Consulting Group at Berkeley",
    summary:
      "Organized the Eclipse × Handshake × OpenAI Codex training seminar at Berkeley, " +
      "training 50+ students in agentic coding workflows. Ongoing project-manager " +
      "role scoping client engagements for the group.",
    stack: ["Project management", "Developer tooling", "Teaching"],
    links: [
      { label: "Eclipse Consulting", url: "" }
    ]
  },
  {
    title: "AM Radio Receiver & Amplifier",
    period: "Sep 2025 – Present",
    tag: "UC Berkeley Experimental Physics Lab",
    summary:
      "Hand-built AM radio receiver and amplifiers with modified cutoff frequencies " +
      "of 350–500 Hz around an LM386 chip. Tested optimal exposure length of " +
      "aluminum inductor coils and varied circuit construction for an 8V " +
      "battery-powered receiver.",
    stack: ["Analog circuits", "LM386", "RF", "Lab instrumentation"],
    links: [
      { label: "Lab notes", url: "" }
    ]
  }
];

const INWORKS = [
  {
    title: "Samsung AI Infrastructure Demand",
    org: "Eclipse Consulting Group at Berkeley",
    status: "Scoping",
    note: "Negotiated engagement terms and a 10-week timeline; defining project scope for an AI-infrastructure demand analysis."
  },
  {
    title: "AM Radio Receiver — v2",
    org: "Undergraduate Experimental Physics Lab",
    status: "Building",
    note: "Iterating on inductor-coil exposure length and circuit construction to sharpen the 350–500 Hz cutoff band."
  },
  {
    title: "TruePoker — next phase",
    org: "Personal project",
    status: "Designing",
    note: "Multi-device sync and richer game-type analytics on top of the existing PWA and stats engine."
  },
  {
    title: "This site",
    org: "tjor06.github.io",
    status: "Live iteration",
    note: "Interactive 3D portfolio — content pipeline, encrypted sandbox, and continuous polish."
  }
];
