import { SLIDES, SLIDES_PUBLIC_FOLDER } from "../../config.ts";

// TODO: Good place to create a more sophisticated solution not relying on a config file.

/**
 * Returns the relative URL of the slide. Numbers are from the `SLIDES` array in `config.ts`. Does not check if out of bounds.
 */
export default function getSlide(
  slideNumber: number,
): { urlRelative: string; totalSlides: number } {
  const slide = SLIDES[slideNumber];
  return {
    urlRelative: `${SLIDES_PUBLIC_FOLDER}${slide}`,
    totalSlides: SLIDES.length,
  };
}
