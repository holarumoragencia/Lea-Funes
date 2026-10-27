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

// ---------- Escena 1: titular ----------
const SceneTitle: React.FC = () => {
  const sub = useReveal(48);
  const line1 = ["La", "franquicia", "en", "España"];
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
