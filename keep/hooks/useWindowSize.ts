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
    width: globalThis.innerWidth,
    height: globalThis.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: globalThis.innerWidth,
        height: globalThis.innerHeight,
      });
    }
    globalThis.addEventListener("resize", handleResize);
    return () => globalThis.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
