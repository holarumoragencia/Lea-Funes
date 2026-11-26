import { Composition } from "remotion";
import { FranquiciaAEF } from "./FranquiciaAEF";
import { FranquiciaMundo, MUNDO_DURATION } from "./FranquiciaMundo";
import { FranquiciaReactivacion } from "./FranquiciaReactivacion";

const horizontal = { durationInFrames: 450, fps: 30, width: 1920, height: 1080 } as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="FranquiciaAEF" component={FranquiciaAEF} {...horizontal} />
    <Composition id="FranquiciaReactivacion" component={FranquiciaReactivacion} {...horizontal} />
    <Composition
      id="FranquiciaMundo"
      component={FranquiciaMundo}
      durationInFrames={MUNDO_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
