import { useProjectionBackground } from "../hooks/useProjectionBackground.ts";
import { useProjectionVisiblity } from "../hooks/useProjectionVisiblity.ts";
import { useSlide } from "../hooks/useSlide.ts";
import { slideWidth, slideHeight } from "./Projector.tsx";

// TODO: Should react to orientation and aspect ratio. Flexbox needs to be done differently or maybe using css grid.

export function Preview() {
  const { backgroundColor } = useProjectionBackground();
  const { slide, currentSlideIndex, slideByIndex, totalSlides } = useSlide();
  const { visible } = useProjectionVisiblity();

  function seekSlideAhead(seek: number) {
    if (currentSlideIndex + seek <= 0) {
      return slideByIndex(0);
    }

    if (currentSlideIndex + seek < totalSlides) {
      return slideByIndex(currentSlideIndex + seek);
    } else {
      return slideByIndex(totalSlides - 1);
    }
  }

  return (
    <div
      style={{
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "relative",
      }}
    >
      {/* When the visible flag is false, display "hidden" in white text with a red background on the center bottom of the window */}
      {!visible && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            textAlign: "center",
            verticalAlign: "middle",
            backgroundColor: "red",
            opacity: 0.8,
            color: "white",
            padding: "20px",
            zIndex: 1,
            fontSize: "2rem",
          }}
        >
          PROJECTION HIDDEN
        </div>
      )}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRight: `1px solid rgb(${
            255 - parseInt(backgroundColor.slice(1, 3), 16)
          }, ${255 - parseInt(backgroundColor.slice(3, 5), 16)}, ${
            255 - parseInt(backgroundColor.slice(5, 7), 16)
          })`,
        }}
      >
        <img
          src={slide}
          alt="Preview"
          style={{
            rotate: "90deg",
            objectFit: "contain",
          }}
        />
      </div>
      <div
        style={{
          width: "80%",
          height: "80%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.8,
        }}
      >
        <img
          src={seekSlideAhead(1)}
          alt="Preview"
          style={{
            rotate: "90deg",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </div>
      <div
        style={{
          width: "40%",
          height: "40%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.7,
        }}
      >
        <img
          src={seekSlideAhead(2)}
          alt="Preview"
          style={{
            rotate: "90deg",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
}
