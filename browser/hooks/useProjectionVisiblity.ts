import { useEffect, useState } from "react";
import socket from "../lib/socket.ts";
import { ProjectionVisible } from "#types/projectionTypes.ts";

// TODO: Persistance should be done via a context provider, higher order component, or similar.
/**
 * Makes sure that during re-mounting the component, but no new socket connection
 * that updates us, we keep the setting from the last component mounting.
 */
let rememberedVisebility: ProjectionVisible = true;

export function useProjectionVisiblity() {
  // The current visibility of the video projector.
  const [visible, setVisibility] = useState<ProjectionVisible>(
    rememberedVisebility,
  );

  useEffect(() => {
    const handleVisibility = (visibility: ProjectionVisible) => {
      setVisibility(visibility);
      rememberedVisebility = visibility;
    };
    socket.on("action:projection:visible:update", handleVisibility);

    return () => {
      socket.off("action:projection:visible:update", handleVisibility);
    };
  }, []);

  function handleVisibilitySet(visibility: ProjectionVisible) {
    setVisibility(visibility);
    rememberedVisebility = visibility;
    socket.emit("action:projection:visible:change", visibility);
  }

  const handleVisibilityToggle = () => {
    handleVisibilitySet(!visible);
  };

  return {
    /**
     * If the projection is active (visible) or not. Applies to all slides.
     */
    visible,
    /**
     * Toggle the visibility of the projection on and off.
     */
    handleVisibilityToggle,
    handleVisibilitySet,
  };
}
