import { Canvas, useThree } from "@react-three/fiber";
import { createXRStore, useXRHitTest, XR } from "@react-three/xr";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/Addons.js";

function ARContent() {
  const reticleRef = useRef<THREE.Mesh>(null);
  const tempMatrix = new THREE.Matrix4();

  useXRHitTest((hitResults, getHitMatrix) => {
    const hit = hitResults[0];
    const reticle = reticleRef.current;

    if (hit && reticle) {
      const success = getHitMatrix(tempMatrix, hit);

      if (success) {
        reticle.visible = true;
        tempMatrix.decompose(
          reticle.position,
          reticle.quaternion,
          reticle.scale
        );
      } else {
        reticle.visible = false;
      }
    } else if (reticle) {
      reticle.visible = false; // ẩn nếu không có mặt phẳng
    }
  }, "local-floor");

  return (
    <>
      <mesh ref={reticleRef} visible={false} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.15, 32]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

function ARButtonInjector() {
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
  const store = createXRStore();
  return (
    <>
      <Canvas
        style={{ width: "100%", height: "100vh" }}
        gl={{ antialias: true, alpha: true }}
        camera={{ near: 0.01, far: 20, fov: 70 }}
      >
        <XR store={store}>
          <ARButtonInjector />
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
