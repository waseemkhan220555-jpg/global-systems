import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  useGLTF,
  Float,
  Center,
} from "@react-three/drei";

// Preload the model so it's instantly cached when the canvas mounts
useGLTF.preload("/models/laptop.glb");

function LaptopModel() {
  const model = useRef();
  const { scene } = useGLTF("/models/laptop.glb");

  useFrame((_, delta) => {
    if (model.current) {
      model.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Float
      speed={1.3}
      floatIntensity={0.2}
      rotationIntensity={0.03}
    >
      <group ref={model}>
        <Center>
          <primitive
            object={scene}
            // Scale down on mobile screens, larger on desktops
            scale={window.innerWidth < 768 ? 1.1 : 1.5}
            position={[0, -0.3, 0]}
          />
        </Center>
      </group>
    </Float>
  );
}

function LoadingLaptop() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
    </div>
  );
}

export default function Laptop3D() {
  return (
    <div className="h-[320px] md:h-[520px] w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        resize={{ polyfill: ResizeObserver, debounce: 0 }}
        camera={{
          position: [0, 0.5, 5],
          fov: 35,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={1.8} />

        <directionalLight
          position={[5, 6, 5]}
          intensity={3}
          castShadow
        />

        <directionalLight
          position={[-4, 3, 4]}
          intensity={1.5}
        />

        <Environment preset="studio" />

        <Suspense fallback={<LoadingLaptop />}>
          <LaptopModel />
        </Suspense>

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.3}
          scale={5}
          blur={2.5}
          far={4}
        />
      </Canvas>
    </div>
  );
}