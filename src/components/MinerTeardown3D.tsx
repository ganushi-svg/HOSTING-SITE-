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
      const canvas = renderer.domElement;
      canvas.className = "td3-canvas";
      wrap.prepend(canvas);
      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.add(new THREE.HemisphereLight(0xdfe7ff, 0x1a1424, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 7, 6); scene.add(key);
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

      const plate = (lines: [string, string]) => {
        const c = document.createElement("canvas"); c.width = 768; c.height = 256; const g = c.getContext("2d")!;
        g.fillStyle = "#101216"; g.fillRect(0, 0, 768, 256); g.strokeStyle = "#5b6470"; g.lineWidth = 6; g.strokeRect(8, 8, 752, 240);
        g.fillStyle = "#f2f4f7"; g.font = "700 72px Arial, sans-serif"; g.fillText(lines[0], 40, 118);
        g.fillStyle = "#9aa3ad"; g.font = "500 40px Arial, sans-serif"; g.fillText(lines[1], 42, 190);
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
        return new THREE.MeshStandardMaterial({ map: t, roughness: 0.5, metalness: 0.2 });
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

      const fan = (size: number, depth: number) => {
        const g = new THREE.Group();
        const s = new THREE.Shape(); const h = size / 2, r = size * 0.47;
        s.moveTo(-h, -h); s.lineTo(h, -h); s.lineTo(h, h); s.lineTo(-h, h); s.lineTo(-h, -h);
        const hole = new THREE.Path(); hole.absarc(0, 0, r, 0, Math.PI * 2, true); s.holes.push(hole);
        const frame = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 40 }), M.black);
        frame.rotation.y = Math.PI / 2; frame.position.x = -depth / 2; g.add(frame);
        const rotor = new THREE.Group();
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.16, size * 0.16, depth * 0.8, 32), M.black); hub.rotation.z = Math.PI / 2; rotor.add(hub);
        for (let i = 0; i < 7; i++) {
          const b = new THREE.Mesh(new THREE.BoxGeometry(depth * 0.12, r * 0.78, size * 0.2), M.blade);
          const holder = new THREE.Group(); holder.rotation.x = (i / 7) * Math.PI * 2;
          b.position.y = r * 0.52; b.rotation.y = 0.5; holder.add(b); rotor.add(holder);
        }
        g.add(rotor); rotors.push(rotor);
        for (const rr of [r * 0.98, r * 0.62]) { const t = new THREE.Mesh(new THREE.TorusGeometry(rr, size * 0.008, 8, 48), M.aluDark); t.rotation.y = Math.PI / 2; t.position.x = depth / 2 + 0.01; g.add(t); }
        for (let i = 0; i < 4; i++) { const sp = box(0.01, r * 2, size * 0.012, M.aluDark, depth / 2 + 0.01); sp.rotation.x = (i / 4) * Math.PI; g.add(sp); }
        return g;
      };

      const hashboard = (len: number, ht: number, withFins: boolean) => {
        const g = new THREE.Group();
        g.add(box(len, ht, 0.018, M.pcb));
        g.add(box(0.36, ht * 0.22, 0.03, M.gold, len / 2 - 0.22, -ht / 2 + ht * 0.14, 0.012)); // connector
        if (withFins) {
          const nf = 15, fl = len * 0.9, fd = 0.11;
          const fins = new THREE.InstancedMesh(new THREE.BoxGeometry(fl, 0.012, fd), M.fin, nf * 2);
          const m4 = new THREE.Matrix4();
          for (let i = 0; i < nf; i++) for (const side of [1, -1]) {
            m4.makeTranslation(-len * 0.03, -ht * 0.42 + (i * ht * 0.84) / (nf - 1), side * (0.009 + fd / 2));
            fins.setMatrixAt(i * 2 + (side > 0 ? 0 : 1), m4);
          }
          g.add(fins);
          g.add(box(fl, ht * 0.86, 0.01, M.aluDark, -len * 0.03, 0, 0.009 + fd)); // heatsink back plates
          g.add(box(fl, ht * 0.86, 0.01, M.aluDark, -len * 0.03, 0, -0.009 - fd));
        } else {
          const cols = 12, rows = 4;
          const chips = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.16, 0.03), M.chip, cols * rows);
          const m4 = new THREE.Matrix4();
          for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { m4.makeTranslation(-len * 0.42 + (i * len * 0.78) / (cols - 1), -ht * 0.32 + (j * ht * 0.64) / (rows - 1), 0.024); chips.setMatrixAt(i * rows + j, m4); }
          g.add(chips);
        }
        return g;
      };

      const psu = (len: number, ht: number, wd: number) => {
        const g = new THREE.Group();
        g.add(box(len, ht, wd, M.alu));
        for (let i = 0; i < 9; i++) g.add(box(0.012, ht * 0.62, wd * 0.07, M.black, -len / 2 - 0.004, 0, -wd * 0.36 + (i * wd * 0.72) / 8));
        const plate = new THREE.Mesh(new THREE.PlaneGeometry(len * 0.5, ht * 0.62), label(int.psu?.name ?? "PSU", "Power supply"));
        plate.position.set(0, 0, wd / 2 + 0.003); g.add(plate);
        g.add(box(0.06, ht * 0.4, 0.14, M.black, len / 2 + 0.03, 0, -wd * 0.25)); // AC inlet
        return g;
      };

      const control = (len: number, wd: number) => {
        const g = new THREE.Group();
        g.add(box(len, 0.016, wd, M.pcbBlue));
        g.add(box(0.22, 0.16, 0.18, M.aluDark, len / 2 - 0.1, 0.09, -wd * 0.22)); // Ethernet port
        g.add(box(0.28, 0.04, 0.28, M.chip, -len * 0.1, 0.03, 0));
        const led = box(0.05, 0.05, 0.05, M.led, len / 2 - 0.06, 0.04, wd * 0.3); g.add(led);
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
        const np = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.5), plate([modelName, "Air-cooled"])); np.position.set(L * 0.12, bodyH * 0.12, t / 2 + 0.03); side.add(np);
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
          add({ id: "psu", label: int.psu?.name ? `${int.psu.name} power supply` : "Power supply", detail: "mounted on the chassis", obj: p, off: [0, 1.7, 0], order: 6 });
        } else {
          const p = psu(L * 0.24, bodyH * 0.3, W * 0.8); p.position.set(L * 0.3, -bodyH * 0.3, 0);
          add({ id: "psu", label: int.psu?.name ? `${int.psu.name} power supply` : "Power supply", obj: p, off: [1.2, -0.4, 0], order: 6 });
        }
        const c = control(L * 0.22, W * 0.7); c.g.position.set(L * 0.36, bodyH / 2 - psuH / 2 - 0.12, 0); ledMesh = c.led;
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
        const hnp = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.47), plate([modelName, "Hydro-cooled"])); hnp.position.set(-L * 0.1, H * 0.12, t / 2 + 0.03); hs.add(hnp);
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
        }
        man.rotation.y = Math.PI; man.position.set(L / 2 - 0.2, 0, W * 0.12);
        add({ id: "manifold", label: "Coolant manifold", detail: int.ports?.type ? `in / out · ${int.ports.type}` : "in / out", obj: man, off: [1.5, 0, 0], order: 1 });
        const p = psu(L * 0.2, H * 0.6, W * 0.8); p.position.set(-L * 0.36, -H * 0.12, 0);
        add({ id: "psu", label: int.psu?.name ? `${int.psu.name} power supply` : "Power supply", obj: p, off: [-1.5, 0, 0], order: 6 });
        const c = control(L * 0.22, W * 0.66); c.g.position.set(L * 0.3, H / 2 - 0.16, 0); ledMesh = c.led;
        add({ id: "ctrl", label: int.control ?? "Control board", detail: "Ethernet, status", obj: c.g, off: [0.6, 1.3, 0], order: 5 });
      }

      // Base positions, exploded offsets, fit.
      const base = new Map(parts.map((p) => [p.id, p.obj.position.clone()]));
      const fadeMats = new Map<string, THREE_NS.Material[]>();
      for (const p of parts) if (p.fadeOut) {
        const mats: THREE_NS.Material[] = [];
        p.obj.traverse((o) => { const m = o as THREE_NS.Mesh; if (m.isMesh) { m.material = (m.material as THREE_NS.Material).clone(); (m.material as THREE_NS.Material).transparent = true; mats.push(m.material as THREE_NS.Material); } });
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
      const clock = new THREE.Clock();
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
        const t = clock.getElapsedTime();
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
        scene.traverse((o) => { const m = o as THREE_NS.Mesh; if (m.isMesh) { m.geometry.dispose(); const mm = m.material as THREE_NS.Material & { map?: THREE_NS.Texture }; mm.map?.dispose(); mm.dispose(); } });
        pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss();
        canvas.remove(); lines.remove(); note.remove(); legend.remove(); callouts.forEach((c) => c.el.remove());
      };
      if (disposed) cleanup();
    })().catch(() => { setFailed(true); onReady?.(false); });

    return () => { disposed = true; cleanup(); };
  }, [slug, cooling, onReady]);

  if (failed) return null;
  return <div ref={wrapRef} className="td3" aria-hidden="true" />;
}
