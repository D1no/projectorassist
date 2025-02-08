import { useEffect } from "react";
import styled from "@emotion/styled";
import {
  useCornerControl,
  CornerKey,
  PrecisionMode,
} from "../hooks/useCornerControl.ts";
import { useProjectionBackground } from "../hooks/useProjectionBackground.ts";

/* Styled Components */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  cursor: pointer;
  transition: border 0.2s ease;
`;

interface StyledButtonProps {
  selected: boolean;
}

const ButtonSwitch = styled(Button)<StyledButtonProps>`
  border: ${({ selected }) => (selected ? "2px solid blue" : "1px solid gray")};
  &:hover {
    border-color: ${({ selected }) => (selected ? "darkblue" : "black")};
  }
`;

const Touchpad = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  user-select: none;
`;

const Preformatted = styled.pre`
  font-size: 12px;
`;

/* Component */

export function CornerControlPage() {
  const {
    corners,
    selectedCorner,
    precision,
    handleCornerSelect,
    handlePrecisionSelect,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isDragging,
  } = useCornerControl();

  const { handleBackgroundColorToggle, handleBackgroundColorAligning } =
    useProjectionBackground();

  // Whenever isDragging changes, update the background aligning state.
  useEffect(() => {
    handleBackgroundColorAligning(isDragging);
  }, [isDragging, handleBackgroundColorAligning]);

  return (
    <Container>
      <h1>Corner Control</h1>

      {/* Corner selection */}
      <ButtonGroup>
        {(
          ["topLeft", "topRight", "bottomRight", "bottomLeft"] as CornerKey[]
        ).map((ck) => (
          <ButtonSwitch
            key={ck}
            selected={ck === selectedCorner}
            onClick={() => handleCornerSelect(ck)}
          >
            {ck}
          </ButtonSwitch>
        ))}
      </ButtonGroup>

      {/* Touchpad */}
      <Touchpad
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        Drag here
      </Touchpad>

      {/* Precision selection */}
      <ButtonGroup>
        {(["full", "quarter", "detail"] as PrecisionMode[]).map((mode) => (
          <ButtonSwitch
            key={mode}
            selected={mode === precision}
            onClick={() => handlePrecisionSelect(mode)}
          >
            {mode}
          </ButtonSwitch>
        ))}
      </ButtonGroup>
      <Button onClick={() => handleBackgroundColorToggle()}>
        Toggle Background Color
      </Button>
      <p>
        Currently adjusting: <strong>{selectedCorner}</strong>
      </p>
      <p>
        Precision: <strong>{precision}</strong>
      </p>
      <p>Corners state:</p>
      <Preformatted>{JSON.stringify(corners, null, 2)}</Preformatted>
    </Container>
  );
}
