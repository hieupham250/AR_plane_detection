import { useXRHitTest } from "@react-three/xr";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ModelLoader } from "./ModelLoader";

type ModelData = {
  url: string;
  position: [number, number, number];
  scale: number;
};

type ARContentProps = {
  selectedModel: {
    id: number;
    title: string;
    url: string;
    scale: number;
  };
};

export default function ARContent({ selectedModel }: ARContentProps) {
  const reticleRef = useRef<THREE.Mesh>(null);
  const tempMatrix = new THREE.Matrix4();
  const [models, setModels] = useState<ModelData[]>([]);

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
            id: selectedModel.id,
            url: selectedModel.url,
            scale: selectedModel.scale,
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
        <mesh
          key={index}
          position={model.position}
          onDoubleClick={() => {
            setModels((prev) => prev.filter((_, i) => i !== index));
          }}
        >
          <ModelLoader key={index} url={model.url} scale={model.scale} />
        </mesh>
      ))}
    </>
  );
}
