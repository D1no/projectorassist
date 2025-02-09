import { useSlide } from "../hooks/useSlide.ts";

export function SlideClicker() {
  const { currentSlideIndex, totalSlides, handleGoNext, handleGoBack } =
    useSlide();

  return (
    <div>
      <h2>
        Current Slide is {currentSlideIndex + 1} of {totalSlides}.
      </h2>
      <button onClick={handleGoBack}>Back</button>
      <button onClick={handleGoNext}>Forward</button>
    </div>
  );
}
