import styled from "@emotion/styled";
import { useSlide } from "../hooks/useSlide.ts";
import { useWindowSize } from "../hooks/useWindowSize.ts";
import { useProjectionBackground } from "../hooks/useProjectionBackground.ts";

// TODO: Very hacky quick and dirty.
// TODO: Hardcored positioning and dimensions.

interface ContainerProps {
  width: number;
  height: number;
}

const Container = styled.div<ContainerProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: none;
  z-index: 2;
  display: flex;
`;

interface HUDProps {
  insetMargin: number;
}

const HUD = styled.div<HUDProps>`
  position: relative;
  display: flex;
  justify-content: left;
  flex-grow: 1;
  padding: 20px 0px 20px 0px;
  margin-left: ${(props) => props.insetMargin}px;
`;

interface RotatedTextProps {
  textColor: string;
  bgColor: string;
}

const RotatedText = styled.div<RotatedTextProps>`
  display: flex;
  justify-content: right;
  align-items: center;
  rotate: -90deg;
  vertical-align: middle;
  font-weight: bold;
  font-family: "Arial";
  /**
  * Positioning
  */
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.textColor};
  height: 80px;
  width: 120px;
  padding-right: 10px;
  font-size: 40px;
  line-height: 0px;
  border-radius: 10px;
`;

interface ProjectionHUDProps {
  /**
   * Inset Margin in pixels
   */
  insetMargin?: number;
}

export function ProjectionHUD({ insetMargin = -20 }: ProjectionHUDProps) {
  const { currentSlideIndex, totalSlides } = useSlide();
  const { backgroundColor, backgroundColorInverted } =
    useProjectionBackground();
  const windowSize = useWindowSize();

  return (
    <Container width={windowSize.width} height={windowSize.height}>
      <HUD insetMargin={insetMargin}>
        <RotatedText
          textColor={backgroundColor}
          bgColor={backgroundColorInverted}
        >
          {currentSlideIndex}/{totalSlides - 1}
        </RotatedText>
      </HUD>
    </Container>
  );
}
