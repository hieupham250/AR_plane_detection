import { Canvas, useThree } from "@react-three/fiber";
import { createXRStore, XR } from "@react-three/xr";
import { useEffect, useMemo, useState } from "react";
import { ARButton } from "three/examples/jsm/Addons.js";
import ARContent from "./ARContent";

const models = [
  {
    id: 1,
    title: "duck",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
    scale: 0.2,
  },
  {
    id: 2,
    title: "chair",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
    scale: 0.5,
  },
];

function AddARButton() {
  const { gl } = useThree();
  useEffect(() => {
    const arButton = ARButton.createButton(gl, {
      requiredFeatures: ["hit-test"],
      optionalFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    });
    document.body.appendChild(arButton);

    // Cleanup
    return () => {
      if (arButton.parentElement) arButton.parentElement.removeChild(arButton);
    };
  }, [gl]);

  return null;
}

export default function ARViewer() {
  const store = useMemo(() => createXRStore(), []); // Tạo XR store một lần duy nhất
  const [selectedModel, setSelectedModel] = useState(models[0]);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 9999,
          background: "white",
          padding: "10px",
          borderRadius: "8px",
          overflowX: "auto",
          maxWidth: "90vw",
          display: "flex",
          gap: "10px",
          pointerEvents: "auto",
        }}
      >
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model)}
            style={{
              padding: "10px 15px",
              borderRadius: "6px",
              border:
                selectedModel.title === model.title
                  ? "2px solid blue"
                  : "1px solid gray",
              backgroundColor:
                selectedModel.title === model.title ? "#e0f0ff" : "white",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {model.title === "duck" ? "Duck" : "Chair"}
          </button>
        ))}
      </div>
      <Canvas
        style={{ width: "100vw", height: "100vh" }}
        gl={{ antialias: true, alpha: true }}
        camera={{ near: 0.01, far: 20, fov: 70 }}
      >
        <XR store={store}>
          <AddARButton /> {/* Nút kích hoạt AR */}
          <hemisphereLight
            args={[0xffffff, 0xbbbbff, 3]}
            position={[0.5, 1, 0.25]}
          />
          <ARContent selectedModel={selectedModel} />
        </XR>
      </Canvas>
    </>
  );
}
