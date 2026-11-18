"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * SIGNATURE 3D — « l’Anneau Nova »
 * Un anneau de chrome liquide : tore déformé en temps réel (bruit simplex
 * injecté dans un MeshPhysicalMaterial), reflets d’un studio photo virtuel
 * (softboxes blanches + une bande orange Nova), rotation lente, réaction au
 * curseur et fonte progressive au défilement.
 *
 * Performance :
 * - Three.js est chargé à la demande (import dynamique) ;
 * - géométrie allégée et pixel ratio plafonné sur mobile ;
 * - rendu suspendu hors écran et onglet masqué ;
 * - mouvement réduit ou WebGL absent : image fixe pré-rendue.
 */

type Props = {
  className?: string;
  /** Image de remplacement (mouvement réduit, WebGL indisponible, appareils modestes). */
  poster?: string;
  posterAlt?: string;
  /** Élément dont le défilement pilote la transformation (par défaut : le parent). */
  scrollContainer?: React.RefObject<HTMLElement | null>;
  /** Précharger l’image de remplacement (sculpture au-dessus de la ligne de flottaison). */
  priority?: boolean;
};

const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uMelt;
uniform vec3 uPointer;
vec3 novaDisplace(vec3 p, vec3 n){
  float t = uTime * 0.16;
  // ondulation de l’anneau, comme un métal en fusion qui respire
  float ang = atan(p.y, p.x);
  vec3 q = p;
  q.z += sin(ang * 3.0 + t * 2.2) * (0.16 + uMelt * 0.25);
  q.xy *= 1.0 + sin(ang * 2.0 - t * 1.6) * 0.045;
  q.z += sin(ang * 5.0 - t * 1.4) * 0.035;
  float n1 = snoise(p * uFreq + vec3(t, t * 0.6, -t * 0.4));
  float n2 = snoise(p * uFreq * 2.3 - vec3(t * 1.2)) * 0.32;
  // le curseur « pousse » la matière
  float d = distance(p, uPointer);
  float push = smoothstep(1.3, 0.0, d) * 0.16;
  return q + n * ((n1 + n2) * (uAmp + uMelt * 0.12) + push);
}
`;

export function Sculpture({ className, poster, posterAlt = "", scrollContainer, priority }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "live" | "static">("idle");

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 768;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lowEnd = nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory < 3) || (navigator.hardwareConcurrency ?? 8) < 4;

    // WebGL disponible et accéléré par un vrai GPU ? Le rendu logiciel
    // (SwiftShader, llvmpipe…) est trop lent : on garde l’image fixe.
    const forceGl = window.location.search.includes("force-gl");
    const gpu = (() => {
      try {
        const c = document.createElement("canvas");
        const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
        if (!gl) return { ok: false, software: false };
        const info = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return { ok: true, software: /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer) };
      } catch {
        return { ok: false, software: false };
      }
    })();

    if (!gpu.ok || ((lowEnd || gpu.software) && !forceGl)) {
      Promise.resolve().then(() => setState("static"));
      return;
    }

    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: "high-performance" });
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      let dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
      renderer.setPixelRatio(dpr);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0, 7.2);

      // Studio virtuel pour les reflets : softboxes + une bande Nova.
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0x050505);
      // Dôme en dégradé : donne au chrome une gamme de gris (sol sombre, ciel gris perle).
      {
        const dome = new THREE.SphereGeometry(30, 32, 16);
        const colors: number[] = [];
        const pos = dome.attributes.position;
        const top = new THREE.Color(0xc4c8ce);
        const mid = new THREE.Color(0x45474b);
        const bottom = new THREE.Color(0x070707);
        const c = new THREE.Color();
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i) / 30;
          if (y > 0) c.copy(mid).lerp(top, Math.pow(y, 0.8));
          else c.copy(mid).lerp(bottom, Math.min(1, -y * 1.6));
          colors.push(c.r, c.g, c.b);
        }
        dome.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        envScene.add(new THREE.Mesh(dome, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
      }
      const strip = (w: number, h: number, color: number, intensity: number, pos: [number, number, number], rot: [number, number, number]) => {
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }),
        );
        m.position.set(...pos);
        m.rotation.set(...rot);
        envScene.add(m);
      };
      strip(14, 3, 0xffffff, 2.6, [0, 6, 0], [Math.PI / 2, 0, 0]); // plafond
      strip(1.2, 9, 0xffffff, 3.2, [-6, 0.5, 1], [0, Math.PI / 2, 0]); // bande gauche
      strip(0.6, 9, 0xe8eef5, 1.8, [6, 0, -1], [0, -Math.PI / 2, 0]); // bande droite froide
      strip(9, 0.7, 0xff4f17, 6.5, [0, -3.2, -5], [0, 0, 0]); // bande Nova basse
      strip(3, 3, 0xffffff, 0.9, [2.5, 2.5, 6], [0, Math.PI, 0]); // face
      strip(0.25, 6, 0xff4f17, 2.5, [5, 2, 4], [0, -Math.PI / 3, 0]); // filet orange
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(envScene, 0.03).texture;
      scene.environment = envTex;

      const radial = small ? 72 : 140;
      const tubular = small ? 220 : 420;
      const geometry = new THREE.TorusGeometry(1.2, 0.36, radial, tubular);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xe9eaec,
        metalness: 1,
        roughness: 0.09,
        envMapIntensity: 1.35,
        clearcoat: small ? 0 : 0.7,
        clearcoatRoughness: 0.08,
      });

      const uniforms = {
        uTime: { value: 0 },
        uAmp: { value: 0.045 },
        uFreq: { value: 1.05 },
        uMelt: { value: 0 },
        uPointer: { value: new THREE.Vector3(9, 9, 9) },
      };

      material.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = shader.vertexShader
          .replace("#include <common>", `#include <common>\n${NOISE_GLSL}`)
          .replace(
            "#include <beginnormal_vertex>",
            /* glsl */ `
            vec3 nBase = normalize(normal);
            vec3 upRef = abs(nBase.y) > 0.98 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
            vec3 tA = normalize(cross(nBase, upRef));
            vec3 tB = normalize(cross(nBase, tA));
            float eps = 0.012;
            vec3 dP = novaDisplace(position, nBase);
            vec3 dA = novaDisplace(position + tA * eps, nBase);
            vec3 dB = novaDisplace(position + tB * eps, nBase);
            vec3 objectNormal = normalize(cross(dA - dP, dB - dP));
            if (dot(objectNormal, nBase) < 0.0) objectNormal = -objectNormal;
            #ifdef USE_TANGENT
              vec3 objectTangent = vec3(tangent.xyz);
            #endif
            `,
          )
          .replace("#include <begin_vertex>", "vec3 transformed = dP;");
      };

      const mesh = new THREE.Mesh(geometry, material);
      const group = new THREE.Group();
      group.add(mesh);
      scene.add(group);
      mesh.rotation.set(1.12, 0.32, 0);
      group.rotation.order = "YXZ";

      // Dimensionnement
      const resize = () => {
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // garde l’anneau entier sur les écrans étroits
        camera.position.z = w / h < 0.8 ? 9.6 : w / h < 1.2 ? 8.2 : 7.2;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);

      // Curseur
      const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: 0, tActive: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
        pointer.tActive = 1;
      };
      const onLeave = () => (pointer.tActive = 0);
      if (!coarse) {
        window.addEventListener("pointermove", onPointer, { passive: true });
        document.addEventListener("pointerleave", onLeave);
      }

      // Défilement : progression 0 → 1 pendant que le conteneur sort de l’écran
      const scrollEl = scrollContainer?.current ?? wrap.parentElement ?? wrap;
      let scrollP = 0;
      const onScroll = () => {
        const r = scrollEl.getBoundingClientRect();
        scrollP = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      // Visibilité
      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) loop();
      });
      io.observe(wrap);
      const onVis = () => {
        if (!document.hidden) loop();
      };
      document.addEventListener("visibilitychange", onVis);

      const clock = new THREE.Clock();
      let raf = 0;
      let running = false;
      let smoothScroll = 0;
      let slowFrames = 0;
      const tmp = new THREE.Vector3();

      const render = (dt: number, t: number) => {
        pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
        pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
        pointer.active += (pointer.tActive - pointer.active) * Math.min(1, dt * 2);
        smoothScroll += (scrollP - smoothScroll) * Math.min(1, dt * 5);

        uniforms.uTime.value = t;
        uniforms.uMelt.value = smoothScroll;
        uniforms.uAmp.value = 0.045 + smoothScroll * 0.08;

        group.rotation.y = pointer.x * 0.35 * pointer.active + Math.sin(t * 0.15) * 0.12;
        group.rotation.x = -pointer.y * 0.25 * pointer.active + smoothScroll * 1.1;
        mesh.rotation.z = t * 0.12;
        group.position.y = smoothScroll * 1.4;
        const s = 1 + smoothScroll * 0.22;
        group.scale.setScalar(s);

        // position du curseur projetée dans l’espace de l’objet
        tmp.set(pointer.x * 2.2, pointer.y * 1.6, 0.6);
        mesh.worldToLocal(tmp);
        uniforms.uPointer.value.lerp(pointer.active > 0.05 ? tmp : new THREE.Vector3(9, 9, 9), Math.min(1, dt * 4));

        renderer.render(scene, camera);
      };

      const loop = () => {
        if (running || disposed) return;
        running = true;
        const tick = () => {
          if (!visible || document.hidden || disposed) {
            running = false;
            return;
          }
          const dt = Math.min(clock.getDelta(), 0.05);
          // dégradation automatique si l’appareil peine
          if (dt > 0.03) slowFrames++;
          else slowFrames = Math.max(0, slowFrames - 1);
          if (slowFrames > 45 && dpr > 1) {
            dpr = Math.max(1, dpr - 0.25);
            renderer.setPixelRatio(dpr);
            resize();
            slowFrames = 0;
          }
          render(dt, clock.elapsedTime);
          raf = requestAnimationFrame(tick);
        };
        clock.getDelta();
        raf = requestAnimationFrame(tick);
      };

      if (reduced) {
        render(0.016, 6);
        setState("live");
      } else {
        render(0.016, 0);
        setState("live");
        loop();
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVis);
        geometry.dispose();
        material.dispose();
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    }).catch(() => setState("static"));

    return () => {
      disposed = true;
      cleanup();
    };
  }, [scrollContainer]);

  return (
    <div ref={wrapRef} className={className} aria-hidden={posterAlt ? undefined : true}>
      {poster ? (
        <Image
          src={poster}
          alt={posterAlt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className={cn(
            "object-contain transition-opacity duration-700",
            // Visible dès le HTML (LCP rapide) ; s’efface quand le rendu temps réel prend le relais.
            state === "live" ? "opacity-0" : "opacity-100",
          )}
        />
      ) : null}
      <canvas
        ref={canvasRef}
        className={cn("absolute inset-0 h-full w-full transition-opacity duration-[1400ms]", state === "live" ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
