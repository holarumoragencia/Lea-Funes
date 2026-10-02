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
const C = {
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
const GRADIENT = `linear-gradient(100deg, ${C.pink} 0%, ${C.pink} 22%, ${C.pinkSoft} 58%, ${C.cream} 100%)`;
const DISPLAY = "'Inter Tight', sans-serif";
const BODY = "'Inter', sans-serif";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// Entrada suave: sube, desenfoque → nítido
const useReveal = (delay: number, duration = 22) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, duration], [0, 1], { ...clamp, easing: easeOut });
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * 40}px)`,
    filter: `blur(${(1 - p) * 12}px)`,
  };
};

// Salida de escena: se desvanece y desenfoca
const SceneOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
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

const GradientText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
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
const Background: React.FC = () => {
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

const ProfileHeader: React.FC = () => {
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

// ---------- Escena 1: titular ----------
const Word: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const style = useReveal(delay, 20);
  return <span style={{ display: "inline-block", marginRight: "0.24em", ...style }}>{children}</span>;
};

const SceneTitle: React.FC = () => {
  const chip = useReveal(10);
  const sub = useReveal(48);
  const line1 = ["La", "franquicia", "en", "España"];
  return (
    <SceneOut at={86}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div
          style={{
            ...chip,
            fontFamily: BODY,
            fontWeight: 500,
            fontSize: 24,
            color: C.text,
            padding: "12px 26px",
            borderRadius: 999,
            border: `1px solid ${C.border}`,
            background: C.card,
            marginBottom: 40,
            letterSpacing: 0.3,
          }}
        >
          <span style={{ color: C.pink }}>●</span>&nbsp;&nbsp;Informe AEF · La Franquicia en España 2026
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 132, lineHeight: 1.02, letterSpacing: -4 }}>
          <div style={{ color: C.text }}>
            {line1.map((w, i) => (
              <Word key={w} delay={16 + i * 4}>
                {w}
              </Word>
            ))}
          </div>
          <div>
            <Word delay={34}>
              <GradientText>se consolida</GradientText>
            </Word>
          </div>
        </div>
        <div style={{ ...sub, fontFamily: BODY, fontSize: 34, color: C.muted, marginTop: 36 }}>
          Menos redes. Más negocio.
        </div>
      </AbsoluteFill>
    </SceneOut>
  );
};

// ---------- Escena 2: datos ----------
const fmt = (n: number, decimals: number) => n.toFixed(decimals).replace(".", ",");

const StatCard: React.FC<{
  delay: number;
  value: number;
  decimals: number;
  sign: "+" | "−";
  label: string;
  positive: boolean;
}> = ({ delay, value, decimals, sign, label, positive }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.9 } });
  const count = interpolate(frame - delay, [0, 28], [0, value], { ...clamp, easing: easeOut });
  const arrowY = Math.sin((frame - delay) / 8) * 4;
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${(1 - s) * 60}px) scale(${0.94 + s * 0.06})`,
        background: positive
          ? `linear-gradient(135deg, ${C.pink}14, rgba(255,255,255,0.025))`
          : C.card,
        border: `1px solid ${positive ? `${C.pink}40` : C.border}`,
        borderRadius: 36,
        padding: "34px 44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 210,
      }}
    >
      <div>
        <div style={{ fontFamily: BODY, fontSize: 26, color: C.muted, marginBottom: 6 }}>{label}</div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 128,
            lineHeight: 1,
            letterSpacing: -5,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {positive ? (
            <GradientText>
              {sign}
              {fmt(count, decimals)}%
            </GradientText>
          ) : (
            <span style={{ color: "rgba(246,231,214,0.42)" }}>
              {sign}
              {fmt(count, decimals)}%
            </span>
          )}
        </div>
      </div>
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: positive ? `${C.pink}22` : "rgba(255,255,255,0.05)",
          color: positive ? C.pink : "rgba(246,231,214,0.5)",
          fontSize: 40,
          fontFamily: DISPLAY,
          fontWeight: 700,
          transform: `translateY(${positive ? -arrowY : arrowY}px)`,
        }}
      >
        {positive ? "↑" : "↓"}
      </div>
    </div>
  );
};

const GroupLabel: React.FC<{ delay: number; children: React.ReactNode; accent: boolean }> = ({
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

const SceneStats: React.FC = () => {
  const title = useReveal(0);
  return (
    <SceneOut at={148}>
      <AbsoluteFill style={{ padding: "230px 120px 120px" }}>
        <div
          style={{
            ...title,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 64,
            color: C.text,
            letterSpacing: -2,
            marginBottom: 44,
          }}
        >
          Cierre 2025, <GradientText>en cuatro cifras</GradientText>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 40 }}>
          <div>
            <GroupLabel delay={8} accent>
              Crece lo cualitativo
            </GroupLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <StatCard delay={12} value={3} decimals={0} sign="+" label="Facturación" positive />
              <StatCard delay={22} value={1.4} decimals={1} sign="+" label="Empleo generado" positive />
            </div>
          </div>
          <div>
            <GroupLabel delay={62} accent={false}>
              Se ajusta lo cuantitativo
            </GroupLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <StatCard delay={66} value={6.5} decimals={1} sign="−" label="Número de redes" positive={false} />
              <StatCard delay={76} value={1} decimals={0} sign="−" label="Establecimientos abiertos" positive={false} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </SceneOut>
  );
};

// ---------- Escena 3: lectura ----------
const Pill: React.FC<{ delay: number; n: string; children: React.ReactNode }> = ({ delay, n, children }) => {
  const style = useReveal(delay, 18);
  return (
    <div
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "22px 30px",
        borderRadius: 24,
        background: C.card,
        border: `1px solid ${C.border}`,
        fontFamily: BODY,
        fontSize: 28,
        color: C.text,
      }}
    >
      <span style={{ fontFamily: DISPLAY, fontWeight: 700, color: C.pink, fontSize: 26 }}>{n}</span>
      {children}
    </div>
  );
};

const SceneInsight: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useReveal(0);
  const b = useReveal(10);
  const lbl = useReveal(30);
  const bottom = useReveal(78);
  // tachado animado sobre "crisis"
  const strike = interpolate(frame, [16, 32], [0, 100], { ...clamp, easing: easeOut });
  return (
    <SceneOut at={118}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 120, letterSpacing: -4, lineHeight: 1.05 }}>
          <span style={{ ...a, display: "inline-block", color: C.muted, position: "relative" }}>
            No es crisis.
            <span
              style={{
                position: "absolute",
                left: 0,
                top: "54%",
                height: 8,
                borderRadius: 4,
                width: `${strike}%`,
                background: C.pink,
              }}
            />
          </span>{" "}
          <span style={{ ...b, display: "inline-block" }}>
            <GradientText>Es madurez.</GradientText>
          </span>
        </div>
        <div
          style={{
            ...lbl,
            fontFamily: BODY,
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: C.muted,
            marginTop: 56,
            marginBottom: 22,
          }}
        >
          Una selección natural de redes
        </div>
        <div style={{ display: "flex", gap: 22 }}>
          <Pill delay={36} n="01">
            Salen enseñas pequeñas
          </Pill>
          <Pill delay={46} n="02">
            Marcas que dejan el modelo
          </Pill>
          <Pill delay={56} n="03">
            Fusiones y absorciones
          </Pill>
        </div>
        <div style={{ ...bottom, fontFamily: DISPLAY, fontWeight: 600, fontSize: 44, color: C.text, marginTop: 60 }}>
          Menos locales, <GradientText>más superficie y rentabilidad.</GradientText>
        </div>
      </AbsoluteFill>
    </SceneOut>
  );
};

// ---------- Escena 4: cierre ----------
const SceneClose: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useReveal(0, 24);
  const b = useReveal(12, 24);
  const line = interpolate(frame, [20, 50], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div style={{ ...a, fontFamily: DISPLAY, fontWeight: 800, fontSize: 112, letterSpacing: -4, lineHeight: 1.05, color: C.text }}>
        Ganan las redes
        <br />
        <GradientText>con modelo probado.</GradientText>
      </div>
      <div
        style={{
          width: 420 * line,
          height: 3,
          borderRadius: 2,
          background: GRADIENT,
          margin: "48px 0 34px",
        }}
      />
      <div style={{ ...b, fontFamily: BODY, fontSize: 30, color: C.muted }}>
        Facturación <span style={{ color: C.pink }}>+3%</span> · Empleo{" "}
        <span style={{ color: C.pink }}>+1,4%</span> · Redes −6,5% · Locales −1%
      </div>
    </AbsoluteFill>
  );
};

// ---------- Pie: fuente + progreso ----------
const Footer: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [10, 30], [0, 1], clamp);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 52,
          opacity: o,
          fontFamily: BODY,
          fontSize: 20,
          color: "rgba(244,239,234,0.4)",
        }}
      >
        Fuente: Asociación Española de la Franquicia (AEF) · «La Franquicia en España 2026»
      </div>
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
const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    document.fonts.ready.then(() => continueRender(handle));
  }, [handle]);
};

export const FranquiciaAEF: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill>
      <Background />
      <Sequence from={0} durationInFrames={100}>
        <SceneTitle />
      </Sequence>
      <Sequence from={96} durationInFrames={162}>
        <SceneStats />
      </Sequence>
      <Sequence from={256} durationInFrames={132}>
        <SceneInsight />
      </Sequence>
      <Sequence from={384} durationInFrames={66}>
        <SceneClose />
      </Sequence>
      <ProfileHeader />
      <Footer />
    </AbsoluteFill>
  );
};
