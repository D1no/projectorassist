import { useEffect, useState } from "react";
import socket from "../lib/socket.ts";
import { ProjectionBackgroundColor } from "#types/projectionTypes.ts";

export function useProjectionBackground() {
  // The currently visible background color.
  const [backgroundColor, setBackgroundColor] = useState(
    ProjectionBackgroundColor.Invisible,
  );
  // Flag to know if we are in "aligning" mode.
  const [isAligning, setIsAligning] = useState(false);
  // The toggled background color (i.e. the color the user selected)
  // which is used to revert back after aligning is finished.
  const [previousColor, setPreviousColor] = useState(
    ProjectionBackgroundColor.Invisible,
  );

  useEffect(() => {
    const handleBackgroundColor = (color: string) => {
      setBackgroundColor(color as ProjectionBackgroundColor);
    };
    socket.on("action:projection:background:update", handleBackgroundColor);

    return () => {
      socket.off("action:projection:background:update", handleBackgroundColor);
    };
  }, []);

  function handleBackgroundColorSet(color: ProjectionBackgroundColor) {
    setBackgroundColor(color);
    socket.emit("action:projection:background:change", color);
  }

  function handleBackgroundColorToggle() {
    // Determine what the toggled color should be.
    const toggledColor = backgroundColor === ProjectionBackgroundColor.Invisible
      ? ProjectionBackgroundColor.Visible
      : ProjectionBackgroundColor.Invisible;

    if (isAligning) {
      // While aligning, update the saved toggled color
      // but leave the displayed color as .align.
      setPreviousColor(toggledColor);
      // Optionally, notify the server of the desired toggled color.
      socket.emit("action:projection:background:change", toggledColor);
    } else {
      handleBackgroundColorSet(toggledColor);
    }
  }

  /**
   * Sets or reverts the "aligning" mode.
   * When aligning is enabled (true), the background color changes to `align`.
   * When aligning is disabled (false), the background reverts to the previous toggled color.
   *
   * This function is intended to be called by components such as your touchpad while dragging.
   */
  function handleBackgroundColorAligning(aligning: boolean) {
    if (aligning) {
      // If not already in aligning mode, store the current color and switch to align.
      if (!isAligning) {
        setIsAligning(true);
        setPreviousColor(backgroundColor);
        handleBackgroundColorSet(ProjectionBackgroundColor.Align);
      }
    } else {
      // Exiting aligning mode: revert to the previously stored toggled color.
      if (isAligning) {
        setIsAligning(false);
        handleBackgroundColorSet(previousColor);
      }
    }
  }

  return {
    backgroundColor,
    handleBackgroundColorToggle,
    handleBackgroundColorAligning,
  };
}
