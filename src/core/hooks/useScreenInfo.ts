import { useEffect, useMemo, useState } from "react";

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;
const SHORT_HEIGHT = 740;

type ScreenInfo = {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isShortHeight: boolean;
};

function getViewportSize() {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function useScreenInfo(): ScreenInfo {
  const [viewport, setViewport] = useState(getViewportSize);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setViewport(getViewportSize());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return useMemo(() => {
    const { width, height } = viewport;
    const isMobile = width < MOBILE_BREAKPOINT;
    const isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
    const isDesktop = width >= TABLET_BREAKPOINT;
    const isLandscape = width > height;
    const isPortrait = !isLandscape;
    const isShortHeight = height > 0 && height < SHORT_HEIGHT;

    return {
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      isPortrait,
      isLandscape,
      isShortHeight,
    };
  }, [viewport]);
}