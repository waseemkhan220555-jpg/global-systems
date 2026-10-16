import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  useGLTF,
  Float,
  Center,
} from "@react-three/drei";

function PrinterModel() {
  const model = useRef();

  const { scene } = useGLTF("/models/printer.glb");

  useFrame((_, delta) => {
    if (model.current) {
      model.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Float
      speed={1.1}
      floatIntensity={0.15}
      rotationIntensity={0.02}
    >
      <group ref={model}>
        <Center>
          <primitive
            object={scene}
            scale={1.6}
            position={[0, -0.5, 0]}
          />
        </Center>
      </group>
    </Float>
  );
}

function LoadingPrinter() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
    </div>
  );
}

export default function Printer3D() {
  return (
    <div className="h-[450px] w-full">
      <Canvas
        dpr={[1, 1.5]}
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
        />

        <directionalLight
          position={[-4, 3, 4]}
          intensity={1.3}
        />

        <Suspense fallback={<LoadingPrinter />}>
          <PrinterModel />
        </Suspense>

        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.2}
          scale={4}
          blur={2}
          far={5}
        />
      </Canvas>
    </div>
  );
}