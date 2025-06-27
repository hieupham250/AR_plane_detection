import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";

export function ModelLoader({
  url,
  position,
  scale,
}: {
  url: string;
  position: [number, number, number];
  scale: number;
}) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    cloned.position.set(...position);
    cloned.scale.set(scale, scale, scale);
  }, [cloned, position, scale]);

  return <primitive object={cloned} />;
}
