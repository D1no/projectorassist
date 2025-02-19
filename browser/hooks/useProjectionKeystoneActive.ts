import { useEffect, useState } from "react";
import socket from "../lib/socket.ts";
import { ProjectionKeystoneActive } from "#types/projectionTypes.ts";

// TODO: Persistance should be done via a context provider, higher order component, or similar.
/**
 * Makes sure that during re-mounting the component, but no new socket connection
 * that updates us, we keep the setting from the last component mounting.
 */
let rememberedKeystoneActive: ProjectionKeystoneActive = true;

export function useProjectionKeystoneActive() {
  // The current active state of the keystone.
  const [keystoneActive, setKeystoneActive] = useState<
    ProjectionKeystoneActive
  >(
    rememberedKeystoneActive,
  );

  useEffect(() => {
    const handleVisibility = (keystoneActive: ProjectionKeystoneActive) => {
      setKeystoneActive(keystoneActive);
      rememberedKeystoneActive = keystoneActive;
    };
    socket.on("action:projection:keystone:update", handleVisibility);

    return () => {
      socket.off("action:projection:keystone:update", handleVisibility);
    };
  }, []);

  function handleKeystoneActiveSet(keystoneActive: ProjectionKeystoneActive) {
    setKeystoneActive(keystoneActive);
    rememberedKeystoneActive = keystoneActive;
    socket.emit("action:projection:keystone:change", keystoneActive);
  }

  const handleKeystoneActiveToggle = () => {
    handleKeystoneActiveSet(!keystoneActive);
  };

  return {
    /**
     * If the projection keystone is active (applied) or not.
     */
    keystoneActive,
    /**
     * Toggle if the keystone should be applied or not.
     */
    handleKeystoneActiveToggle,
    handleKeystoneActiveSet,
  };
}
