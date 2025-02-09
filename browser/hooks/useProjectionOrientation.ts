import { useEffect, useState } from "react";
import socket from "../lib/socket.ts";
import { ProjectionOrientation } from "#types/projectionTypes.ts";

// TODO: Persistance should be done via a context provider, higher order component, or similar.
/**
 * Makes sure that during re-mounting the component, but no new socket connection
 * that updates us, we keep the setting from the last component mounting.
 */
let rememberedOrientation: ProjectionOrientation =
  ProjectionOrientation.Landscape;

export function useProjectionOrientation() {
  // The current orientation of the video projector.
  const [orientation, setOrientation] = useState<ProjectionOrientation>(
    rememberedOrientation,
  );

  useEffect(() => {
    const handleOrientation = (orientation: ProjectionOrientation) => {
      setOrientation(orientation);
      rememberedOrientation = orientation;
    };
    socket.on("action:projection:orientation:update", handleOrientation);

    return () => {
      socket.off("action:projection:orientation:update", handleOrientation);
    };
  }, []);

  function handleOrientationSet(orientation: ProjectionOrientation) {
    setOrientation(orientation);
    rememberedOrientation = orientation;
    socket.emit("action:projection:orientation:change", orientation);
  }

  return {
    orientation,
    orientationOptions: Object.values(ProjectionOrientation),
    handleOrientationSet,
  };
}
