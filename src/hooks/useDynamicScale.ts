import { useState, useEffect } from "react";
import { BREAKPOINTS } from '../constants/breakpoints';

/**
 * Hook to apply dynamic scaling for large screens (>BREAKPOINTS.DESKTOP_LARGE).
 * It calculates a scale transform to maintain layout proportions.
 * 
 * @param baseWidth The base width to scale from (default: BREAKPOINTS.DESKTOP_LARGE)
 * @returns A style object to apply to the container
 */
export function useDynamicScale(baseWidth: number = BREAKPOINTS.DESKTOP_LARGE) {
  const [scaleStyle, setScaleStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > baseWidth) {
        const scale = width / baseWidth;
        setScaleStyle({
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${baseWidth}px`,
          height: `${100 / scale}vh`,
          overflow: "hidden"
        });
      } else {
        setScaleStyle({});
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [baseWidth]);

  return scaleStyle;
}
