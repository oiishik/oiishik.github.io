import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Theme } from "./ThemeProvider";

type Palette = {
  body: string;
  accent: string;
  glass: string;
  cloud: string;
  cloudOpacity: number;
};

type LiveScene = {
  bodyMat: THREE.MeshStandardMaterial;
  accentMat: THREE.MeshStandardMaterial;
  glassMat: THREE.MeshStandardMaterial;
  pathMat: THREE.LineDashedMaterial;
  cloudMat: THREE.MeshStandardMaterial;
  render: () => void;
  dispose: () => void;
};

function colorsFor(el: Element, theme: Theme, accentProp?: string): Palette {
  const dark = theme === "dark";
  let accent = accentProp || (dark ? "#E8907A" : "#C4472C");
  if (!accentProp) {
    try {
      const cs = getComputedStyle(el);
      const brand = cs.getPropertyValue("--brand").trim() || cs.getPropertyValue("--accent").trim();
      if (brand) accent = brand;
    } catch {
      /* Computed style can fail on a detached canvas. */
    }
  }
  return {
    body: dark ? "#E9DFDA" : "#FFFFFF",
    accent,
    glass: dark ? "#2B2421" : "#3A1D16",
    cloud: dark ? "#5A4C46" : "#FFFFFF",
    cloudOpacity: dark ? 0.55 : 0.85,
  };
}

function createScene(canvas: HTMLCanvasElement, theme: Theme, accentProp?: string): LiveScene | undefined {
  let reduce = false;
  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    reduce = false;
  }

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
  } catch {
    return undefined;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 5.2, 12);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a5a4a, 1.05));
  const sun = new THREE.DirectionalLight(0xffffff, 1.15);
  sun.position.set(5, 9, 7);
  scene.add(sun);

  const colors = colorsFor(canvas, theme, accentProp);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: colors.body,
    roughness: 0.42,
    metalness: 0.08,
    flatShading: true,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: colors.accent,
    roughness: 0.5,
    metalness: 0.05,
    flatShading: true,
    side: THREE.DoubleSide,
  });
  const glassMat = new THREE.MeshStandardMaterial({ color: colors.glass, roughness: 0.2, metalness: 0.3 });

  const plane = new THREE.Group();

  const profile: ReadonlyArray<readonly [number, number]> = [
    [0, 3.3],
    [0.22, 3.12],
    [0.42, 2.78],
    [0.54, 2.25],
    [0.6, 1.4],
    [0.6, -1.2],
    [0.52, -2.2],
    [0.36, -2.95],
    [0.16, -3.4],
    [0.04, -3.55],
    [0, -3.58],
  ];
  const fuselage = new THREE.Mesh(
    new THREE.LatheGeometry(
      profile.map(([x, y]) => new THREE.Vector2(x, y)),
      28,
    ),
    bodyMat,
  );
  fuselage.rotation.z = -Math.PI / 2;
  plane.add(fuselage);

  const cockpit = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 20, 10, 0, Math.PI * 2, 0, Math.PI / 3),
    glassMat,
  );
  cockpit.scale.set(0.8, 0.32, 1.1);
  cockpit.position.set(2.62, 0.3, 0);
  cockpit.rotation.z = -0.95;
  plane.add(cockpit);
  for (let i = 0; i < 9; i++) {
    for (const side of [1, -1]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.02), glassMat);
      win.position.set(1.7 - i * 0.42, 0.24, 0.585 * side);
      plane.add(win);
    }
  }
  const stripe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.605, 0.605, 4.6, 28, 1, true, Math.PI * 0.35, Math.PI * 0.3),
    accentMat,
  );
  stripe.rotation.z = -Math.PI / 2;
  stripe.position.x = -0.2;
  plane.add(stripe);

  const flat = (pts: ReadonlyArray<readonly [number, number]>, depth: number, mat: THREE.Material) => {
    const shape = new THREE.Shape();
    shape.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i][0], pts[i][1]);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 1,
    });
    return new THREE.Mesh(geometry, mat);
  };

  const wingPts: ReadonlyArray<readonly [number, number]> = [
    [0.75, 0],
    [-0.55, 0],
    [-1.7, 3.3],
    [-1.05, 3.3],
  ];
  for (const side of [1, -1]) {
    const wing = flat(wingPts, 0.07, bodyMat);
    wing.rotation.x = (Math.PI / 2) * side;
    wing.position.set(0.25, -0.22, 0);
    plane.add(wing);
    const tip = flat(
      [
        [-1.05, 3.3],
        [-1.7, 3.3],
        [-1.85, 3.32],
        [-1.15, 3.32],
      ],
      0.07,
      accentMat,
    );
    tip.rotation.x = (Math.PI / 2) * side;
    tip.position.set(0.25, -0.22, 0);
    plane.add(tip);
    const engine = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 1.0, 20), bodyMat);
    engine.rotation.z = Math.PI / 2;
    engine.position.set(0.1, -0.55, 1.3 * side);
    plane.add(engine);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.05, 8, 24), accentMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(0.6, -0.55, 1.3 * side);
    plane.add(ring);
    const stabiliser = flat(
      [
        [-2.55, 0],
        [-3.25, 0],
        [-3.7, 1.25],
        [-3.35, 1.25],
      ],
      0.05,
      bodyMat,
    );
    stabiliser.rotation.x = (Math.PI / 2) * side;
    stabiliser.position.set(0, 0.05, 0);
    plane.add(stabiliser);
  }

  const fin = flat(
    [
      [-2.25, 0.35],
      [-3.35, 0.35],
      [-3.75, 1.85],
      [-3.3, 1.85],
    ],
    0.08,
    accentMat,
  );
  fin.position.z = -0.04;
  plane.add(fin);

  plane.scale.setScalar(0.9);
  scene.add(plane);

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-7.5, -2.6, -3),
    new THREE.Vector3(-3.5, -1.6, -1.5),
    new THREE.Vector3(0, -0.4, -0.6),
    new THREE.Vector3(3.5, 0.6, -2),
    new THREE.Vector3(7.5, 2.4, -4),
  ]);
  const pathGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
  const pathMat = new THREE.LineDashedMaterial({
    color: colors.accent,
    dashSize: 0.22,
    gapSize: 0.18,
    transparent: true,
    opacity: 0.7,
  });
  const path = new THREE.Line(pathGeo, pathMat);
  path.computeLineDistances();
  scene.add(path);

  const cloudMat = new THREE.MeshStandardMaterial({
    color: colors.cloud,
    roughness: 1,
    flatShading: true,
    transparent: true,
    opacity: colors.cloudOpacity,
  });
  const clouds: THREE.Group[] = [];
  const makeCloud = (x: number, y: number, z: number, scale: number) => {
    const group = new THREE.Group();
    const blobs: ReadonlyArray<readonly [number, number, number, number]> = [
      [0, 0, 0, 0.9],
      [0.8, -0.1, 0.1, 0.7],
      [-0.8, -0.15, 0, 0.65],
      [0.3, 0.45, -0.1, 0.6],
    ];
    for (const [bx, by, bz, radius] of blobs) {
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 0), cloudMat);
      puff.position.set(bx, by, bz);
      group.add(puff);
    }
    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    scene.add(group);
    clouds.push(group);
  };
  makeCloud(-4.5, 2.2, -5, 0.9);
  makeCloud(4.2, -2.4, -4, 0.75);
  makeCloud(1.5, 3.1, -7, 0.6);
  makeCloud(-2.5, -3.2, -6, 0.55);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const host = canvas.parentElement?.parentElement ?? null;
  const onMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.tx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    pointer.ty = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
  };
  if (host && !reduce) host.addEventListener("pointermove", onMove);

  const size = () => {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  size();
  let observer: ResizeObserver | null = null;
  const render = () => renderer.render(scene, camera);
  try {
    observer = new ResizeObserver(() => {
      size();
      if (reduce) render();
    });
    observer.observe(canvas);
  } catch {
    observer = null;
  }

  const pose = (time: number) => {
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    plane.position.set(0.2, Math.sin(time * 1.1) * 0.18 + 0.1, 0);
    plane.rotation.set(0.1 + pointer.y * 0.12, -0.55 + pointer.x * 0.35, 0.16 + Math.sin(time * 0.8) * 0.07);
  };

  let frame = 0;
  let last = 0;
  let elapsed = 0;
  const loop = (now: number) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    elapsed += dt;
    pose(elapsed);
    clouds.forEach((cloud, index) => {
      cloud.position.x -= dt * (0.35 + index * 0.08);
      if (cloud.position.x < -9) cloud.position.x = 9;
    });
    render();
    frame = requestAnimationFrame(loop);
  };
  pose(0.6);
  try {
    render();
  } catch {
    observer?.disconnect();
    renderer.dispose();
    return undefined;
  }
  if (!reduce) frame = requestAnimationFrame(loop);

  return {
    bodyMat,
    accentMat,
    glassMat,
    pathMat,
    cloudMat,
    render,
    dispose: () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      host?.removeEventListener("pointermove", onMove);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose();
        }
      });
      for (const material of [bodyMat, accentMat, glassMat, pathMat, cloudMat]) material.dispose();
      renderer.dispose();
    },
  };
}

export function PlaneScene({
  theme,
  accent,
  className,
}: {
  theme: Theme;
  accent?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<LiveScene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const live = createScene(canvas, theme, accent);
    if (!live) return;
    sceneRef.current = live;
    return () => {
      live.dispose();
      sceneRef.current = null;
    };
    // Theme changes recolor the live scene; they do not rebuild it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const live = sceneRef.current;
    const canvas = canvasRef.current;
    if (!live || !canvas) return;
    const id = requestAnimationFrame(() => {
      const colors = colorsFor(canvas, theme, accent);
      live.bodyMat.color.set(colors.body);
      live.accentMat.color.set(colors.accent);
      live.glassMat.color.set(colors.glass);
      live.pathMat.color.set(colors.accent);
      live.cloudMat.color.set(colors.cloud);
      live.cloudMat.opacity = colors.cloudOpacity;
      live.render();
    });
    return () => cancelAnimationFrame(id);
  }, [theme, accent]);

  return <canvas className={className} ref={canvasRef} aria-hidden="true" />;
}
