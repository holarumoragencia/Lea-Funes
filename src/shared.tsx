import "@fontsource/inter-tight/500.css";
import "@fontsource/inter-tight/600.css";
import "@fontsource/inter-tight/700.css";
import "@fontsource/inter-tight/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Paleta: noche + rosa (Lovable) degradando a crema
export const C = {
  bg: "#0C0C0E",
  card: "rgba(255,255,255,0.035)",
  border: "rgba(255,255,255,0.08)",
  pink: "#FF3D8F",
  pinkSoft: "#FF8DBE",
  cream: "#F6E7D6",
  text: "#F4EFEA",
  muted: "rgba(244,239,234,0.55)",
  verified: "#1D9BF0",
};
export const GRADIENT = `linear-gradient(100deg, ${C.pink} 0%, ${C.pink} 22%, ${C.pinkSoft} 58%, ${C.cream} 100%)`;
export const DISPLAY = "'Inter Tight', sans-serif";
export const BODY = "'Inter', sans-serif";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// Entrada suave: sube, desenfoque → nítido
export const useReveal = (delay: number, duration = 22) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, duration], [0, 1], { ...clamp, easing: easeOut });
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * 40}px)`,
    filter: `blur(${(1 - p) * 12}px)`,
  };
};

// Salida de escena: se desvanece y desenfoca
export const SceneOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill
      style={{ opacity: 1 - p, filter: `blur(${p * 16}px)`, transform: `scale(${1 + p * 0.04})` }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const GradientText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        backgroundImage: GRADIENT,
        backgroundSize: "200% 100%",
        backgroundPosition: `${50 + Math.sin(frame / 40) * 50}% 0`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// ---------- Fondo vivo ----------
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          left: 1100 + Math.sin(t * 0.6) * 120,
          top: -380 + Math.cos(t * 0.5) * 80,
          background: `radial-gradient(circle, ${C.pink}40 0%, transparent 62%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: -250 + Math.cos(t * 0.45) * 100,
          top: 520 + Math.sin(t * 0.55) * 70,
          background: `radial-gradient(circle, ${C.cream}1F 0%, transparent 62%)`,
          filter: "blur(40px)",
        }}
      />
      {/* retícula tech muy sutil */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: `0 ${-frame * 0.4}px`,
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Cabecera de perfil (arriba a la izquierda) ----------
const VerifiedBadge: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill={C.verified}
      d="M12 1.5l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3-3.2-.1L12 22.5l-2.6-1.9-3.2.1-1-3-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3 3.2.1z"
    />
    <path
      d="M7.6 12.3l3 3 5.8-6"
      fill="none"
      stroke="#fff"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ProfileHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 4, fps, config: { damping: 18, mass: 0.8 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 80,
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: s,
        transform: `translateX(${(1 - s) * -40}px)`,
      }}
    >
      <Img
        src={staticFile("avatar.png")}
        style={{
          width: 84,
          height: 84,
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: `0 0 0 2px ${C.bg}, 0 0 0 4px ${C.pink}88`,
        }}
      />
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: C.text }}>
            Leandro Funes
          </span>
          <VerifiedBadge size={28} />
          <Img src={staticFile("linkedin.png")} style={{ width: 26, height: 26, borderRadius: 5, marginLeft: 6 }} />
        </div>
        <div style={{ fontFamily: BODY, fontSize: 21, color: C.muted, marginTop: 4 }}>
          Director General en Aquí tu Reforma 🏠 · Startups · FP&A · Fundraising
        </div>
      </div>
    </div>
  );
};

// Palabra que entra con desenfoque
export const Word: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const style = useReveal(delay, 20);
  return <span style={{ display: "inline-block", marginRight: "0.24em", ...style }}>{children}</span>;
};

export const GroupLabel: React.FC<{ delay: number; children: React.ReactNode; accent: boolean }> = ({
  delay,
  children,
  accent,
}) => {
  const style = useReveal(delay, 18);
  return (
    <div
      style={{
        ...style,
        fontFamily: BODY,
        fontWeight: 500,
        fontSize: 22,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: accent ? C.pinkSoft : C.muted,
        marginBottom: 18,
      }}
    >
      {children}
    </div>
  );
};

// ---------- Pie: barra de progreso ----------
export const Footer: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [10, 30], [0, 1], clamp);
  return (
    <>
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 58,
          width: 260,
          height: 4,
          borderRadius: 2,
          background: "rgba(255,255,255,0.08)",
          opacity: o,
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${(frame / durationInFrames) * 100}%`, height: "100%", background: GRADIENT }} />
      </div>
    </>
  );
};

// Espera a que carguen las fuentes antes de renderizar
export const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    document.fonts.ready.then(() => continueRender(handle));
  }, [handle]);
};
