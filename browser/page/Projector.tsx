import { CornerPinImage } from "../components/CornerPinImage.tsx";
import alignmentImage from "#assets/slides/0_alignment_ipad_2022_12inch_portrait.png";

import { useCornerControl } from "../hooks/useCornerControl.ts";
import { useProjectionBackground } from "../hooks/useProjectionBackground.ts";

export function Projector() {
  const { cornersViewport } = useCornerControl();
  const { backgroundColor } = useProjectionBackground();

  return (
    <CornerPinImage
      src={alignmentImage}
      corners={cornersViewport}
      srcWidth={1366}
      srcHeight={1024}
      backgroundColor={backgroundColor}
    />
  );
}
