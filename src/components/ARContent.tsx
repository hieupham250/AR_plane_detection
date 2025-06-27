import { useXRHitTest } from "@react-three/xr";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ModelLoader } from "./ModelLoader";

type ModelData = {
  url: string;
  position: [number, number, number];
  scale: number;
};

const MODELS = {
  duck: {
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
    scale: 0.05,
  },
  lion: {
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lion/glTF-Binary/Lion.glb",
    scale: 0.02,
  },
  fox: {
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb",
    scale: 0.03,
  },
};

export default function ARContent() {
  const reticleRef = useRef<THREE.Mesh>(null);
  const tempMatrix = new THREE.Matrix4();
  const [models, setModels] = useState<ModelData[]>([]);
  const [selectedModel, setSelectedModel] =
    useState<keyof typeof MODELS>("duck");

  // hook thực hiện hit test để phát hiện mặt phẳng
  useXRHitTest((hitTestResults, getHitPoseMatrix) => {
    const hit = hitTestResults[0]; // Lấy kết quả đầu tiên
    const reticle = reticleRef.current;

    if (hit && reticle) {
      const hasValidHitMatrix = getHitPoseMatrix(tempMatrix, hit); // Lấy ma trận từ hit

      if (hasValidHitMatrix) {
        reticle.visible = true;

        const pos = new THREE.Vector3();
        const scale = new THREE.Vector3();
        const dummyQuat = new THREE.Quaternion();

        tempMatrix.decompose(pos, dummyQuat, scale);

        reticle.position.copy(pos); // Gán vị trí cho reticle
        reticle.rotation.set(-Math.PI / 2, 0, 0); // Xoay reticle nằm ngang
      } else {
        reticle.visible = false;
      }
    } else if (reticle) {
      reticle.visible = false;
    }
  }, "viewer");

  useEffect(() => {
    const handleTouch = () => {
      const reticle = reticleRef.current;
      if (reticle && reticle.visible) {
        const pos = reticle.position;
        setModels((prev) => [
          ...prev,
          {
            url: MODELS[selectedModel].url,
            scale: MODELS[selectedModel].scale,
            position: [pos.x, pos.y, pos.z],
          },
        ]);
      }
    };

    window.addEventListener("touchend", handleTouch);

    return () => {
      window.removeEventListener("touchend", handleTouch);
    };
  }, [selectedModel]);

  return (
    <>
      <mesh ref={reticleRef}>
        <ringGeometry args={[0.15, 0.2, 32]} />
        <meshBasicMaterial
          color="white"
          opacity={0.8}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {models.map((model, index) => (
        <ModelLoader
          key={index}
          url={model.url}
          position={model.position}
          scale={model.scale}
        />
      ))}
    </>
  );
}
