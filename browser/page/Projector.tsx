import { CornerPinImage } from "../components/CornerPinImage.tsx";
import { useCornerControl } from "../hooks/useCornerControl.ts";
import { useProjectionBackground } from "../hooks/useProjectionBackground.ts";
import { useProjectionVisiblity } from "../hooks/useProjectionVisiblity.ts";

import { useSlide } from "../hooks/useSlide.ts";

export function Projector() {
  const { cornersViewport } = useCornerControl();
  const { backgroundColor } = useProjectionBackground();
  const { visible } = useProjectionVisiblity();
  const { slide } = useSlide();

  return (
    <CornerPinImage
      src={slide}
      corners={cornersViewport}
      srcWidth={1366}
      srcHeight={1024}
      backgroundColor={backgroundColor}
      visible={visible}
    />
  );
}
