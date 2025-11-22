'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function Usagi3D() {
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold text-center mb-2 animate-bounce text-yellow-600 dark:text-yellow-400 z-10 relative">
        ハァ？
      </h2>
      <h2 className="text-2xl font-bold text-center -mb-16 animate-bounce text-yellow-600 dark:text-yellow-400 z-10 relative">
        Ura yaha yaha ura?
      </h2>
      <div className="h-[50vh] w-full relative">
        <Canvas gl={{ antialias: true, alpha: true }}>
          <color attach="background" args={['white']} />
          <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={45} />
          <ambientLight intensity={1.0} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={1} />
          <directionalLight position={[0, 5, 5]} intensity={1} />
          
          <Suspense fallback={<Placeholder />}>
             <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
               <Model />
             </Float>
          </Suspense>
          
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/2} />
        </Canvas>
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <group position={[0, 0, 0]}>
      <mesh>
         <sphereGeometry args={[1, 32, 32]} />
         <meshStandardMaterial color="#e6c15c" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Model() {
  const { scene } = useGLTF('/model.glb');
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
     if (ref.current) {
         // Follow cursor logic
         const targetRotY = state.mouse.x * 0.5; // Look left/right
         const targetRotX = -state.mouse.y * 0.5; // Look up/down
         
         ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.1);
         ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotX, 0.1);
     }
  });

  return <primitive ref={ref} object={scene} position={[0, -1, 0]} scale={2.5} rotation={[0, 0, 0]} />;
}

useGLTF.preload('/model.glb');
