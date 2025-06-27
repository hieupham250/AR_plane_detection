import { Canvas, useThree } from "@react-three/fiber";
import { createXRStore, XR } from "@react-three/xr";
import { useEffect, useMemo } from "react";
import { ARButton } from "three/examples/jsm/Addons.js";
import ARContent from "./ARContent";

function AddARButton() {
  const { gl } = useThree();
  useEffect(() => {
    const button = ARButton.createButton(gl, {
      requiredFeatures: ["hit-test"],
    });
    document.body.appendChild(button);

    // Cleanup
    return () => {
      if (button.parentElement) button.parentElement.removeChild(button);
    };
  }, [gl]);

  return null;
}

export default function ARViewer() {
  const store = useMemo(() => createXRStore(), []); // Tạo XR store một lần duy nhất
  return (
    <>
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
          <ARContent />
        </XR>
      </Canvas>
    </>
  );
}
