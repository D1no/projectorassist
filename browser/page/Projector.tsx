import { CornerPinImage } from "../components/CornerPinImage.tsx";
import alignmentImage from "#assets/projection/ipad_alignment_portrait.png";

import { useCornerControl } from "../hooks/useCornerControl.ts";

export function Projector() {
  const { corners } = useCornerControl();

  return (
    <CornerPinImage
      src={alignmentImage}
      corners={corners}
      srcWidth={1366}
      srcHeight={1024}
      backgroundColor="#8d8d8d"
    />
  );
}
