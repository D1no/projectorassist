import { useEffect, useState } from "react";
import socket from "../lib/socket.ts";
import { ProjectionBackgroundColor } from "#types/projectionTypes.ts";

// TODO: Persistance should be done via a context provider, higher order component, or similar.
/**
 * Makes sure that during re-mounting the component, but no new socket connection
 * that updates us, we keep the setting from the last component mounting.
 */
let rememberedBackgroundColor: ProjectionBackgroundColor =
  ProjectionBackgroundColor.Invisible;
let rememberedPreviousColor: ProjectionBackgroundColor =
  ProjectionBackgroundColor.Invisible;

export function useProjectionBackground() {
  // The currently visible background color.
  const [backgroundColor, setBackgroundColor] = useState(
    rememberedBackgroundColor,
  );
  // Flag to know if we are in "aligning" mode.
  const [isAligning, setIsAligning] = useState(false);
  // The toggled background color (i.e. the color the user selected)
  // which is used to revert back after aligning is finished.
  const [previousColor, setPreviousColor] = useState(
    rememberedPreviousColor,
  );

  useEffect(() => {
    const handleBackgroundColor = (color: ProjectionBackgroundColor) => {
      setBackgroundColor(color);
      rememberedBackgroundColor = color;
    };
    socket.on("action:projection:background:update", handleBackgroundColor);

    return () => {
      socket.off("action:projection:background:update", handleBackgroundColor);
    };
  }, []);

  function handleBackgroundColorSet(color: ProjectionBackgroundColor) {
    setBackgroundColor(color);
    rememberedBackgroundColor = color;
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
      rememberedPreviousColor = toggledColor;
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
        rememberedPreviousColor = backgroundColor;
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

  /**
   * Turns a HEX color string into an rgb color string that is the negative of the HEX color.
   */
  function getInverseOfHEXColor(
    hexColor: ProjectionBackgroundColor | string,
    alpha: number = 1,
  ): string {
    const r = 255 - parseInt(hexColor.slice(1, 3), 16);
    const g = 255 - parseInt(hexColor.slice(3, 5), 16);
    const b = 255 - parseInt(hexColor.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b}, ${alpha})`;
  }

  return {
    backgroundColor,
    backgroundColorInverted: getInverseOfHEXColor(backgroundColor),
    handleBackgroundColorToggle,
    handleBackgroundColorAligning,
    getInverseOfHEXColor,
  };
}
