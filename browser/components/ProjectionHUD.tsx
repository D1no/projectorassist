import styled from "@emotion/styled";
import { useSlide } from "../hooks/useSlide.ts";
import { useWindowSize } from "../hooks/useWindowSize.ts";

// TODO: Very hacky quick and dirty.

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
  height: 100%;
  overflow: hidden;
  color: #000000;
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
  align-items: center;
  flex-grow: 1;
  margin: ${(props) => props.insetMargin}px;
`;

const RotatedText = styled.div`
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
  background-color: rgba(255, 255, 255, 0.5);
  height: 200px;
  width: 300px;
  font-size: 100px;
  padding-right: 20px;
  border-radius: 20px;
`;

interface ProjectionHUDProps {
  /**
   * Inset Margin in pixels
   */
  insetMargin?: number;
}

export function ProjectionHUD({ insetMargin = 20 }: ProjectionHUDProps) {
  const { currentSlideIndex, totalSlides } = useSlide();
  const windowSize = useWindowSize();

  return (
    <Container width={windowSize.width} height={windowSize.height}>
      <HUD insetMargin={insetMargin}>
        <RotatedText>
          {currentSlideIndex + 1}/{totalSlides}
        </RotatedText>
      </HUD>
    </Container>
  );
}
