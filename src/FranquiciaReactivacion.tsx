import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Background,
  BODY,
  C,
  clamp,
  DISPLAY,
  easeOut,
  Footer,
  GRADIENT,
  GradientText,
  GroupLabel,
  ProfileHeader,
  SceneOut,
  useFonts,
  useReveal,
  Word,
} from "./shared";

// Formato español con punto de miles (también en números de 4 cifras: 1.328)
const fmt = (n: number, decimals = 0) => {
  const [int, dec] = n.toFixed(decimals).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec ? `${grouped},${dec}` : grouped;
};

// ---------- Escena 1: titular ----------
const SceneTitle: React.FC = () => {
  const sub = useReveal(48);
  const line1 = ["Septiembre", "y", "octubre"];
  return (
    <SceneOut at={86}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 132, lineHeight: 1.02, letterSpacing: -4 }}>
          <div style={{ color: C.text }}>
            {line1.map((w, i) => (
              <Word key={w} delay={16 + i * 4}>
                {w}
              </Word>
            ))}
          </div>
          <div>
            <Word delay={30}>
              <GradientText>reactivan la franquicia</GradientText>
            </Word>
          </div>
        </div>
        <div style={{ ...sub, fontFamily: BODY, fontSize: 34, color: C.muted, marginTop: 36 }}>
          Arranca la planificación de 2027.
        </div>
      </AbsoluteFill>
    </SceneOut>
  );
};

// ---------- Escena 2: el sector en cifras ----------
const StatCard: React.FC<{
  delay: number;
  value: number;
  suffix?: string;
  label: string;
  accent: boolean;
}> = ({ delay, value, suffix, label, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.9 } });
  const count = interpolate(frame - delay, [0, 30], [0, value], { ...clamp, easing: easeOut });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${(1 - s) * 60}px) scale(${0.94 + s * 0.06})`,
        background: accent ? `linear-gradient(135deg, ${C.pink}14, rgba(255,255,255,0.025))` : C.card,
        border: `1px solid ${accent ? `${C.pink}40` : C.border}`,
        borderRadius: 36,
        padding: "34px 44px",
        height: 210,
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontFamily: BODY, fontSize: 26, color: C.muted, marginBottom: 6 }}>{label}</div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 120,
          lineHeight: 1,
          letterSpacing: -5,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {accent ? (
          <GradientText>{fmt(Math.round(count))}</GradientText>
        ) : (
          <span style={{ color: C.cream }}>{fmt(Math.round(count))}</span>
        )}
        {suffix && (
          <span style={{ fontSize: 56, letterSpacing: -1, marginLeft: 16, color: C.pinkSoft }}>{suffix}</span>
        )}
      </div>
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
          La franquicia en España, <GradientText>hoy</GradientText>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 40 }}>
          <div>
            <GroupLabel delay={8} accent={false}>
              El tamaño de la red
            </GroupLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <StatCard delay={12} value={1328} label="Enseñas operando" accent={false} />
              <StatCard delay={22} value={92129} label="Establecimientos" accent={false} />
            </div>
          </div>
          <div>
            <GroupLabel delay={58} accent>
              Su impacto
            </GroupLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <StatCard delay={62} value={426897} label="Empleos generados" accent />
              <StatCard delay={72} value={38591} suffix="M€" label="Facturación conjunta" accent />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </SceneOut>
  );
};

// ---------- Escena 3: el crecimiento ----------
const SceneGrowth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 4, fps, config: { damping: 14, mass: 0.9 } });
  const count = interpolate(frame - 4, [0, 34], [0, 9.3], { ...clamp, easing: easeOut });
  const lbl = useReveal(22);
  const bottom = useReveal(64);
  const glow = 0.55 + Math.sin(frame / 10) * 0.15;
  return (
    <SceneOut at={118}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 520,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${C.pink}55 0%, transparent 65%)`,
            filter: "blur(60px)",
            opacity: glow * pop,
            top: 200,
          }}
        />
        <div
          style={{
            opacity: pop,
            transform: `scale(${0.85 + pop * 0.15})`,
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 300,
            lineHeight: 1,
            letterSpacing: -12,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <GradientText>+{fmt(count, 1)}%</GradientText>
        </div>
        <div style={{ ...lbl, fontFamily: DISPLAY, fontWeight: 600, fontSize: 52, color: C.text, marginTop: 48 }}>
          crecieron las unidades en el último ejercicio
        </div>
        <div style={{ ...bottom, fontFamily: BODY, fontSize: 32, color: C.muted, marginTop: 40 }}>
          La franquicia sigue siendo la vía para <span style={{ color: C.pinkSoft }}>ganar territorio</span>.
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
      <div
        style={{ ...a, fontFamily: DISPLAY, fontWeight: 800, fontSize: 112, letterSpacing: -4, lineHeight: 1.05, color: C.text }}
      >
        Las aperturas de 2027
        <br />
        <GradientText>se construyen hoy.</GradientText>
      </div>
      <div style={{ width: 420 * line, height: 3, borderRadius: 2, background: GRADIENT, margin: "48px 0 34px" }} />
      <div style={{ ...b, fontFamily: BODY, fontSize: 30, color: C.muted }}>
        1.328 enseñas · 92.129 locales · 426.897 empleos · 38.591 M€ ·{" "}
        <span style={{ color: C.pink }}>+9,3% unidades</span>
      </div>
    </AbsoluteFill>
  );
};

export const FranquiciaReactivacion: React.FC = () => {
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
        <SceneGrowth />
      </Sequence>
      <Sequence from={384} durationInFrames={66}>
        <SceneClose />
      </Sequence>
      <ProfileHeader />
      <Footer />
    </AbsoluteFill>
  );
};
