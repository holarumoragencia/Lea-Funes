import { Composition } from "remotion";
import { FranquiciaAEF } from "./FranquiciaAEF";
import { FranquiciaReactivacion } from "./FranquiciaReactivacion";

const common = { durationInFrames: 450, fps: 30, width: 1920, height: 1080 } as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="FranquiciaAEF" component={FranquiciaAEF} {...common} />
    <Composition id="FranquiciaReactivacion" component={FranquiciaReactivacion} {...common} />
  </>
);
