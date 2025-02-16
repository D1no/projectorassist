import useOpacityHzFlicker from "../hooks/useOpacityHzFlicker.ts";

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
};

export const FlickerTest = () => {
  const { opacityFlicker, handleFlickerHzSet, handleFlickerOpacityToggle } =
    useOpacityHzFlicker(2);

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: "center" }}>
        <div>
          Flicker Frequency (Hz):{" "}
          <input
            type="number"
            defaultValue={2}
            step={0.1}
            onChange={(e) => handleFlickerHzSet(Number(e.target.value))}
          />
          <button onClick={handleFlickerOpacityToggle}>Toggle Flicker</button>
        </div>
        <div
          style={{
            width: "60%",
            aspectRatio: "1/1",
            backgroundColor: "red",
            opacity: opacityFlicker,
            margin: "auto",
          }}
        />
      </div>
    </div>
  );
};
