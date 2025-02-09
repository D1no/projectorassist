import { CornerPinImage } from "../components/CornerPinImage.tsx";
import { useCornerControl } from "../hooks/useCornerControl.ts";
import { useProjectionBackground } from "../hooks/useProjectionBackground.ts";

import getSlide from "#lib/getSlide.ts";

export function Projector() {
  const { cornersViewport } = useCornerControl();
  const { backgroundColor } = useProjectionBackground();

  return (
    <CornerPinImage
      src={getSlide(0).urlRelative}
      corners={cornersViewport}
      srcWidth={1366}
      srcHeight={1024}
      backgroundColor={backgroundColor}
    />
  );
}
