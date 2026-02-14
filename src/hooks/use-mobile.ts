import { useEffect, useState } from "react";

/**
 * Hook to detect if the current viewport is mobile-sized
 * @param breakpoint - Pixel width breakpoint (default: 768px)
 * @returns boolean indicating if viewport is mobile
 */
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkMobile();

    // Check on resize
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
}
