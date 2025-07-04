import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";

export function ModelLoader({ url, scale }: { url: string; scale: number }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    cloned.scale.set(scale, scale, scale);
  }, [cloned, scale]);

  return <primitive object={cloned} />;
}
