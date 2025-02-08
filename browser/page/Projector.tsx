import { useState, useEffect } from "react";
import { CornerPinImage } from "../components/CornerPinImage.tsx";
import alignmentImage from "#assets/projection/ipad_alignment_portrait.png";

// If you have a shared "Corners" type, import it:
import type { Corners } from "#types/cornerTypes.ts";

// Import the Socket.IO client instance
import { socket } from "../lib/socket.ts";

export function Projector() {
  // Local state for the corners
  // (Initialize to any default you'd like)
  const [corners, setCorners] = useState<Corners>({
    topLeft: { x: 30, y: 15 },
    topRight: { x: 90, y: 5 },
    bottomRight: { x: 90, y: 95 },
    bottomLeft: { x: 30, y: 95 },
  });

  useEffect(() => {
    // Handler for when server broadcasts new corners
    function handleCornersUpdate(newCorners: Corners) {
      setCorners(newCorners);
    }

    // Listen for "corners:update" events
    socket.on("corners:update", handleCornersUpdate);

    // Cleanup when unmounting
    return () => {
      socket.off("corners:update", handleCornersUpdate);
    };
  }, []);

  return (
    <CornerPinImage
      src={alignmentImage}
      corners={corners}
      srcWidth={1366}
      srcHeight={1024}
      backgroundColor="#8d8d8d"
    />
  );
}
