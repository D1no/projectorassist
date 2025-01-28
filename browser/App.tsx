import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Projector } from "./page/Projector.tsx";
import { CornerControlPage } from "./page/CornerControlPage.tsx";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Projector is the default route */}
        <Route path="/" element={<Projector />} />

        {/* The control UI */}
        <Route path="/control" element={<CornerControlPage />} />
      </Routes>
    </BrowserRouter>
  );
}
