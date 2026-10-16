import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Float, useGLTF } from "@react-three/drei";

function HeadphoneModel() {
  const modelRef = useRef();

  const { scene } = useGLTF("/models/headphone.glb");

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <Float
      speed={1.2}
      floatIntensity={0.2}
      rotationIntensity={0.03}
    >
      <group ref={modelRef}>
        <Center>
          <primitive
            object={scene}
            scale={5}
            position={[0, -0.4, 0]}
          />
        </Center>
      </group>
    </Float>
  );
}

function Loading() {
  return (
    <div className="flex h-[500px] w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
    </div>
  );
}

export default function Headphone3D() {
  return (
    <div className="h-[500px] w-full">
      <Suspense fallback={<Loading />}>
        <Canvas
          camera={{
            position: [0, 0.2, 4.5],
            fov: 32,
          }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <ambientLight intensity={2} />

          <directionalLight
            position={[5, 6, 5]}
            intensity={3}
          />

          <directionalLight
            position={[-5, 3, 4]}
            intensity={1.5}
          />

          <HeadphoneModel />
        </Canvas>
      </Suspense>
    </div>
  );
}