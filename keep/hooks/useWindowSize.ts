/**
 * PURPOSE:
 *   A custom React hook to track the current window size in pixels.
 *
 * USAGE:
 *   - Import and call inside a React component:
 *       const { width, height } = useWindowSize();
 *   - It returns an object { width, height } that automatically
 *     updates if the browser window is resized.
 *
 * EXAMPLE:
 *   function MyComponent() {
 *     const { width, height } = useWindowSize();
 *     return <p>The window is {width} x {height}</p>;
 *   }
 *
 * DEPENDENCIES:
 *   - React (useState, useEffect).
 */
import { useEffect, useState } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
