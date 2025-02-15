import { Link } from "react-router-dom";
import { useSlide } from "../hooks/useSlide.ts";
import styled from "@emotion/styled";
import { useProjectionBackground } from "../hooks/useProjectionBackground.ts";
import { useEffect } from "react";
import { useProjectionVisiblity } from "../hooks/useProjectionVisiblity.ts";

const FullScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  background-color: black;
  color: #838383;
  padding-bottom: 40px;
  padding-top: 20px;
`;

const LargeButton = styled.button`
  width: 80%;
  height: 40%;
  font-size: 2rem;
  margin: 10px 0;
  background-color: #333;
`;

const LargeButtonMain = styled(LargeButton)`
  height: 60%;
`;

const LargeButtonSecondary = styled(LargeButton)`
  height: 20%;
`;

const LinkMuted = styled(Link)`
  color: #838383;
`;

const ToggleText = styled.span`
  cursor: pointer;
`;

export function SlideClicker() {
  const { currentSlideIndex, totalSlides, handleGoNext, handleGoBack } =
    useSlide();
  const { handleBackgroundColorToggle } = useProjectionBackground();
  const { visible, handleVisibilityToggle } = useProjectionVisiblity();

  // Handle Keyboard Events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      /**
       * Left-Right Arrow to navigate between slides
       * */
      if (event.key === "ArrowRight") {
        handleGoNext();
      } else if (event.key === "ArrowLeft") {
        handleGoBack();
      }

      /**
       * Down Arrow to toggle Projection Visibility
       * */
      if (event.key === "ArrowDown") {
        handleVisibilityToggle();
      }
    };

    addEventListener("keydown", handleKeyDown);

    return () => {
      removeEventListener("keydown", handleKeyDown);
    };
  }, [handleGoNext, handleGoBack, handleVisibilityToggle]);

  return (
    <FullScreenContainer>
      <h3>
        <LinkMuted to="/control">Projection Align</LinkMuted> —{" "}
        <ToggleText onClick={() => handleBackgroundColorToggle()}>
          Toogle Background
        </ToggleText>
      </h3>
      <h2>
        {currentSlideIndex + 1} of {totalSlides}
      </h2>
      <LargeButtonSecondary
        onClick={handleVisibilityToggle}
        style={{ color: visible ? "blue" : "inherit" }}
      >
        {visible ? "ON" : "OFF"}
      </LargeButtonSecondary>
      <LargeButtonSecondary onClick={handleGoBack}>Back</LargeButtonSecondary>
      <LargeButtonMain onClick={handleGoNext}>Forward</LargeButtonMain>
    </FullScreenContainer>
  );
}
