"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Textures de marque dessinées sur canvas (wordmark GORBUZ)            */
/* ------------------------------------------------------------------ */

const readDisplayFamily = () => {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-anton").trim();
  return v ? `${v}, Impact, sans-serif` : "Impact, sans-serif";
};

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, family: string) => void;

function createCanvasTexture(width: number, height: number, draw: Draw) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const family = readDisplayFamily();
  const render = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    draw(ctx, width, height, family);
    tex.needsUpdate = true;
  };
  render();
  return { tex, render, family };
}

/** Texture canvas créée une seule fois (composant client uniquement), redessinée quand la police est prête. */
function useCanvasTexture(width: number, height: number, draw: Draw) {
  const [handle] = useState(() => createCanvasTexture(width, height, draw));
  const { invalidate } = useThree();
  useEffect(() => {
    const { tex, render, family } = handle;
    if ("fonts" in document) {
      document.fonts
        .load(`100px ${family}`)
        .then(() => {
          render();
          invalidate();
        })
        .catch(() => undefined);
    }
    return () => tex.dispose();
  }, [handle, invalidate]);
  return handle.tex;
}

const drawBand: Draw = (ctx, w, h, family) => {
  ctx.fillStyle = "#d94b32";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#f4efe6";
  ctx.font = `${h * 0.62}px ${family}`;
  ctx.textBaseline = "middle";
  const word = "GORBUZ";
  const gap = 28;
  const ww = ctx.measureText(word).width;
  let x = 24;
  while (x < w) {
    ctx.fillText(word, x, h / 2 + 2);
    x += ww + gap;
    ctx.save();
    ctx.translate(x - gap / 2, h / 2);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-h * 0.07, -h * 0.07, h * 0.14, h * 0.14);
    ctx.restore();
  }
};

const drawLabel: Draw = (ctx, w, h, family) => {
  ctx.fillStyle = "#d94b32";
  ctx.font = `${h * 0.78}px ${family}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText("GORBUZ", 10, h / 2 + 4);
  ctx.font = `600 ${h * 0.17}px system-ui, sans-serif`;
  ctx.fillStyle = "#171717";
  ctx.fillText("SNACK", 14, h * 0.12);
};

/* ------------------------------------------------------------------ */
/* Générateur pseudo-aléatoire déterministe pour les frites            */
/* ------------------------------------------------------------------ */

const seeded = (seed: number) => () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

/* ------------------------------------------------------------------ */
/* Objets                                                              */
/* ------------------------------------------------------------------ */

const BREAD = "#dcb07d";
const PAPER = "#f4efe6";
const RED = "#d94b32";
const SKIN = "#8c6947";
const FILLING = "#f1e6cf";
const FOIL = "#d7b58b";
const AMBER = "#d49a43";

function Tray({ label }: { label: THREE.CanvasTexture | null }) {
  return (
    <group position={[0, -1.02, 0]}>
      <RoundedBox args={[4.8, 0.16, 3.1]} radius={0.06} smoothness={4} receiveShadow castShadow>
        <meshStandardMaterial color="#2b241f" roughness={0.55} metalness={0.08} />
      </RoundedBox>
      <mesh position={[0, 0.08, 1.52]} receiveShadow>
        <boxGeometry args={[4.8, 0.05, 0.06]} />
        <meshStandardMaterial color={RED} roughness={0.6} />
      </mesh>
      <RoundedBox args={[4.4, 0.03, 2.7]} radius={0.015} smoothness={2} position={[0, 0.095, 0]} receiveShadow>
        <meshStandardMaterial color={PAPER} roughness={0.95} />
      </RoundedBox>
      {label && (
        <mesh position={[-1.35, 0.113, 0.86]} rotation={[-Math.PI / 2, 0, 0.1]}>
          <planeGeometry args={[1.45, 0.42]} />
          <meshBasicMaterial map={label} transparent toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

function Durum({ band }: { band: THREE.CanvasTexture | null }) {
  return (
    <group position={[0.5, -0.46, 0.55]} rotation={[0.1, 0.62, 0.22]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <capsuleGeometry args={[0.42, 1.9, 12, 32]} />
        <meshStandardMaterial color={BREAD} roughness={0.82} />
      </mesh>
      {/* Extrémité toastée */}
      <mesh position={[1.22, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.33, 32]} />
        <meshStandardMaterial color="#c0905c" roughness={0.9} />
      </mesh>
      {/* Manchon papier */}
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.465, 0.465, 1.3, 40, 1, true]} />
        <meshStandardMaterial color={PAPER} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <ringGeometry args={[0.41, 0.465, 40]} />
        <meshStandardMaterial color={PAPER} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      {/* Bande rouge Gorbuz */}
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.475, 0.475, 0.34, 48, 1, true]} />
        {band ? (
          <meshStandardMaterial map={band} roughness={0.6} side={THREE.DoubleSide} />
        ) : (
          <meshStandardMaterial color={RED} roughness={0.6} side={THREE.DoubleSide} />
        )}
      </mesh>
    </group>
  );
}

function Fries() {
  const sticks = useMemo(() => {
    const rnd = seeded(7);
    const colors = ["#e9b759", "#d49a43", "#f0c66b", "#c88f3b", "#e2ad4f"];
    return Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2 + rnd() * 0.6;
      const r = 0.1 + rnd() * 0.3;
      return {
        pos: [Math.cos(a) * r, 0.25 + rnd() * 0.25, Math.sin(a) * r] as [number, number, number],
        rot: [(rnd() - 0.5) * 0.5, rnd() * Math.PI, (rnd() - 0.5) * 0.5] as [number, number, number],
        h: 1.1 + rnd() * 0.6,
        color: colors[i % colors.length],
      };
    });
  }, []);

  return (
    <group position={[-1.45, -0.24, -0.35]} rotation={[0, 0.35, 0]}>
      {sticks.map((f, i) => (
        <RoundedBox key={i} args={[0.12, f.h, 0.12]} radius={0.025} smoothness={2} position={f.pos} rotation={f.rot} castShadow>
          <meshStandardMaterial color={f.color} roughness={0.7} />
        </RoundedBox>
      ))}
      {/* Boîte évasée : cylindre à 4 faces */}
      <mesh position={[0, -0.22, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.46, 1.12, 4, 1]} />
        <meshStandardMaterial color={PAPER} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.17, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.635, 0.6, 0.24, 4, 1, true]} />
        <meshStandardMaterial color={RED} roughness={0.6} flatShading side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Kumpir() {
  return (
    <group position={[1.6, -0.6, -0.85]} rotation={[0, -0.3, 0]}>
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.86, 48]} />
        <meshStandardMaterial color={FOIL} roughness={0.45} metalness={0.25} />
      </mesh>
      <mesh scale={[1, 0.72, 0.8]} castShadow receiveShadow>
        <sphereGeometry args={[0.74, 48, 32]} />
        <meshStandardMaterial color={SKIN} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.3, 0]} scale={[0.78, 0.3, 0.52]} castShadow>
        <sphereGeometry args={[0.74, 40, 24]} />
        <meshStandardMaterial color={FILLING} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.03, 12, 40, Math.PI * 1.2]} />
        <meshStandardMaterial color={AMBER} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Pot() {
  return (
    <group position={[-0.35, -0.78, 1.1]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.19, 0.28, 32]} />
        <meshStandardMaterial color={PAPER} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color={AMBER} roughness={0.35} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Composition animée                                                  */
/* ------------------------------------------------------------------ */

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

interface StillLifeProps {
  animate: boolean;
  onReady: () => void;
}

function StillLife({ animate, onReady }: StillLifeProps) {
  const group = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const ready = useRef(false);
  const band = useCanvasTexture(1024, 128, drawBand);
  const label = useCanvasTexture(512, 148, drawLabel);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.current = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
    };
    if (fine && animate) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [animate]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;

    if (!ready.current && t > 0.05) {
      ready.current = true;
      onReady();
    }

    const e = animate ? easeOut(Math.min(t / 1.6, 1)) : 1;
    const sp = scroll.current;
    const idle = animate ? Math.sin(t * 0.24) * 0.11 : 0;

    g.scale.setScalar((0.86 + 0.14 * e) * (1 - sp * 0.1));
    g.position.y = -0.3 + 0.3 * e + sp * 1.1;
    g.position.x = -0.1;

    const targetY = -0.42 + idle + pointer.current.x * 0.16 + sp * 0.5;
    const targetX = 0.02 + pointer.current.y * -0.05;
    const k = Math.min(1, delta * 3.2);
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
  });

  return (
    <group ref={group} rotation={[0.02, -0.42, 0]} scale={0.86} position={[-0.1, -0.3, 0]}>
      <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.22} enabled={animate}>
        <Tray label={label} />
        <Durum band={band} />
        <Fries />
        <Kumpir />
        <Pot />
      </Float>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.45} color="#f4e8d6" />
      <hemisphereLight args={["#f4efe6", "#2a211a", 0.55]} />
      <directionalLight
        position={[4.5, 6.5, 3.5]}
        intensity={2.6}
        color="#ffd9a8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-5, 3, 1.5]} intensity={0.75} color="#d49a43" />
      <spotLight position={[0, 5, -6]} intensity={18} angle={0.7} penumbra={1} color="#f4efe6" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Canvas                                                              */
/* ------------------------------------------------------------------ */

export interface HeroSceneProps {
  /** false = mouvement réduit : rendu statique, aucune boucle d’animation. */
  animate: boolean;
  /** false = hero hors écran : boucle en pause. */
  active: boolean;
  /** Plafond de densité de pixels (plus bas sur tablette). */
  maxDpr: number;
  onReady: () => void;
}

export default function HeroScene({ animate, active, maxDpr, onReady }: HeroSceneProps) {
  return (
    <Canvas
      dpr={[1, maxDpr]}
      frameloop={animate && active ? "always" : "demand"}
      shadows
      camera={{ position: [0.15, 2.4, 8.6], fov: 28, near: 0.5, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        camera.lookAt(0, -0.45, 0);
      }}
      style={{ background: "transparent" }}
    >
      <Lights />
      <StillLife animate={animate} onReady={onReady} />
      <ContactShadows
        position={[0, -1.12, 0]}
        opacity={0.6}
        scale={10}
        blur={2.6}
        far={2.5}
        color="#000000"
        frames={animate ? Infinity : 1}
      />
    </Canvas>
  );
}
