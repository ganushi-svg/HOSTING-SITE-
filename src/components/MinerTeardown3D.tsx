"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { internalsFor } from "@/lib/miner-internals";
import { models } from "@/lib/models";

/**
 * 3D teardown of the calculator miner (Ganushi, 16 Nov 2026: "proper alignment, professional, the spare parts should be
 * seen, 3D motion is fine, perfection matters"). A live three.js model of the selected machine, built from its published
 * internals (src/lib/miner-internals.ts, content/models.md › Internals) and its published L × W × H:
 *  - air-cooled: aluminium chassis sleeve and side panel, hashboards with finned heatsinks, fans with blades and guards
 *    (count and size per model), the power supply (APW name on its plate), the control board with its Ethernet port;
 *  - hydro: sealed case and cover, hashboards, the coolant manifold with inlet and outlet connectors, power supply,
 *    control board; no fans.
 * On each calculator change the parts start pulled apart along clean axes with labelled callouts in two aligned columns,
 * assemble in order, and the machine powers up (fans spin, status LED) and turns slowly. Parts a manufacturer does not
 * publish are drawn in their usual place without a count or name, and the note says so. Illustration, not a photo.
 * three.js is the copy globe.gl already ships; it loads with this component. Renders only while on screen.
 */
type PartDef = { id: string; label?: string; detail?: string; obj: THREE_NS.Object3D; off: [number, number, number]; order: number; fadeOut?: boolean };

const ACCENT = "#c084fc";

export function MinerTeardown3D({ slug, cooling, onReady }: { slug?: string; cooling: "Air" | "Hydro"; onReady?: (ok: boolean) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let disposed = false;
    let raf = 0;
    let cleanup = () => {};
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      const probe = document.createElement("canvas");
      if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) { setFailed(true); onReady?.(false); return; }
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const { RoundedBoxGeometry } = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js");
      if (disposed) return;
      const accent = getComputedStyle(wrap).getPropertyValue("--accent").trim() || ACCENT;
      const int = internalsFor(slug, cooling);
      const model = models.find((m) => m.slug === slug);

      // ---------- renderer, scene, camera ----------
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      const canvas = renderer.domElement;
      canvas.className = "td3-canvas";
      wrap.prepend(canvas);
      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.add(new THREE.HemisphereLight(0xdfe7ff, 0x1a1424, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 9, 5); key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0006; key.shadow.normalBias = 0.02; key.shadow.radius = 5;
      Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 0.5, far: 30 }); scene.add(key);
      const fill = new THREE.DirectionalLight(0xbfd2ff, 0.6); fill.position.set(-5, 2, 6); scene.add(fill);
      const rim = new THREE.DirectionalLight(new THREE.Color(accent), 1.6); rim.position.set(-6, 3, -5); scene.add(rim);
      const camera = new THREE.PerspectiveCamera(30, 4 / 3, 0.1, 200);

      // ---------- materials ----------
      const brushed = (() => {
        const c = document.createElement("canvas"); c.width = 512; c.height = 512; const g = c.getContext("2d")!;
        g.fillStyle = "#9a9a9a"; g.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 2600; i++) { const v = 110 + Math.random() * 110; g.fillStyle = `rgba(${v},${v},${v},0.35)`; g.fillRect(Math.random() * 512, Math.random() * 512, 40 + Math.random() * 160, 1); }
        const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); return t;
      })();
      const M = {
        alu: new THREE.MeshStandardMaterial({ color: 0xc9ced5, metalness: 0.88, roughness: 0.42, roughnessMap: brushed }),
        aluDark: new THREE.MeshStandardMaterial({ color: 0x8d939c, metalness: 0.8, roughness: 0.4 }),
        fin: new THREE.MeshStandardMaterial({ color: 0xd5d9de, metalness: 0.9, roughness: 0.28 }),
        pcb: new THREE.MeshStandardMaterial({ color: 0x1c6b3c, metalness: 0.15, roughness: 0.55 }),
        pcbBlue: new THREE.MeshStandardMaterial({ color: 0x1d3f8f, metalness: 0.15, roughness: 0.55 }),
        chip: new THREE.MeshStandardMaterial({ color: 0x15171b, metalness: 0.4, roughness: 0.45 }),
        gold: new THREE.MeshStandardMaterial({ color: 0xd4a73c, metalness: 0.9, roughness: 0.3 }),
        black: new THREE.MeshStandardMaterial({ color: 0x1b1d22, metalness: 0.2, roughness: 0.6 }),
        blade: new THREE.MeshStandardMaterial({ color: 0x24272d, metalness: 0.1, roughness: 0.5, side: THREE.DoubleSide }),
        steel: new THREE.MeshStandardMaterial({ color: 0x565d66, metalness: 0.78, roughness: 0.5, roughnessMap: brushed }),
        rail: new THREE.MeshStandardMaterial({ color: 0x6d737b, metalness: 0.85, roughness: 0.35 }),
        screw: new THREE.MeshStandardMaterial({ color: 0x9aa0a8, metalness: 0.95, roughness: 0.25 }),
        copper: new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.95, roughness: 0.3 }),
        blueRing: new THREE.MeshStandardMaterial({ color: 0x2f7dd1, metalness: 0.3, roughness: 0.4 }),
        redRing: new THREE.MeshStandardMaterial({ color: 0xd1452f, metalness: 0.3, roughness: 0.4 }),
        led: new THREE.MeshStandardMaterial({ color: 0x0f3d24, emissive: 0x22ff88, emissiveIntensity: 0 }),
      };
      const box = (w: number, h: number, d: number, m: THREE_NS.Material, x = 0, y = 0, z = 0) => {
        const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); return o;
      };
      const label = (text: string, sub: string) => {
        const c = document.createElement("canvas"); c.width = 512; c.height = 160; const g = c.getContext("2d")!;
        g.fillStyle = "#e9ecef"; g.fillRect(0, 0, 512, 160); g.fillStyle = "#14161a"; g.font = "700 64px Arial, sans-serif"; g.fillText(text, 28, 82);
        g.font = "500 30px Arial, sans-serif"; g.fillStyle = "#3a3f47"; g.fillText(sub, 30, 132);
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
        return new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, metalness: 0.05 });
      };

      /** Edge rails and corner screws on a face of size (a × b) lying in the XY plane, facing +Z. */
      const trim = (a: number, b: number) => {
        const g = new THREE.Group(), r = 0.025;
        g.add(box(a, r, r, M.rail, 0, b / 2 - r / 2, r / 2), box(a, r, r, M.rail, 0, -b / 2 + r / 2, r / 2));
        g.add(box(r, b, r, M.rail, a / 2 - r / 2, 0, r / 2), box(r, b, r, M.rail, -a / 2 + r / 2, 0, r / 2));
        for (const [x, y] of [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1]]) {
          const sc = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.012, 14), M.screw); sc.rotation.x = Math.PI / 2;
          sc.position.set(x * (a / 2 - 0.08), y * (b / 2 - 0.07), r + 0.004); g.add(sc);
        }
        return g;
      };
      const modelName = model?.name ?? (cooling === "Hydro" ? "Hydro miner" : "Air-cooled miner");

      // ---------- dimensions (published L × W × H, mm → units of 100 mm) ----------
      const [Lmm, Wmm, Hmm] = int.dimsMm ?? (cooling === "Hydro" ? [339, 173, 207] : [400, 195, 290]);
      const L = Lmm / 100, W = Wmm / 100, H = Hmm / 100;
      const parts: PartDef[] = [];
      const root = new THREE.Group(); scene.add(root);
      const add = (p: PartDef) => { root.add(p.obj); parts.push(p); };
      const nBoards = int.hashboards ?? 3;
      const boardsLabel = int.hashboards ? `Hashboards ×${nBoards}` : "Hashboards";
      const rotors: THREE_NS.Object3D[] = [];

      const rbox = (w: number, h: number, d: number, m: THREE_NS.Material | THREE_NS.Material[], r = 0.03, x = 0, y = 0, z = 0) => {
        const o = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.01, h / 2.01, d / 2.01)), m); o.position.set(x, y, z); return o;
      };
      const tex = (wpx: number, hpx: number, draw: (g: CanvasRenderingContext2D) => void, srgb = true) => {
        const c = document.createElement("canvas"); c.width = wpx; c.height = hpx; draw(c.getContext("2d")!);
        const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
      };
      // Printed circuit board: solder mask, copper traces, pads, chip rows, silkscreen.
      const pcbTexture = (base: string, chips: { cols: number; rows: number } | null, text: string) => tex(1024, 512, (g) => {
        g.fillStyle = base; g.fillRect(0, 0, 1024, 512);
        g.strokeStyle = "rgba(170, 230, 170, 0.22)"; g.lineWidth = 2;
        for (let i = 0; i < 140; i++) { let x = Math.random() * 1024, y = Math.random() * 512; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 4; k++) { if (k % 2) x += (Math.random() - 0.5) * 220; else y += (Math.random() - 0.5) * 120; g.lineTo(x, y); } g.stroke(); }
        g.fillStyle = "rgba(220, 190, 110, 0.85)"; for (let i = 0; i < 260; i++) g.fillRect(Math.random() * 1024, Math.random() * 512, 5, 3);
        if (chips) for (let i = 0; i < chips.cols; i++) for (let j = 0; j < chips.rows; j++) {
          const x = 60 + (i * 900) / Math.max(1, chips.cols - 1), y = 80 + (j * 340) / Math.max(1, chips.rows - 1);
          g.fillStyle = "#101114"; g.fillRect(x - 22, y - 22, 44, 44); g.fillStyle = "#8d949c"; g.fillRect(x - 13, y - 13, 26, 26);
        }
        g.fillStyle = "rgba(240, 240, 240, 0.75)"; g.font = "600 22px monospace"; g.fillText(text, 30, 494);
        g.fillStyle = "#c9a142"; for (let i = 0; i < 28; i++) g.fillRect(994, 120 + i * 10, 22, 5);
      });
      const pcbGreen = new THREE.MeshStandardMaterial({ map: pcbTexture("#17603a", null, "HB · REV 1.0"), roughness: 0.5, metalness: 0.1 });
      const pcbChips = new THREE.MeshStandardMaterial({ map: pcbTexture("#17603a", { cols: 14, rows: 5 }, "HB · REV 1.0"), roughness: 0.5, metalness: 0.15 });
      const pcbCtrl = new THREE.MeshStandardMaterial({ map: pcbTexture("#173a7a", { cols: 3, rows: 2 }, "CTRL BOARD"), roughness: 0.5, metalness: 0.1 });
      const perforated = new THREE.MeshStandardMaterial({ color: 0xc9ced5, metalness: 0.85, roughness: 0.4, map: tex(256, 256, (g) => { g.fillStyle = "#c8c8c8"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#141414"; for (let y = 8; y < 256; y += 16) for (let x = (y / 16) % 2 ? 16 : 8; x < 256; x += 16) { g.beginPath(); g.arc(x, y, 5, 0, Math.PI * 2); g.fill(); } }) });
      const sticker = (title: string, sub: string) => new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0, map: tex(768, 384, (g) => {
        g.fillStyle = "#f4f5f6"; g.fillRect(0, 0, 768, 384); g.fillStyle = "#16181c"; g.font = "800 62px Arial, sans-serif"; g.fillText(title, 36, 92);
        g.font = "500 32px Arial, sans-serif"; g.fillStyle = "#3b4048"; g.fillText(sub, 38, 146);
        for (let i = 0, x = 38; x < 520; i++) { const bw = 2 + ((i * 7) % 5); g.fillStyle = "#111"; g.fillRect(x, 200, bw, 110); x += bw + 2 + ((i * 3) % 4); }
        g.font = "500 22px monospace"; g.fillStyle = "#3b4048"; g.fillText("ILLUSTRATION · NOT A PRODUCT LABEL", 38, 352);
        g.strokeStyle = "#16181c"; g.lineWidth = 4; g.strokeRect(570, 196, 160, 116); g.font = "700 30px Arial"; g.fillStyle = "#16181c"; g.fillText("CE", 600, 268);
      }) });
      const cable = (pts: [number, number, number][], r: number, m: THREE_NS.Material) => {
        const curve = new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q)));
        return new THREE.Mesh(new THREE.TubeGeometry(curve, 48, r, 10, false), m);
      };

      // Fan: rounded square frame with corner screw holes, 7 curved blades on a hub, chrome wire guard.
      const fan = (size: number, depth: number) => {
        const g = new THREE.Group();
        const h = size / 2, r = size * 0.47, cr = size * 0.08;
        const s = new THREE.Shape();
        s.moveTo(-h + cr, -h); s.lineTo(h - cr, -h); s.quadraticCurveTo(h, -h, h, -h + cr); s.lineTo(h, h - cr); s.quadraticCurveTo(h, h, h - cr, h);
        s.lineTo(-h + cr, h); s.quadraticCurveTo(-h, h, -h, h - cr); s.lineTo(-h, -h + cr); s.quadraticCurveTo(-h, -h, -h + cr, -h);
        const hole = new THREE.Path(); hole.absarc(0, 0, r, 0, Math.PI * 2, true); s.holes.push(hole);
        for (const [x, y] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { const sh = new THREE.Path(); sh.absarc(x * (h - size * 0.07), y * (h - size * 0.07), size * 0.022, 0, Math.PI * 2, true); s.holes.push(sh); }
        const frame = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2, curveSegments: 48 }), M.black);
        frame.rotation.y = Math.PI / 2; frame.position.x = -depth / 2; g.add(frame);
        const rotor = new THREE.Group();
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.17, size * 0.17, depth * 0.7, 40), M.black); hub.rotation.z = Math.PI / 2; rotor.add(hub);
        const cap = new THREE.Mesh(new THREE.CircleGeometry(size * 0.1, 32), new THREE.MeshStandardMaterial({ color: 0xd8dbe0, metalness: 0.5, roughness: 0.4 })); cap.rotation.y = Math.PI / 2; cap.position.x = depth * 0.36; rotor.add(cap);
        const bs = new THREE.Shape(); const r0 = size * 0.15, r1 = r * 0.97;
        bs.moveTo(-size * 0.05, r0); bs.quadraticCurveTo(-size * 0.16, (r0 + r1) / 2, -size * 0.1, r1); bs.quadraticCurveTo(size * 0.04, r1 * 1.02, size * 0.12, r1 * 0.94);
        bs.quadraticCurveTo(size * 0.06, (r0 + r1) / 2, size * 0.06, r0); bs.lineTo(-size * 0.05, r0);
        const bladeGeo = new THREE.ExtrudeGeometry(bs, { depth: 0.008, bevelEnabled: false, curveSegments: 16 });
        for (let i = 0; i < 7; i++) {
          const holder = new THREE.Group(); holder.rotation.x = (i / 7) * Math.PI * 2;
          const pitch = new THREE.Group(); pitch.rotation.y = 0.55;
          const b = new THREE.Mesh(bladeGeo, M.blade); b.rotation.y = Math.PI / 2; pitch.add(b); holder.add(pitch); rotor.add(holder);
        }
        g.add(rotor); rotors.push(rotor);
        const chrome = new THREE.MeshStandardMaterial({ color: 0xe1e4e8, metalness: 1, roughness: 0.18 });
        for (const k of [0.98, 0.8, 0.62, 0.44, 0.26]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r * k, 0.0045, 6, 64), chrome); t.rotation.y = Math.PI / 2; t.position.x = depth / 2 + 0.012; g.add(t); }
        for (let i = 0; i < 8; i++) { const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, r * 1.96, 6), chrome); sp.rotation.x = (i / 8) * Math.PI; sp.position.x = depth / 2 + 0.012; g.add(sp); }
        return g;
      };

      // Hashboard: textured PCB with a dense finned heatsink (air) or exposed chip rows (hydro), rear power and data connectors.
      const hashboard = (len: number, ht: number, withFins: boolean) => {
        const g = new THREE.Group();
        const edge = new THREE.MeshStandardMaterial({ color: 0x0f3f25, roughness: 0.6 });
        const face = withFins ? pcbGreen : pcbChips;
        g.add(new THREE.Mesh(new THREE.BoxGeometry(len, ht, 0.018), [edge, edge, edge, edge, face, face]));
        for (let k = 0; k < 2; k++) g.add(box(0.13, 0.07, 0.05, M.black, len / 2 - 0.12, ht / 2 - 0.12 - k * 0.11, 0.034)); // PCIe power inputs
        g.add(box(0.2, 0.05, 0.03, new THREE.MeshStandardMaterial({ color: 0xe9e9e4, roughness: 0.5 }), len / 2 - 0.16, -ht / 2 + 0.1, 0.025)); // data connector
        if (withFins) {
          const nf = 30, fl = len * 0.86, fd = 0.105, base = 0.02;
          const fins = new THREE.InstancedMesh(new THREE.BoxGeometry(fl, 0.007, fd), M.fin, nf * 2);
          const m4 = new THREE.Matrix4();
          for (let i = 0; i < nf; i++) for (const side of [1, -1]) {
            m4.makeTranslation(-len * 0.04, -ht * 0.41 + (i * ht * 0.82) / (nf - 1), side * (0.009 + base + fd / 2));
            fins.setMatrixAt(i * 2 + (side > 0 ? 0 : 1), m4);
          }
          fins.castShadow = true; g.add(fins);
          for (const side of [1, -1]) g.add(box(fl, ht * 0.84, base, M.fin, -len * 0.04, 0, side * (0.009 + base / 2)));
        }
        return g;
      };

      // Power supply: rounded aluminium case, perforated vent end with its own fan guard, label, AC inlet.
      const psu = (len: number, ht: number, wd: number) => {
        const g = new THREE.Group();
        g.add(rbox(len, ht, wd, M.alu, 0.04));
        const vent = new THREE.Mesh(new THREE.PlaneGeometry(wd * 0.86, ht * 0.8), perforated); vent.rotation.y = -Math.PI / 2; vent.position.x = -len / 2 - 0.002; g.add(vent);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(Math.min(wd, ht) * 0.34, 0.008, 6, 48), M.aluDark); ring.rotation.y = Math.PI / 2; ring.position.x = -len / 2 - 0.006; g.add(ring);
        const plate = new THREE.Mesh(new THREE.PlaneGeometry(len * 0.46, ht * 0.66), label(int.psu?.name ?? "PSU", "Power supply"));
        plate.position.set(len * 0.05, 0, wd / 2 + 0.003); g.add(plate);
        g.add(rbox(0.07, ht * 0.42, 0.16, M.black, 0.01, len / 2 + 0.03, 0, -wd * 0.25)); // AC inlet
        return g;
      };

      // Control board: blue PCB with chips, RJ45 port with link LEDs, IP-report button.
      const control = (len: number, wd: number) => {
        const g = new THREE.Group();
        const edge = new THREE.MeshStandardMaterial({ color: 0x10244f, roughness: 0.6 });
        g.add(new THREE.Mesh(new THREE.BoxGeometry(len, 0.016, wd), [edge, edge, pcbCtrl, edge, edge, edge]));
        g.add(rbox(0.22, 0.17, 0.19, M.aluDark, 0.015, len / 2 - 0.1, 0.095, -wd * 0.22));
        g.add(box(0.012, 0.1, 0.12, M.black, len / 2 + 0.006, 0.09, -wd * 0.22));
        const led = box(0.03, 0.03, 0.03, M.led, len / 2 + 0.004, 0.16, -wd * 0.12); g.add(led);
        g.add(box(0.04, 0.04, 0.04, M.black, len / 2 - 0.03, 0.03, wd * 0.25));
        return { g, led };
      };

      let ledMesh: THREE_NS.Mesh | null = null;
      const spread = Math.max(1.6, W * 1.05);

      if (cooling === "Air") {
        const front = int.fans?.front ?? 1, rear = int.fans?.rear ?? 1;
        const fanSize = int.fanSize === "14 cm" ? 1.4 : 1.2, fanDepth = int.fanSize === "14 cm" ? 0.38 : 0.38;
        const psuH = int.psu?.mount === "internal" ? 0 : Math.min(0.6, H * 0.19);
        const bodyH = H - psuH, t = 0.035;
        // Chassis sleeve (bottom, top, far side) and the near side panel as its own part.
        const shell = new THREE.Group();
        shell.add(box(L, t, W, M.alu, 0, -bodyH / 2 + t / 2, 0));
        shell.add(box(L, t, W, M.alu, 0, bodyH / 2 - t / 2, 0));
        shell.add(box(L, bodyH, t, M.alu, 0, 0, -W / 2 + t / 2));
        for (const x of [-L / 2 + 0.06, L / 2 - 0.06]) shell.add(box(0.04, bodyH, W, M.aluDark, x, 0, 0)); // fan bulkheads (frame)
        shell.position.y = -psuH / 2;
        add({ id: "chassis", label: "Chassis", detail: `${Lmm} × ${Wmm} × ${Hmm} mm`, obj: shell, off: [0, 0, 0], order: 0 });
        const side = new THREE.Group();
        side.add(box(L, bodyH, t, M.alu));
        const tr = trim(L, bodyH); tr.position.z = t / 2; side.add(tr);
        const np = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), sticker(modelName, model ? `${model.watts.toLocaleString("en-US")} W · ${model.hashrate ?? ""}` : "Air-cooled")); np.position.set(L * 0.12, bodyH * 0.12, t / 2 + 0.03); side.add(np);
        side.position.set(0, -psuH / 2, W / 2 - t / 2);
        add({ id: "side", obj: side, off: [0, 0, spread * 3.4], order: 9, fadeOut: true });
        const boardLen = L * 0.82, boardH = Math.min(bodyH * 0.78, 1.7);
        for (let i = 0; i < nBoards; i++) {
          const z = -W / 2 + (W * (i + 0.5)) / nBoards;
          const b = hashboard(boardLen, boardH, true); b.position.set(-L * 0.02, -psuH / 2, z);
          add({ id: `hb${i}`, label: i === nBoards - 1 ? boardsLabel : undefined, detail: i === nBoards - 1 ? "finned heatsinks" : undefined, obj: b, off: [0, 0, spread * (1 + (nBoards - 1 - i) * 0.62)], order: 3 + (nBoards - 1 - i) * 0.25 });
        }
        const fanLabel = int.fans ? `Fans ×${front + rear}` : "Fans";
        const fanDetail = int.fanSize ? `${int.fanSize} · front and rear` : "front and rear";
        const mkFans = (count: number, x: number, dir: number, id: string, withLabel: boolean) => {
          if (!count) return;
          const g = new THREE.Group();
          const fs = Math.min(fanSize, (bodyH * 0.96) / count, W * 0.95);
          for (let i = 0; i < count; i++) { const f = fan(fs, fanDepth); f.position.y = -bodyH / 2 + (bodyH * (i + 0.5)) / count; g.add(f); }
          g.position.set(x + dir * (fanDepth / 2), -psuH / 2, 0);
          add({ id, label: withLabel ? fanLabel : undefined, detail: withLabel ? fanDetail : undefined, obj: g, off: [dir * 1.5, 0, 0], order: 1 });
        };
        mkFans(front, -L / 2, -1, "fanF", true);
        mkFans(rear, L / 2, 1, "fanR", false);
        if (psuH > 0) {
          const p = psu(L * 0.66, psuH * 0.92, W * 0.82); p.position.set(-L * 0.05, H / 2 - psuH / 2, 0);
          // Power cables from the supply's rear into each hashboard's PCIe inputs (they travel with the supply).
          const cableM = new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: 0.55 });
          for (let i = 0; i < nBoards; i++) {
            const z = -W / 2 + (W * (i + 0.5)) / nBoards;
            const tx = -L * 0.02 + (L * 0.82) / 2 - 0.12 - p.position.x, ty = -psuH / 2 + Math.min(bodyH * 0.78, 1.7) / 2 - 0.12 - p.position.y;
            for (const dz of [-0.025, 0.025]) p.add(cable([[L * 0.33, 0, z * 0.6 + dz], [L * 0.33 + 0.18, -0.05, z * 0.8 + dz], [tx + 0.22, ty + 0.25, z + dz], [tx, ty, z + 0.034 + dz]], 0.016, cableM));
          }
          add({ id: "psu", label: int.psu?.name ? `${int.psu.name} power supply` : "Power supply", detail: "mounted on the chassis", obj: p, off: [0, 1.7, 0], order: 6 });
        } else {
          const p = psu(L * 0.24, bodyH * 0.3, W * 0.8); p.position.set(L * 0.3, -bodyH * 0.3, 0);
          add({ id: "psu", label: int.psu?.name ? `${int.psu.name} power supply` : "Power supply", obj: p, off: [1.2, -0.4, 0], order: 6 });
        }
        const c = control(L * 0.22, W * 0.7); c.g.position.set(L * 0.36, bodyH / 2 - psuH / 2 - 0.12, 0); ledMesh = c.led;
        // Grey ribbon cables from the control board down to each hashboard's data connector.
        const ribbon = new THREE.MeshStandardMaterial({ color: 0x9da3ab, roughness: 0.65 });
        for (let i = 0; i < nBoards; i++) {
          const z = -W / 2 + (W * (i + 0.5)) / nBoards;
          const by = -psuH / 2 - Math.min(bodyH * 0.78, 1.7) / 2 + 0.1 - c.g.position.y, bx = -L * 0.02 + (L * 0.82) / 2 - 0.16 - c.g.position.x;
          c.g.add(cable([[-L * 0.08, 0.01, z * 0.5], [-L * 0.06, -0.3, z * 0.8], [bx + 0.1, by + 0.3, z], [bx, by, z + 0.03]], 0.011, ribbon));
        }
        add({ id: "ctrl", label: int.control ?? "Control board", detail: "Ethernet, status", obj: c.g, off: [1.1, 1.0, 0], order: 5 });
      } else {
        const t = 0.04;
        const caseG = new THREE.Group();
        caseG.add(box(L, t, W, M.steel, 0, -H / 2 + t / 2, 0));
        caseG.add(box(L, H, t, M.steel, 0, 0, -W / 2 + t / 2));
        for (const x of [-L / 2 + t / 2, L / 2 - t / 2]) caseG.add(box(t, H, W, M.steel, x, 0, 0));
        add({ id: "chassis", label: "Sealed case", detail: `${Lmm} × ${Wmm} × ${Hmm} mm · no fans`, obj: caseG, off: [0, 0, 0], order: 0 });
        add({ id: "lid", obj: box(L, t, W, M.steel, 0, H / 2 - t / 2, 0), off: [0, spread * 2.2, 0], order: 9, fadeOut: true });
        const hs = new THREE.Group(); hs.add(box(L, H, t, M.steel));
        const htr = trim(L, H); htr.position.z = t / 2; hs.add(htr);
        const hnp = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7), sticker(modelName, model ? `${model.watts.toLocaleString("en-US")} W · ${model.hashrate ?? ""}` : "Hydro-cooled")); hnp.position.set(-L * 0.1, H * 0.12, t / 2 + 0.03); hs.add(hnp);
        hs.position.set(0, 0, W / 2 - t / 2);
        add({ id: "side", obj: hs, off: [0, 0, spread * 3.2], order: 9.2, fadeOut: true });
        // End panel details: power inlet and Ethernet on the connector end.
        caseG.add(box(0.03, 0.26, 0.32, M.black, L / 2 + 0.012, -H * 0.3, -W * 0.22));
        caseG.add(box(0.03, 0.14, 0.18, M.aluDark, L / 2 + 0.012, H * 0.32, -W * 0.25));
        const boardLen = L * 0.7, boardH = H * 0.72;
        for (let i = 0; i < nBoards; i++) {
          const z = -W / 2 + (W * (i + 0.5)) / nBoards;
          const b = hashboard(boardLen, boardH, false); b.position.set(-L * 0.04, 0, z);
          add({ id: `hb${i}`, label: i === nBoards - 1 ? boardsLabel : undefined, detail: i === nBoards - 1 ? "on the coolant manifold" : undefined, obj: b, off: [0, 0, spread * (1 + (nBoards - 1 - i) * 0.62)], order: 3 + (nBoards - 1 - i) * 0.25 });
        }
        // Manifold along the front with the inlet (upper) and outlet (lower) connectors through the front wall.
        const man = new THREE.Group();
        for (const [y, ring] of [[H * 0.2, M.blueRing], [-H * 0.2, M.redRing]] as const) {
          const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, W * 0.86, 20), M.copper); pipe.rotation.x = Math.PI / 2; pipe.position.set(0, y, 0); man.add(pipe);
          const qc = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.42, 24), M.alu); qc.rotation.z = Math.PI / 2; qc.position.set(-0.32, y, 0); man.add(qc);
          const rg = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.03, 10, 28), ring); rg.rotation.y = Math.PI / 2; rg.position.set(-0.5, y, 0); man.add(rg);
          const hex = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 6), M.screw); hex.rotation.z = Math.PI / 2; hex.position.set(-0.16, y, 0); man.add(hex);
          for (let k = 0; k < 3; k++) { const br = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 14), M.copper); br.position.set(0.05, y, -W * 0.3 + k * W * 0.3); br.rotation.z = Math.PI / 2; man.add(br); } // branch to each board
        }
        man.rotation.y = Math.PI; man.position.set(L / 2 - 0.2, 0, W * 0.12);
        add({ id: "manifold", label: "Coolant manifold", detail: int.ports?.type ? `in / out · ${int.ports.type}` : "in / out", obj: man, off: [1.5, 0, 0], order: 1 });
        const p = psu(L * 0.2, H * 0.6, W * 0.8); p.position.set(-L * 0.36, -H * 0.12, 0);
        add({ id: "psu", label: int.psu?.name ? `${int.psu.name} power supply` : "Power supply", obj: p, off: [-1.5, 0, 0], order: 6 });
        const c = control(L * 0.22, W * 0.66); c.g.position.set(L * 0.3, H / 2 - 0.16, 0); ledMesh = c.led;
        add({ id: "ctrl", label: int.control ?? "Control board", detail: "Ethernet, status", obj: c.g, off: [0.6, 1.3, 0], order: 5 });
      }

      // Shadows: every part casts and receives; a soft shadow catcher sits under the machine.
      root.traverse((o) => { const m = o as THREE_NS.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.32 }));
      ground.rotation.x = -Math.PI / 2; ground.position.y = -H / 2 - 0.01; ground.receiveShadow = true; scene.add(ground);

      // Base positions, exploded offsets, fit.
      const base = new Map(parts.map((p) => [p.id, p.obj.position.clone()]));
      const fadeMats = new Map<string, THREE_NS.Material[]>();
      for (const p of parts) if (p.fadeOut) {
        const mats: THREE_NS.Material[] = [];
        p.obj.traverse((o) => { const m = o as THREE_NS.Mesh; if (m.isMesh) { const list = ([] as THREE_NS.Material[]).concat(m.material).map((x) => { const c = x.clone(); c.transparent = true; mats.push(c); return c; }); m.material = list.length === 1 ? list[0] : list; } });
        fadeMats.set(p.id, mats);
      }
      const viewDir = new THREE.Vector3(0.62, 0.48, 1).normalize();
      const fitDistance = (exploded: boolean) => {
        const b3 = new THREE.Box3();
        for (const p of parts) {
          if (p.fadeOut && exploded) continue;
          const bp = base.get(p.id)!;
          p.obj.position.copy(bp).add(exploded ? new THREE.Vector3(...p.off) : new THREE.Vector3());
          p.obj.updateMatrixWorld(true);
          b3.expandByObject(p.obj);
          p.obj.position.copy(bp);
        }
        const s = new THREE.Vector3(); b3.getSize(s); const c = new THREE.Vector3(); b3.getCenter(c);
        const r = s.length() / 2;
        return { c, d: r / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * (exploded ? 0.74 : 0.98) };
      };
      const fitE = fitDistance(true), fitA = fitDistance(false);

      // ---------- callouts ----------
      const svgNS = "http://www.w3.org/2000/svg";
      const lines = document.createElementNS(svgNS, "svg"); lines.setAttribute("class", "td3-lines"); wrap.appendChild(lines);
      const legend = document.createElement("ol"); legend.className = "td3-legend"; wrap.appendChild(legend);
      const callouts = parts.filter((p) => p.label).map((p, i) => {
        const el = document.createElement("div"); el.className = "td3-callout";
        el.innerHTML = `<i>${i + 1}</i><b>${p.label}</b>${p.detail ? `<small>${p.detail}</small>` : ""}`;
        const li = document.createElement("li"); li.innerHTML = `<i>${i + 1}</i>${p.label}`; legend.appendChild(li);
        wrap.appendChild(el);
        const ln = document.createElementNS(svgNS, "polyline"); lines.appendChild(ln);
        const dot = document.createElementNS(svgNS, "circle"); dot.setAttribute("r", "3"); lines.appendChild(dot);
        return { p, el, ln, dot };
      });
      const note = document.createElement("div"); note.className = "td3-note"; note.textContent = `${model ? `${model.name} · ` : ""}${int.note}`; wrap.appendChild(note);

      // ---------- sizing ----------
      let w = 0, h = 0;
      const resize = () => {
        const r = wrap.getBoundingClientRect(); w = Math.max(10, r.width); h = Math.max(10, r.height);
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize); ro.observe(wrap);

      // ---------- timeline ----------
      const S = reduced ? 1.8 : 1;
      const T_HOLD = 1.5 * S, T_ASM = 1.9 * S, T_POWER = 1.0 * S;
      const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
      const maxOrder = Math.max(...parts.map((p) => p.order));
      const t0 = performance.now();
      let visible = true, fanSpeed = 0;
      const tmp = new THREE.Vector3();

      const layoutCallouts = (alpha: number) => {
        // Narrow screens: numbered markers on the parts and a legend, so no label covers a part.
        const narrow = w < 560;
        wrap.classList.toggle("is-narrow", narrow);
        legend.style.opacity = String(narrow ? alpha : 0);
        const items = callouts.map((c) => {
          c.p.obj.updateMatrixWorld(true);
          const bb = new THREE.Box3().setFromObject(c.p.obj); bb.getCenter(tmp); tmp.project(camera);
          return { c, ax: (tmp.x * 0.5 + 0.5) * w, ay: (-tmp.y * 0.5 + 0.5) * h };
        });
        if (narrow) {
          for (const it of items) {
            it.c.el.style.transform = `translate(${(it.ax - 10).toFixed(1)}px, ${(it.ay - 10).toFixed(1)}px)`;
            it.c.el.style.opacity = String(alpha); it.c.ln.style.opacity = "0"; it.c.dot.style.opacity = "0";
          }
          return;
        }
        const cx = w / 2;
        for (const side of ["L", "R"] as const) {
          const list = items.filter((it) => (side === "L" ? it.ax < cx : it.ax >= cx)).sort((a, b) => a.ay - b.ay);
          let y = 14;
          for (const it of list) {
            const lh = it.c.el.offsetHeight || 34;
            const ty = Math.max(y, Math.min(h - lh - 30, it.ay - lh / 2));
            y = ty + lh + 8;
            const lw = it.c.el.offsetWidth || 120;
            const lx = side === "L" ? 10 : w - lw - 10;
            it.c.el.style.transform = `translate(${lx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
            it.c.el.style.textAlign = side === "L" ? "left" : "right";
            it.c.el.style.opacity = String(alpha);
            const ex = side === "L" ? lx + lw + 6 : lx - 6, ey = ty + lh / 2;
            const kx = side === "L" ? ex + 18 : ex - 18;
            it.c.ln.setAttribute("points", `${ex},${ey} ${kx},${ey} ${it.ax.toFixed(1)},${it.ay.toFixed(1)}`);
            it.c.ln.style.opacity = String(alpha); it.c.dot.style.opacity = String(alpha);
            it.c.dot.setAttribute("cx", it.ax.toFixed(1)); it.c.dot.setAttribute("cy", it.ay.toFixed(1));
          }
        }
      };

      const frame = () => {
        raf = 0;
        if (disposed) return;
        const t = (performance.now() - t0) / 1000;
        // exploded -> assembled
        const a = Math.min(1, Math.max(0, (t - T_HOLD) / T_ASM));
        for (const p of parts) {
          // Lower order assembles first: fans, then the boards, control board, power supply, and the covers last.
          const local = Math.min(1, Math.max(0, (a * (maxOrder + 1.5) - p.order) / 1.5));
          const k = 1 - ease(local);
          p.obj.position.copy(base.get(p.id)!).addScaledVector(new THREE.Vector3(...p.off), k);
          const mats = fadeMats.get(p.id);
          if (mats) for (const m of mats) m.opacity = 0.05 + 0.95 * ease(local);
        }
        const ca = ease(a);
        const c = fitE.c.clone().lerp(fitA.c, ca), d = THREE.MathUtils.lerp(fitE.d, fitA.d, ca);
        // gentle turn once assembled
        const tp = Math.max(0, t - T_HOLD - T_ASM);
        const yaw = Math.sin(tp * (reduced ? 0.18 : 0.35)) * 0.32 * Math.min(1, tp / 2);
        const dir = viewDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        camera.position.copy(c).addScaledVector(dir, d); camera.lookAt(c);
        // power up
        const pw = Math.min(1, Math.max(0, (t - T_HOLD - T_ASM) / T_POWER));
        fanSpeed = pw * (reduced ? 6 : 14);
        for (const r of rotors) r.rotation.x += fanSpeed * 0.016;
        if (ledMesh) (ledMesh.material as THREE_NS.MeshStandardMaterial).emissiveIntensity = pw > 0 ? 1.2 + Math.sin(t * 6) * 0.6 : 0;
        const calloutAlpha = 1 - Math.min(1, Math.max(0, (a - 0.15) / 0.3));
        layoutCallouts(t < 0.25 ? t / 0.25 * calloutAlpha : calloutAlpha);
        note.style.opacity = String(calloutAlpha < 1 ? 0.55 + 0.45 * calloutAlpha : 1);
        renderer.render(scene, camera);
        if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); });
      io.observe(wrap);
      const vis = () => { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(frame); };
      document.addEventListener("visibilitychange", vis);
      raf = requestAnimationFrame(frame);
      onReady?.(true);

      cleanup = () => {
        io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", vis);
        if (raf) cancelAnimationFrame(raf);
        scene.traverse((o) => { const m = o as THREE_NS.Mesh; if (m.isMesh) { m.geometry.dispose(); for (const mm of ([] as THREE_NS.Material[]).concat(m.material)) { (mm as THREE_NS.MeshStandardMaterial).map?.dispose(); mm.dispose(); } } });
        pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss();
        canvas.remove(); lines.remove(); note.remove(); legend.remove(); callouts.forEach((c) => c.el.remove());
      };
      if (disposed) cleanup();
    })().catch((e) => { console.error("3D teardown", e); setFailed(true); onReady?.(false); });

    return () => { disposed = true; cleanup(); };
  }, [slug, cooling, onReady]);

  if (failed) return null;
  return <div ref={wrapRef} className="td3" aria-hidden="true" />;
}
