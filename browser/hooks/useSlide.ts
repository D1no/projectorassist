import { getSlideCount, getSlideURL } from "#lib/getSlide.ts";
import { useEffect, useState } from "react";
import socket from "../lib/socket.ts";

export function useSlide() {
  const [currentSlideIndex, setCurrentSlideNumber] = useState(0);
  const [slide, setSlide] = useState(getSlideURL(currentSlideIndex));

  // Retrive slide url when currentSlideNumber changes
  useEffect(() => {
    setSlide(getSlideURL(currentSlideIndex));
  }, [currentSlideIndex]);

  // Update currentSlideNumber when the presenter changes the slide
  useEffect(() => {
    const handleCurrentSlide = (slideNumber: number) => {
      setCurrentSlideNumber(slideNumber);
    };

    socket.on("action:slides:currentSlide:update", handleCurrentSlide);

    return () => {
      socket.off("action:slides:currentSlide:update", handleCurrentSlide);
    };
  }, []);

  function handleSlideChange(slideNumber: number) {
    setCurrentSlideNumber(slideNumber);
    socket.emit("action:slides:currentSlide:change", slideNumber);
  }

  /**
   * Go to the next slide if possible.
   */
  const handleGoNext = () => {
    if (currentSlideIndex < getSlideCount() - 1) {
      handleSlideChange(currentSlideIndex + 1);
    }
  };

  /**
   * Go to the previous slide if possible.
   */
  const handleGoBack = () => {
    if (currentSlideIndex > 0) {
      handleSlideChange(currentSlideIndex - 1);
    }
  };

  return {
    slide,
    currentSlideIndex,
    totalSlides: getSlideCount(),
    handleGoNext,
    handleGoBack,
    handleSlideChange,
  };
}
