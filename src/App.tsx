// App.tsx
import { CornerPinImage } from "./components/CornerPinImage";
import alignmentImage from "./assets/projection/ipad_alignment_portrait.png";

function App() {
  // Example corners in percent of screen size:
  const corners = {
    topLeft: { x: 30, y: 15 },
    topRight: { x: 90, y: 5 },
    bottomRight: { x: 90, y: 95 },
    bottomLeft: { x: 30, y: 95 },
  };

  return (
    <CornerPinImage
      src={alignmentImage}
      corners={corners}
      srcWidth={1366} // e.g. after you physically rotated the image to landscape
      srcHeight={1024} // ...
      backgroundColor="#8d8d8d"
    />
  );
}

export default App;
