import { useCallback, useEffect, useRef, useState } from "react";

interface UseOpacityHzFlickerReturn {
  opacityFlicker: number;
  handleFlickerHzSet: (hz: number) => void;
  handleFlickerOpacityToggle: () => void;
}

/**
 * Hook to create a flickering effect by toggling the opacity of an element like the projected image. This is useful, to offset the flicker frequency of the projector from the camera's frame rate and shutter angle to make the projection invisible to the camera.
 */
function useOpacityHzFlicker(initialHz: number = 2): UseOpacityHzFlickerReturn {
  // Frequency of flickering in Hz.
  const [frequency, setFrequency] = useState<number>(initialHz);
  // Whether the flickering is active.
  const [active, setActive] = useState<boolean>(false);
  // Current opacity value (1 or 0) for the flicker.
  const [opacityFlicker, setOpacityFlicker] = useState<number>(1);

  // Refs to keep track of the animation frame id and the synchronized start time.
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Animation loop function: updates opacity based on elapsed time.
  const animate = useCallback((timestamp: number) => {
    if (!active) {
      return;
    }
    // On the first frame, capture the start timestamp to synchronize.
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    const elapsed = (timestamp - startTimeRef.current) / 1000; // in seconds
    const period = 1 / frequency;
    const phase = elapsed % period;
    // Set opacity to 1 for the first half of the cycle and 0 for the second half.
    const newOpacity = phase < period / 2 ? 1 : 0;
    setOpacityFlicker(newOpacity);
    requestRef.current = requestAnimationFrame(animate);
  }, [active, frequency]);

  // Effect that starts or stops the animation loop based on the "active" state.
  useEffect(() => {
    if (active) {
      // Reset start time to align to the next frame.
      startTimeRef.current = 0;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // Cancel any ongoing animation.
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      // Ensure opacity is reset to fully visible when flickering is off.
      setOpacityFlicker(1);
    }
    // Cleanup when the component unmounts.
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [active, animate]);

  // Function to update the flicker frequency.
  const handleFlickerHzSet = useCallback((hz: number) => {
    if (hz > 0) {
      setFrequency(hz);
    }
  }, []);

  // Function to toggle flickering on or off.
  const handleFlickerOpacityToggle = useCallback(() => {
    setActive((prev) => !prev);
  }, []);

  return { opacityFlicker, handleFlickerHzSet, handleFlickerOpacityToggle };
}

export default useOpacityHzFlicker;
