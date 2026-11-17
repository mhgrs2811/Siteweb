"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { displaceSphere, makeBreadTexture, makePaperTexture, makePotatoTexture } from "./textures";

/**
 * SCÈNE 3D HERO — nature morte street-food stylisée, 100 % procédurale.
 *
 * Composition : un plateau charbon, une feuille de papier Gorbuz, un durum roulé
 * dans sa manchette, un cornet de frites, une forme de kumpir ouvert, deux
 * touches de sauce et un ticket. C'est une interprétation décorative des trois
 * familles confirmées, pas une recette.
 *
 * Mouvement : entrée douce, oscillation lente (pas de toupie), flottement
 * subtil, parallaxe pointeur discrète (desktop), légère progression au scroll.
 * Tout est coupé en reduced-motion (rendu statique à la demande).
 */

export interface SceneInputs {
  pointer: MutableRefObject<{ x: number; y: number }>;
  scroll: MutableRefObject<number>;
}

interface HeroSceneProps extends SceneInputs {
  reduced: boolean;
  lite: boolean;
  active: boolean;
  onReady?: () => void;
}

const PALETTE = {
  tray: "#1f1d1b",
  cream: "#F4EFE6",
  red: "#D94B32",
  redDeep: "#B73B25",
  amber: "#D49A43",
  fryLight: "#E6B35A",
  fryDark: "#CF9339",
  sleeve: "#F4EFE6",
};

/* ---------- Pièces ------------------------------------------------------ */

function Tray({ paper, shadows }: { paper: THREE.Texture; shadows: boolean }) {
  return (
    <group>
      <RoundedBox args={[3.9, 0.14, 2.7]} radius={0.05} smoothness={4} receiveShadow={shadows} castShadow={shadows}>
        <meshStandardMaterial color={PALETTE.tray} roughness={0.55} metalness={0.15} />
      </RoundedBox>
      {/* liseré ambré fin sur le bord */}
      <mesh position={[0, 0.072, 0]}>
        <boxGeometry args={[3.72, 0.004, 2.52]} />
        <meshStandardMaterial color={PALETTE.amber} roughness={0.4} metalness={0.4} />
      </mesh>
      {/* feuille de papier Gorbuz */}
      <mesh position={[0.05, 0.085, 0.03]} rotation={[0, -0.035, 0]} receiveShadow={shadows}>
        <boxGeometry args={[3.35, 0.02, 2.15]} />
        <meshStandardMaterial map={paper} roughness={0.92} />
      </mesh>
    </group>
  );
}

function Durum({ bread, paper, shadows }: { bread: THREE.Texture; paper: THREE.Texture; shadows: boolean }) {
  return (
    <group position={[-0.4, 0.43, -0.3]} rotation={[0.08, -0.5, Math.PI / 2 + 0.06]}>
      {/* corps roulé */}
      <mesh castShadow={shadows} receiveShadow={shadows}>
        <capsuleGeometry args={[0.31, 1.55, 10, 28]} />
        <meshStandardMaterial map={bread} color="#E3C59E" roughness={0.8} />
      </mesh>
      {/* marques de cuisson : fins anneaux plus foncés */}
      {[0.35, -0.1, -0.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.306, 0.012, 8, 40, Math.PI * 1.1]} />
          <meshStandardMaterial color="#A97744" roughness={0.9} />
        </mesh>
      ))}
      {/* manchette papier */}
      <mesh position={[0, -0.42, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.345, 0.345, 0.95, 40, 1, true, Math.PI * 0.62, Math.PI * 1.78]} />
        <meshStandardMaterial map={paper} side={THREE.DoubleSide} roughness={0.95} />
      </mesh>
      {/* bande rouge sur la manchette */}
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.12, 40, 1, true, Math.PI * 0.62, Math.PI * 1.78]} />
        <meshStandardMaterial color={PALETTE.red} side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Fries({ shadows }: { shadows: boolean }) {
  const fries = useMemo(() => {
    const out: { pos: [number, number, number]; rot: [number, number, number]; h: number; dark: boolean }[] = [];
    const n = 11;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.3;
      const r = 0.08 + (i % 3) * 0.075;
      const h = 1.05 + ((i * 37) % 10) * 0.045;
      out.push({
        pos: [Math.cos(a) * r, 0.78 + ((i * 13) % 5) * 0.03, Math.sin(a) * r],
        rot: [Math.sin(a) * 0.26, a * 0.5, -Math.cos(a) * 0.26],
        h,
        dark: i % 4 === 0,
      });
    }
    return out;
  }, []);

  return (
    <group position={[1.2, 0.08, -0.72]} rotation={[0, 0.35, 0]}>
      {/* cornet */}
      <mesh castShadow={shadows} receiveShadow={shadows} position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.44, 0.3, 0.84, 36, 1, false]} />
        <meshStandardMaterial color={PALETTE.red} roughness={0.55} />
      </mesh>
      {/* bande crème */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.447, 0.42, 0.13, 36, 1, true]} />
        <meshStandardMaterial color={PALETTE.cream} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* intérieur sombre */}
      <mesh position={[0, 0.78, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.41, 36]} />
        <meshStandardMaterial color="#5a3a1c" roughness={1} />
      </mesh>
      {fries.map((f, i) => (
        <RoundedBox
          key={i}
          args={[0.11, f.h, 0.11]}
          radius={0.025}
          smoothness={2}
          position={f.pos}
          rotation={f.rot}
          castShadow={shadows}
        >
          <meshStandardMaterial color={f.dark ? PALETTE.fryDark : PALETTE.fryLight} roughness={0.62} />
        </RoundedBox>
      ))}
    </group>
  );
}

function Kumpir({ skin, shadows }: { skin: THREE.Texture; shadows: boolean }) {
  const geo = useMemo(() => displaceSphere(new THREE.SphereGeometry(0.45, 48, 36), 0.05), []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <group position={[1.1, 0.37, 0.82]} rotation={[0.05, -0.5, 0.04]}>
      <mesh geometry={geo} scale={[1.28, 0.72, 0.88]} castShadow={shadows} receiveShadow={shadows}>
        <meshStandardMaterial map={skin} roughness={0.95} />
      </mesh>
      {/* ouverture garnie, neutre (aucun ingrédient précis) */}
      <mesh position={[0, 0.24, 0]} scale={[1.02, 0.42, 0.56]} castShadow={shadows}>
        <sphereGeometry args={[0.4, 36, 24]} />
        <meshStandardMaterial color={PALETTE.cream} roughness={0.65} />
      </mesh>
      <mesh position={[0.16, 0.38, 0.06]} scale={[1, 0.6, 1]}>
        <sphereGeometry args={[0.07, 20, 14]} />
        <meshStandardMaterial color={PALETTE.red} roughness={0.35} />
      </mesh>
      <mesh position={[-0.18, 0.37, -0.03]} scale={[1, 0.6, 1]}>
        <sphereGeometry args={[0.055, 20, 14]} />
        <meshStandardMaterial color={PALETTE.amber} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Details({ shadows }: { shadows: boolean }) {
  return (
    <group>
      {/* touches de sauce */}
      <mesh position={[0.25, 0.1, 0.95]} scale={[1, 0.35, 1]} castShadow={shadows}>
        <sphereGeometry args={[0.1, 24, 16]} />
        <meshStandardMaterial color={PALETTE.red} roughness={0.3} />
      </mesh>
      <mesh position={[-1.55, 0.1, -0.2]} scale={[1.2, 0.35, 1]} castShadow={shadows}>
        <sphereGeometry args={[0.08, 24, 16]} />
        <meshStandardMaterial color={PALETTE.amber} roughness={0.3} />
      </mesh>
      {/* ticket de comptoir */}
      <group position={[-1.3, 0.1, 0.78]} rotation={[0, 0.5, 0]}>
        <mesh castShadow={shadows}>
          <boxGeometry args={[0.62, 0.012, 0.34]} />
          <meshStandardMaterial color={PALETTE.cream} roughness={0.9} />
        </mesh>
        <mesh position={[-0.17, 0.008, 0]}>
          <boxGeometry args={[0.18, 0.004, 0.18]} />
          <meshStandardMaterial color={PALETTE.red} roughness={0.7} />
        </mesh>
        {[0.06, 0.13, 0.2].map((x, i) => (
          <mesh key={i} position={[x, 0.008, -0.08 + i * 0.07]}>
            <boxGeometry args={[0.2 - i * 0.04, 0.003, 0.018]} />
            <meshStandardMaterial color="#2a2825" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------- Animation --------------------------------------------------- */

function Composition({ pointer, scroll, reduced, lite, active }: HeroSceneProps) {
  const group = useRef<THREE.Group>(null);
  const intro = useRef(0);
  const paper = useMemo(() => makePaperTexture(), []);
  const bread = useMemo(() => makeBreadTexture(), []);
  const skin = useMemo(() => makePotatoTexture(), []);

  useEffect(
    () => () => {
      paper.dispose();
      bread.dispose();
      skin.dispose();
    },
    [paper, bread, skin],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    // entrée douce : scale 0.9 → 1, y -0.35 → 0
    intro.current = THREE.MathUtils.damp(intro.current, 1, 2.2, dt);
    const k = intro.current;
    const s = 0.9 + 0.1 * k;
    g.scale.setScalar(s);

    if (reduced) {
      g.rotation.set(0.02, -0.18, 0);
      g.position.set(0, -0.35 * (1 - k), 0);
      return;
    }

    const px = active ? pointer.current.x : 0;
    const py = active ? pointer.current.y : 0;
    const sc = scroll.current;

    const targetY = -0.18 + Math.sin(t * 0.22) * 0.16 + px * 0.22 - sc * 0.35;
    const targetX = 0.02 + Math.sin(t * 0.37) * 0.025 - py * 0.1 + sc * 0.12;
    const targetZ = Math.sin(t * 0.29) * 0.012 - sc * 0.06;

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 2.5, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 2.5, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetZ, 2.5, dt);

    const floatY = Math.sin(t * 0.8) * 0.045 + Math.sin(t * 1.9) * 0.012;
    g.position.y = -0.35 * (1 - k) + floatY - sc * 0.55;
    g.position.x = THREE.MathUtils.damp(g.position.x, px * 0.08, 2.5, dt);
  });

  const shadows = !lite;

  return (
    <group ref={group} position={[0, -0.35, 0]} scale={0.9}>
      <Tray paper={paper} shadows={shadows} />
      <Durum bread={bread} paper={paper} shadows={shadows} />
      <Fries shadows={shadows} />
      <Kumpir skin={skin} shadows={shadows} />
      <Details shadows={shadows} />
    </group>
  );
}

function Rig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    // recule la caméra sur les cadres étroits pour garder toute la composition visible
    const dist = 5.3 * THREE.MathUtils.clamp(1.25 / aspect, 1, 1.7);
    camera.position.set(0.2, 2.6, dist);
    camera.lookAt(0, 0.15, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Lights({ lite }: { lite: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} color="#fff1dc" />
      <hemisphereLight args={["#ffe9c9", "#3a2d22", 0.55]} />
      <directionalLight
        position={[3.2, 5.2, 2.6]}
        intensity={2.7}
        color="#ffd7a3"
        castShadow={!lite}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0006}
        shadow-normalBias={0.02}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-3.5}
        shadow-camera-near={1}
        shadow-camera-far={14}
      />
      <directionalLight position={[-3.5, 2.2, -1.2]} intensity={1.0} color="#e8b56d" />
      <pointLight position={[0.5, 1.6, -3.2]} intensity={9} distance={9} decay={2} color="#D94B32" />
    </>
  );
}

/* ---------- Canvas ------------------------------------------------------ */

export function HeroScene(props: HeroSceneProps) {
  const { reduced, lite, active, onReady } = props;
  const frameloop = reduced ? "demand" : active ? "always" : "never";

  return (
    <Canvas
      dpr={lite ? [1, 1] : [1, 1.5]}
      shadows={!lite}
      frameloop={frameloop}
      camera={{ fov: 30, near: 0.1, far: 50, position: [0.3, 2.5, 4.9] }}
      gl={{ antialias: true, alpha: true, powerPreference: lite ? "low-power" : "high-performance", stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
        gl.setClearColor(0x000000, 0);
        onReady?.();
      }}
      style={{ background: "transparent" }}
      aria-hidden="true"
      role="presentation"
    >
      <Rig />
      <Lights lite={lite} />
      <Composition {...props} />
      {!lite && (
        <ContactShadows position={[0, -0.47, 0]} opacity={0.6} scale={9} blur={2.6} far={3} resolution={512} color="#000" frames={reduced ? 1 : Infinity} />
      )}
    </Canvas>
  );
}
