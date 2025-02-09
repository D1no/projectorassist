import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Projector } from "./page/Projector.tsx";
import { CornerControlPage } from "./page/CornerControlPage.tsx";
import { SlideClicker } from "./page/SlideClicker.tsx";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Projector is the default route */}
        <Route path="/" element={<Projector />} />

        {/* The alignment control UI */}
        <Route path="/control" element={<CornerControlPage />} />

        <Route path="/clicker" element={<SlideClicker />} />
      </Routes>
    </BrowserRouter>
  );
}
