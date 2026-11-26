import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import spainTopo from "es-atlas/es/autonomous_regions.json";
import worldTopo from "world-atlas/countries-110m.json";
import { BODY, DISPLAY, clamp, easeOut, useFonts, useReveal } from "./shared";

// Versión clara y vertical (1080×1920) para alternar en el feed.
// Datos: AEF, «La Franquicia Española en el Mundo 2025» (con ICEX y Cajamar).

const L = {
  bg: "#F7F2EC",
  card: "#FFFFFF",
  border: "rgba(22,20,26,0.08)",
  ink: "#16141A",
  muted: "rgba(22,20,26,0.55)",
  faint: "rgba(22,20,26,0.12)",
  pink: "#FF3D8F",
  berry: "#B3195F",
  land: "#E6DED5",
};
const GRADIENT_L = `linear-gradient(100deg, ${L.berry} 0%, #E2287C 45%, ${L.pink} 75%, #FF7DB4 100%)`;

// La música va a ~117,5 BPM: un compás (4 tiempos) dura ~61 frames a 30 fps.
const BEAT = 15.32;
const BAR = BEAT * 4;
const at = (bars: number) => Math.round(bars * BAR);
const SCENES = [0, at(2), at(4), at(6), at(8), at(10)];
export const MUNDO_DURATION = at(11.5);

const GradientText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        backgroundImage: GRADIENT_L,
        backgroundSize: "200% 100%",
        backgroundPosition: `${50 + Math.sin(frame / 40) * 50}% 0`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
};

// Escena con leve acercamiento de cámara y salida con desenfoque
const Scene: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [dur - 10, dur], [0, 1], clamp);
  const push = interpolate(frame, [0, dur], [1, 1.035]);
  return (
    <AbsoluteFill
      style={{
        opacity: 1 - out,
        filter: `blur(${out * 14}px)`,
        transform: `scale(${push + out * 0.04})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const fmt = (n: number, decimals = 0) => {
  const [int, dec] = n.toFixed(decimals).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec ? `${grouped},${dec}` : grouped;
};

const useCount = (to: number, delay: number, duration = 30, decimals = 0) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame - delay, [0, duration], [0, to], { ...clamp, easing: easeOut });
  return fmt(decimals ? v : Math.round(v), decimals);
};

const Kicker: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const r = useReveal(delay, 18);
  return (
    <div
      style={{
        ...r,
        fontFamily: BODY,
        fontWeight: 500,
        fontSize: 30,
        letterSpacing: 4,
        textTransform: "uppercase",
        color: L.berry,
      }}
    >
      {children}
    </div>
  );
};

// ---------- Fondo claro vivo ----------
const LightBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  // pulso suave en cada compás
  const pulse = Math.exp(-((frame % BAR) / 18)) * 0.25;
  return (
    <AbsoluteFill style={{ backgroundColor: L.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          left: 300 + Math.sin(t * 0.5) * 120,
          top: -500 + Math.cos(t * 0.4) * 90,
          background: `radial-gradient(circle, ${L.pink}${Math.round((0.22 + pulse * 0.3) * 255)
            .toString(16)
            .padStart(2, "0")} 0%, transparent 62%)`,
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          left: -420 + Math.cos(t * 0.45) * 90,
          top: 1250 + Math.sin(t * 0.55) * 80,
          background: `radial-gradient(circle, ${L.berry}26 0%, transparent 62%)`,
          filter: "blur(30px)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${L.faint} 1px, transparent 1px), linear-gradient(90deg, ${L.faint} 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0 ${-frame * 0.5}px`,
          opacity: 0.35,
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Cabecera de perfil (versión clara) ----------
const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 2, fps, config: { damping: 18, mass: 0.8 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 70,
        right: 70,
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: s,
        transform: `translateY(${(1 - s) * -30}px)`,
      }}
    >
      <Img
        src={staticFile("avatar.png")}
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: `0 0 0 3px ${L.bg}, 0 0 0 5px ${L.pink}`,
        }}
      />
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, color: L.ink }}>Leandro Funes</span>
          <svg width={32} height={32} viewBox="0 0 24 24">
            <path
              fill="#1D9BF0"
              d="M12 1.5l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3-3.2-.1L12 22.5l-2.6-1.9-3.2.1-1-3-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3 3.2.1z"
            />
            <path d="M7.6 12.3l3 3 5.8-6" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Img src={staticFile("linkedin.png")} style={{ width: 30, height: 30, borderRadius: 6, marginLeft: 4 }} />
        </div>
        <div style={{ fontFamily: BODY, fontSize: 24, color: L.muted, marginTop: 4 }}>
          Director General en Aquí tu Reforma 🏠
        </div>
      </div>
    </div>
  );
};

// ---------- Escena 1: 1.144 redes, 314 fuera ----------
const COLS = 52;
const ROWS = 22; // 52 × 22 = 1.144 redes de origen nacional
const OUTSIDE = (() => {
  // selección pseudoaleatoria fija de 314 puntos
  const ids = Array.from({ length: COLS * ROWS }, (_, i) => i);
  let seed = 7;
  for (let i = ids.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return new Set(ids.slice(0, 314));
})();

const DotGrid: React.FC<{ appear: number; highlight: number }> = ({ appear, highlight }) => {
  const frame = useCurrentFrame();
  const gap = 17.6;
  const dots = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const a = interpolate(frame - appear - (c + r) * 0.5, [0, 8], [0, 1], clamp);
      const isOut = OUTSIDE.has(i);
      const h = interpolate(frame - highlight - (i % 37) * 0.35, [0, 10], [0, 1], clamp);
      dots.push(
        <circle
          key={i}
          cx={c * gap + gap / 2}
          cy={r * gap + gap / 2}
          r={isOut ? 5.2 + h * 1.6 : 5.2}
          fill={isOut && h > 0 ? L.pink : L.ink}
          opacity={a * (isOut ? 0.18 + h * 0.82 : 0.18 - h * 0.06)}
        />,
      );
    }
  }
  return (
    <svg width={COLS * gap} height={ROWS * gap}>
      {dots}
    </svg>
  );
};

const SceneHook: React.FC<{ dur: number }> = ({ dur }) => {
  const top = useReveal(4);
  const bottom = useReveal(Math.round(BEAT * 5));
  const total = useCount(1144, 6, 26);
  const out = useCount(314, Math.round(BEAT * 4), 24);
  return (
    <Scene dur={dur}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 80px" }}>
        <div style={{ ...top, fontFamily: DISPLAY, fontWeight: 700, fontSize: 66, lineHeight: 1.1, letterSpacing: -2, color: L.ink }}>
          De <span style={{ fontVariantNumeric: "tabular-nums" }}>{total}</span> redes de
          <br />
          franquicia españolas…
        </div>
        <div style={{ margin: "56px 0" }}>
          <DotGrid appear={10} highlight={Math.round(BEAT * 4)} />
        </div>
        <div style={{ ...bottom, fontFamily: DISPLAY, fontWeight: 800, fontSize: 104, lineHeight: 1.02, letterSpacing: -4 }}>
          <span style={{ color: L.ink }}>solo </span>
          <GradientText>{out}</GradientText>
          <br />
          <span style={{ color: L.ink }}>salen fuera.</span>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

// ---------- Escena 2: 27,4 % y +0,96 % ----------
const Bar: React.FC<{ delay: number; value: number; label: string; accent: boolean }> = ({ delay, value, label, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 15 } });
  const h = (value / 314) * 360 * s;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, color: accent ? L.berry : L.muted, opacity: s }}>
        {Math.round(value * s)}
      </div>
      <div
        style={{
          width: 150,
          height: h,
          borderRadius: 24,
          background: accent ? GRADIENT_L : "rgba(22,20,26,0.12)",
        }}
      />
      <div style={{ fontFamily: BODY, fontSize: 28, color: L.muted }}>{label}</div>
    </div>
  );
};

const SceneShare: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 2, fps, config: { damping: 14 } });
  const pct = useCount(27.4, 2, 28, 1);
  const lbl = useReveal(14);
  const card = useReveal(Math.round(BEAT * 3));
  const growth = useCount(0.96, Math.round(BEAT * 4), 24, 2);
  return (
    <Scene dur={dur}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 80px" }}>
        <div
          style={{
            opacity: pop,
            transform: `scale(${0.85 + pop * 0.15})`,
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 250,
            lineHeight: 1,
            letterSpacing: -10,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <GradientText>{pct}%</GradientText>
        </div>
        <div style={{ ...lbl, fontFamily: DISPLAY, fontWeight: 600, fontSize: 50, color: L.ink, marginTop: 10, lineHeight: 1.15 }}>
          de nuestras franquicias
          <br />
          opera en el exterior
        </div>
        <div
          style={{
            ...card,
            marginTop: 80,
            width: 860,
            padding: "48px 56px",
            borderRadius: 40,
            background: L.card,
            border: `1px solid ${L.border}`,
            boxShadow: "0 30px 60px -30px rgba(22,20,26,0.25)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: BODY, fontSize: 28, color: L.muted }}>Crecimiento en un año</div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 110, letterSpacing: -4, color: L.ink, lineHeight: 1.1 }}>
              +{growth}%
            </div>
            <div style={{ fontFamily: BODY, fontSize: 30, color: L.ink }}>Solo 3 redes más.</div>
          </div>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-end" }}>
            <Bar delay={Math.round(BEAT * 3.5)} value={311} label="2024" accent={false} />
            <Bar delay={Math.round(BEAT * 4)} value={314} label="2025" accent />
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

// ---------- Escena 3: mapa mundial ----------
const world = feature(
  worldTopo as unknown as Topology,
  (worldTopo as unknown as Topology).objects.countries,
) as unknown as FeatureCollection<Geometry, { name: string }>;

const MADRID: [number, number] = [-3.7, 40.4];
// Top 10 de destinos por número de redes (AEF 2025)
const DESTINATIONS: { name: string; geo: string; coord: [number, number]; redes: number }[] = [
  { name: "Portugal", geo: "Portugal", coord: [-9.1, 38.7], redes: 176 },
  { name: "México", geo: "Mexico", coord: [-99.1, 19.4], redes: 101 },
  { name: "Andorra", geo: "", coord: [1.5, 42.5], redes: 95 },
  { name: "Francia", geo: "France", coord: [2.35, 48.85], redes: 66 },
  { name: "Italia", geo: "Italy", coord: [12.5, 41.9], redes: 63 },
  { name: "Colombia", geo: "Colombia", coord: [-74.1, 4.7], redes: 54 },
  { name: "R. Dominicana", geo: "Dominican Rep.", coord: [-69.9, 18.5], redes: 42 },
  { name: "Chile", geo: "Chile", coord: [-70.6, -33.4], redes: 40 },
  { name: "EE. UU.", geo: "United States of America", coord: [-80.2, 25.8], redes: 40 },
  { name: "Guatemala", geo: "Guatemala", coord: [-90.5, 14.6], redes: 39 },
];
const MAP_W = 1080;
const MAP_H = 760;

const WorldMap: React.FC<{ arcsFrom: number }> = ({ arcsFrom }) => {
  const frame = useCurrentFrame();
  const { paths, arcs, origin } = useMemo(() => {
    const proj = geoMercator().center([-45, 18]).scale(330).translate([MAP_W / 2, MAP_H / 2]);
    const path = geoPath(proj);
    const highlighted = new Set(DESTINATIONS.map((d) => d.geo));
    const paths = world.features
      .filter((f) => f.properties.name !== "Antarctica")
      .map((f: Feature<Geometry, { name: string }>) => ({
        d: path(f) ?? "",
        name: f.properties.name,
        hl: highlighted.has(f.properties.name),
      }));
    const o = proj(MADRID)!;
    const arcs = DESTINATIONS.map((dst) => {
      const p = proj(dst.coord)!;
      const mx = (o[0] + p[0]) / 2;
      const my = (o[1] + p[1]) / 2;
      const dist = Math.hypot(p[0] - o[0], p[1] - o[1]);
      return { d: `M${o[0]},${o[1]} Q${mx},${my - dist * 0.35} ${p[0]},${p[1]}`, end: p, name: dst.name };
    });
    return { paths, arcs, origin: o };
  }, []);
  const landIn = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <svg
      width={MAP_W}
      height={MAP_H}
      style={{
        overflow: "hidden",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 80%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 80%, transparent 100%)",
      }}
    >
      {paths.map((p) => {
        const idx = DESTINATIONS.findIndex((d) => d.geo === p.name);
        const fillIn = idx >= 0 ? interpolate(frame - arcsFrom - idx * 4 - 14, [0, 10], [0, 1], clamp) : 0;
        return (
          <path
            key={p.name}
            d={p.d}
            fill={p.name === "Spain" ? L.berry : p.hl ? `rgba(255,61,143,${0.18 + fillIn * 0.5})` : L.land}
            opacity={landIn}
            stroke={L.bg}
            strokeWidth={0.8}
          />
        );
      })}
      {arcs.map((a, i) => {
        const p = interpolate(frame - arcsFrom - i * 4, [0, 18], [0, 1], { ...clamp, easing: easeOut });
        const dot = interpolate(frame - arcsFrom - i * 4 - 14, [0, 8], [0, 1], clamp);
        return (
          <g key={a.name}>
            <path
              d={a.d}
              fill="none"
              stroke={i === 1 ? L.pink : L.berry}
              strokeWidth={i === 1 ? 4 : 2.2}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              opacity={i === 1 ? 1 : 0.7}
            />
            <circle cx={a.end[0]} cy={a.end[1]} r={(i === 1 ? 9 : 6) * dot} fill={i === 1 ? L.pink : L.berry} />
          </g>
        );
      })}
      <circle cx={origin[0]} cy={origin[1]} r={10 + Math.sin(frame / 5) * 2} fill={L.berry} />
      <circle
        cx={origin[0]}
        cy={origin[1]}
        r={10 + ((frame % 30) / 30) * 30}
        fill="none"
        stroke={L.berry}
        opacity={1 - (frame % 30) / 30}
      />
    </svg>
  );
};

const RankRow: React.FC<{ delay: number; pos: number; name: string; redes: number; accent: boolean }> = ({
  delay,
  pos,
  name,
  redes,
  accent,
}) => {
  const r = useReveal(delay, 16);
  const n = useCount(redes, delay, 22);
  return (
    <div
      style={{
        ...r,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "24px 34px",
        borderRadius: 28,
        background: L.card,
        border: `1px solid ${accent ? `${L.pink}66` : L.border}`,
        boxShadow: accent ? `0 20px 50px -25px ${L.pink}` : "0 20px 40px -30px rgba(22,20,26,0.3)",
      }}
    >
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: accent ? L.pink : L.muted, width: 40 }}>{pos}</span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, color: L.ink, flex: 1 }}>{name}</span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, color: accent ? L.berry : L.ink, fontVariantNumeric: "tabular-nums" }}>
        {n}
      </span>
      <span style={{ fontFamily: BODY, fontSize: 26, color: L.muted }}>redes</span>
    </div>
  );
};

const SceneWorld: React.FC<{ dur: number }> = ({ dur }) => {
  const title = useReveal(0);
  const paises = useCount(139, 4, 24);
  const locales = useCount(18929, 4, 30);
  return (
    <Scene dur={dur}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
        <div style={{ ...title, textAlign: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 84, letterSpacing: -3, lineHeight: 1.05 }}>
          <GradientText>{paises}</GradientText> <span style={{ color: L.ink }}>países.</span>
          <br />
          <GradientText>{locales}</GradientText> <span style={{ color: L.ink }}>locales.</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <WorldMap arcsFrom={Math.round(BEAT)} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 900, marginTop: -20 }}>
          <RankRow delay={Math.round(BEAT * 3)} pos={1} name="Portugal" redes={176} accent={false} />
          <RankRow delay={Math.round(BEAT * 3.5)} pos={2} name="México" redes={101} accent />
          <RankRow delay={Math.round(BEAT * 4)} pos={3} name="Andorra" redes={95} accent={false} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

// ---------- Escena 4: España, Cataluña lidera ----------
const spain = feature(
  spainTopo as unknown as Topology,
  (spainTopo as unknown as Topology).objects.autonomous_regions,
) as unknown as FeatureCollection<Geometry, { name: string }>;
const EXCLUDE = ["Canarias", "Ciudad Autónoma de Ceuta", "Ciudad Autónoma de Melilla"];
const BARCELONA: [number, number] = [2.17, 41.39];

const SpainMap: React.FC<{ hl: number }> = ({ hl }) => {
  const frame = useCurrentFrame();
  const W = 900;
  const H = 700;
  const { regions, bcn } = useMemo(() => {
    const fc: FeatureCollection<Geometry, { name: string }> = {
      type: "FeatureCollection",
      features: spain.features.filter((f) => !EXCLUDE.includes(f.properties.name) && !f.properties.name.startsWith("Gibraltar")),
    };
    const proj = geoMercator().fitSize([W, H], fc);
    const path = geoPath(proj);
    return {
      regions: fc.features.map((f) => ({ d: path(f) ?? "", name: f.properties.name })),
      bcn: proj(BARCELONA)!,
    };
  }, []);
  const inP = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: easeOut });
  const cat = interpolate(frame - hl, [0, 12], [0, 1], clamp);
  return (
    <svg width={W} height={H} style={{ overflow: "visible", opacity: inP, transform: `translateY(${(1 - inP) * 40}px)` }}>
      {regions.map((r) => {
        const isCat = r.name.startsWith("Cataluña");
        const isMad = r.name === "Comunidad de Madrid";
        return (
          <path
            key={r.name}
            d={r.d}
            fill={isCat ? `rgba(255,61,143,${0.25 + cat * 0.75})` : isMad ? `rgba(179,25,95,${0.15 + cat * 0.35})` : L.land}
            stroke={L.bg}
            strokeWidth={2}
            style={{ transformOrigin: `${bcn[0]}px ${bcn[1]}px`, transform: isCat ? `scale(${1 + cat * 0.04})` : undefined }}
          />
        );
      })}
      <circle cx={bcn[0]} cy={bcn[1]} r={9 * cat} fill={L.ink} />
      <circle cx={bcn[0]} cy={bcn[1]} r={9 + ((frame % 30) / 30) * 34} fill="none" stroke={L.ink} opacity={cat * (1 - (frame % 30) / 30)} />
    </svg>
  );
};

const SceneSpain: React.FC<{ dur: number }> = ({ dur }) => {
  const k = useReveal(0);
  const title = useReveal(6);
  const c1 = useReveal(Math.round(BEAT * 3));
  const c2 = useReveal(Math.round(BEAT * 4));
  const cat = useCount(106, Math.round(BEAT * 3), 24);
  return (
    <Scene dur={dur}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300, textAlign: "center" }}>
        <div style={k}>
          <Kicker delay={0}>Quién sale más</Kicker>
        </div>
        <div style={{ ...title, fontFamily: DISPLAY, fontWeight: 800, fontSize: 96, letterSpacing: -4, lineHeight: 1.02, marginTop: 18 }}>
          <span style={{ color: L.ink }}>Cataluña</span>
          <br />
          <GradientText>lidera.</GradientText>
        </div>
        <div style={{ margin: "40px 0 30px" }}>
          <SpainMap hl={Math.round(BEAT * 2)} />
        </div>
        <div style={{ display: "flex", gap: 24, width: 920 }}>
          <div
            style={{
              ...c1,
              flex: 1.3,
              padding: "32px 36px",
              borderRadius: 32,
              background: L.card,
              border: `1px solid ${L.pink}66`,
              boxShadow: `0 24px 50px -28px ${L.pink}`,
              textAlign: "left",
            }}
          >
            <div style={{ fontFamily: BODY, fontSize: 26, color: L.muted }}>Cataluña</div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 96, letterSpacing: -4, lineHeight: 1.05 }}>
              <GradientText>{cat}</GradientText>
              <span style={{ fontSize: 44, color: L.muted, letterSpacing: -1 }}> / 320</span>
            </div>
            <div style={{ fontFamily: BODY, fontSize: 26, color: L.ink }}>centrales ya operan fuera</div>
          </div>
          <div
            style={{
              ...c2,
              flex: 1,
              padding: "32px 36px",
              borderRadius: 32,
              background: L.card,
              border: `1px solid ${L.border}`,
              textAlign: "left",
            }}
          >
            <div style={{ fontFamily: BODY, fontSize: 26, color: L.muted }}>Madrid</div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 96, letterSpacing: -4, lineHeight: 1.05, color: L.ink }}>
              90<span style={{ fontSize: 44, color: L.muted, letterSpacing: -1 }}> / 423</span>
            </div>
            <div style={{ fontFamily: BODY, fontSize: 26, color: L.ink }}>centrales fuera</div>
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

// ---------- Escena 5: Aquí tu Reforma, 9 países ----------
const SceneATR: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = useReveal(0);
  const title = useReveal(6);
  const bottom = useReveal(Math.round(BEAT * 5));
  const R = 250;
  const lit = Math.min(9, Math.max(0, Math.floor((frame - BEAT * 1.5) / (BEAT / 2)) + 1));
  return (
    <Scene dur={dur}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={k}>
          <Kicker delay={0}>Aquí tu Reforma</Kicker>
        </div>
        <div style={{ ...title, fontFamily: DISPLAY, fontWeight: 800, fontSize: 92, letterSpacing: -3, lineHeight: 1.05, marginTop: 18, color: L.ink }}>
          Catalana.
          <br />
          <GradientText>En 9 países.</GradientText>
        </div>
        <div style={{ position: "relative", width: R * 2 + 80, height: R * 2 + 80, margin: "50px 0" }}>
          {Array.from({ length: 9 }, (_, i) => {
            const ang = (i / 9) * Math.PI * 2 - Math.PI / 2;
            const s = spring({ frame: frame - BEAT * 1.5 - i * (BEAT / 2), fps, config: { damping: 12 } });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: R + 40 + Math.cos(ang) * R - 34,
                  top: R + 40 + Math.sin(ang) * R - 34,
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background: GRADIENT_L,
                  transform: `scale(${s})`,
                  boxShadow: `0 10px 30px -8px ${L.pink}`,
                }}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 220, letterSpacing: -8, lineHeight: 1, color: L.ink }}>{lit}</div>
            <div style={{ fontFamily: BODY, fontSize: 32, color: L.muted }}>países</div>
          </div>
        </div>
        <div style={{ ...bottom, fontFamily: DISPLAY, fontWeight: 600, fontSize: 52, color: L.ink }}>
          Donde pocas redes llegan.
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

// ---------- Escena 6: cierre ----------
const SceneClose: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useReveal(0, 22);
  const b = useReveal(Math.round(BEAT * 2), 22);
  const line = interpolate(frame, [10, 40], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 80px" }}>
      <div style={{ ...a, fontFamily: DISPLAY, fontWeight: 800, fontSize: 100, letterSpacing: -4, lineHeight: 1.05, color: L.ink }}>
        Salir fuera
        <br />
        no es copiar y pegar
        <br />
        <GradientText>la tienda.</GradientText>
      </div>
      <div style={{ width: 360 * line, height: 4, borderRadius: 2, background: GRADIENT_L, margin: "56px 0 44px" }} />
      <div style={{ ...b, fontFamily: DISPLAY, fontWeight: 700, fontSize: 64, color: L.berry }}>Seguimos.</div>
    </AbsoluteFill>
  );
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 222,
        height: 5,
        borderRadius: 3,
        background: "rgba(22,20,26,0.08)",
        overflow: "hidden",
      }}
    >
      <div style={{ width: `${(frame / durationInFrames) * 100}%`, height: "100%", background: GRADIENT_L }} />
    </div>
  );
};

export const FranquiciaMundo: React.FC = () => {
  useFonts();
  const { durationInFrames } = useVideoConfig();
  const comps = [SceneHook, SceneShare, SceneWorld, SceneSpain, SceneATR];
  return (
    <AbsoluteFill>
      <Audio
        src={staticFile("audio/future-minimal.mp3")}
        volume={(f) =>
          interpolate(f, [0, 8, durationInFrames - 36, durationInFrames - 2], [0, 0.9, 0.9, 0], clamp)
        }
      />
      <LightBackground />
      {comps.map((C, i) => {
        const dur = SCENES[i + 1] - SCENES[i] + 4;
        return (
          <Sequence key={i} from={SCENES[i]} durationInFrames={dur}>
            <C dur={dur} />
          </Sequence>
        );
      })}
      <Sequence from={SCENES[5]}>
        <SceneClose />
      </Sequence>
      <Header />
      <Progress />
    </AbsoluteFill>
  );
};
