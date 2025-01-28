// App.tsx
import { CornerPinImage } from "./components/CornerPinImage.tsx";
import alignmentImage from "#assets/projection/ipad_alignment_portrait.png";
import reactLogo from "#assets/react.svg";

function App() {
  // Example corners in percent of screen size:
  const corners = {
    topLeft: { x: 30, y: 15 },
    topRight: { x: 90, y: 5 },
    bottomRight: { x: 90, y: 95 },
    bottomLeft: { x: 30, y: 95 },
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <CornerPinImage
        src={alignmentImage}
        corners={corners}
        srcWidth={1366} // e.g. after you physically rotated the image to landscape
        srcHeight={1024} // ...
        backgroundColor="#8d8d8d"
      />
    </>
  );
}

export default App;
