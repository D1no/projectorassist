import { useEffect, useState } from "react";
import socket from "../lib/socket.ts";
import { ProjectionOrientation } from "#types/projectionTypes.ts";

export function useProjectionOrientation() {
  // The current orientation of the video projector.
  const [orientation, setOrientation] = useState<ProjectionOrientation>(
    ProjectionOrientation.Landscape,
  );

  useEffect(() => {
    const handleOrientation = (orientation: ProjectionOrientation) => {
      setOrientation(orientation);
    };
    socket.on("action:projection:orientation:update", handleOrientation);

    return () => {
      socket.off("action:projection:orientation:update", handleOrientation);
    };
  }, []);

  function handleOrientationSet(orientation: ProjectionOrientation) {
    setOrientation(orientation);
    socket.emit("action:projection:orientation:change", orientation);
  }

  return {
    orientation,
    handleOrientationSet,
  };
}
