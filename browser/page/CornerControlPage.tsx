import { useEffect } from "react";
import styled from "@emotion/styled";
import {
  useCornerControl,
  CornerKey,
  PrecisionMode,
} from "../hooks/useCornerControl.ts";
import { useProjectionBackground } from "../hooks/useProjectionBackground.ts";
import { useProjectionOrientation } from "../hooks/useProjectionOrientation.ts";
import { ProjectionOrientation } from "#types/projectionTypes.ts";
import { Link } from "react-router-dom";
import { useProjectionKeystoneActive } from "../hooks/useProjectionKeystoneActive.ts";

// TODO: Factor out components into separate files.

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

const Dropdown = styled.select`
  padding: 0.5rem;
  border: 1px solid gray;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: border 0.2s ease;
  margin-top: 16px; /* Add margin to position it correctly */
  &:hover {
    border-color: black;
  }
`;

const DropdownOption = styled.option``;

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
    cornersViewport,
    selectedCornerUserPerspective,
    precision,
    handleCornerUserPerspectiveSelect,
    handlePrecisionSelect,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isDragging,
  } = useCornerControl();

  const { handleBackgroundColorToggle, handleBackgroundColorAligning } =
    useProjectionBackground();

  const { orientation, orientationOptions, handleOrientationSet } =
    useProjectionOrientation();

  const { keystoneActive, handleKeystoneActiveToggle } =
    useProjectionKeystoneActive();

  // Whenever isDragging changes, update the background aligning state.
  useEffect(() => {
    handleBackgroundColorAligning(isDragging);
  }, [isDragging, handleBackgroundColorAligning]);

  return (
    <Container>
      <h3>
        <Link to="/clicker">Clicker</Link>
      </h3>
      <h1>Corner Control</h1>

      {/* Corner selection */}
      <ButtonGroup>
        {(
          ["topLeft", "topRight", "bottomRight", "bottomLeft"] as CornerKey[]
        ).map((ck) => (
          <ButtonSwitch
            key={ck}
            selected={ck === selectedCornerUserPerspective}
            onClick={() => handleCornerUserPerspectiveSelect(ck)}
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
      <Button onClick={() => handleKeystoneActiveToggle()}>
        Toggle Keystone Active: {keystoneActive ? "On" : "Off"}
      </Button>
      <Dropdown
        value={orientation}
        onChange={(e) =>
          handleOrientationSet(e.target.value as ProjectionOrientation)
        }
      >
        {orientationOptions.map((mode) => (
          <DropdownOption key={mode} value={mode}>
            {mode}
          </DropdownOption>
        ))}
      </Dropdown>
      <p>
        Currently adjusting: <strong>{selectedCornerUserPerspective}</strong>
      </p>
      <p>
        Precision: <strong>{precision}</strong>
      </p>
      <p>Corners Viewport State:</p>
      <Preformatted>{JSON.stringify(cornersViewport, null, 2)}</Preformatted>
    </Container>
  );
}
