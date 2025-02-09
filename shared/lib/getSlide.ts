import { SLIDES, SLIDES_PUBLIC_FOLDER } from "../../config.ts";

// TODO: Good place to create a more sophisticated solution not relying on a config file.

/**
 * Returns the relative URL of the slide. Numbers are from the `SLIDES` array in `config.ts`. Does not check if out of bounds.
 */
export function getSlideURL(slideNumber: number) {
  const slide = SLIDES[slideNumber];
  return `${SLIDES_PUBLIC_FOLDER}${slide}`;
}

export function getSlideCatalog() {
  return SLIDES;
}

export function getSlideCount() {
  return SLIDES.length;
}
