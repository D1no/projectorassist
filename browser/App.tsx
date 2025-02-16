import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Projector } from "./page/Projector.tsx";
import { CornerControlPage } from "./page/CornerControlPage.tsx";
import { SlideClicker } from "./page/SlideClicker.tsx";
import { Preview } from "./page/Preview.tsx";
import { FlickerTest } from "./page/FlickerTest.tsx";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Projector is the default route */}
        <Route path="/" element={<Projector />} />

        {/* The alignment control UI */}
        <Route path="/control" element={<CornerControlPage />} />

        {/* The slide clicker UI */}
        <Route path="/clicker" element={<SlideClicker />} />

        {/* Preview of the slide in correct orientation */}
        <Route path="/preview" element={<Preview />} />

        {/* Flicker TESTING */}
        <Route path="/flicker" element={<FlickerTest />} />
      </Routes>
    </BrowserRouter>
  );
}
