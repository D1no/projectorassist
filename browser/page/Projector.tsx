import { CornerPinImage } from "../components/CornerPinImage.tsx";
import { ProjectionHUD } from "../components/ProjectionHUD.tsx";
import { useCornerControl } from "../hooks/useCornerControl.ts";
import { useProjectionBackground } from "../hooks/useProjectionBackground.ts";
import { useProjectionKeystoneActive } from "../hooks/useProjectionKeystoneActive.ts";
import { useProjectionVisiblity } from "../hooks/useProjectionVisiblity.ts";

import { useSlide } from "../hooks/useSlide.ts";

// TODO: Currenty hardcoded dimensions. Should by dynamic.
/**
 * Width of the images in the slides directory (landscaped).
 */
export const slideWidth = 1366;
/**
 * Height of the images in the slides directory (landscaped).
 */
export const slideHeight = 1024;

export function Projector() {
  const { cornersViewport } = useCornerControl();
  const { backgroundColor } = useProjectionBackground();
  const { visible } = useProjectionVisiblity();
  const { slide } = useSlide();
  const { keystoneActive } = useProjectionKeystoneActive();

  return (
    <>
      {/** TODO: HUD needs to be re-implemented */}
      {visible && <ProjectionHUD />}

      {/* The Keystoned Projection */}
      <CornerPinImage
        src={slide}
        corners={cornersViewport}
        srcWidth={slideWidth}
        srcHeight={slideHeight}
        backgroundColor={backgroundColor}
        visible={visible}
        keystoneActive={keystoneActive}
      />
    </>
  );
}
