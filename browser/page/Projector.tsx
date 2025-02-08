import { CornerPinImage } from "../components/CornerPinImage.tsx";
import alignmentImage from "#assets/projection/ipad_alignment_portrait.png";

import { useCornerControl } from "../hooks/useCornerControl.ts";
import { useProjectionBackground } from "../hooks/useProjectionBackground.ts";

export function Projector() {
  const { corners } = useCornerControl();
  const { backgroundColor } = useProjectionBackground();

  return (
    <CornerPinImage
      src={alignmentImage}
      corners={corners}
      srcWidth={1366}
      srcHeight={1024}
      backgroundColor={backgroundColor}
    />
  );
}
