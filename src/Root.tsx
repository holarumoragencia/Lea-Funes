import { Composition } from "remotion";
import { FranquiciaAEF } from "./FranquiciaAEF";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="FranquiciaAEF"
    component={FranquiciaAEF}
    durationInFrames={450}
    fps={30}
    width={1920}
    height={1080}
  />
);
