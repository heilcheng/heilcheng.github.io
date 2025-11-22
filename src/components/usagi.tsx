'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, ContactShadows, useGLTF } from '@react-three/drei';

export function Usagi3D() {
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold text-center mb-2 animate-bounce text-yellow-600 dark:text-yellow-400">
        Ura yaha yaha ura?
      </h2>
      <div className="h-[50vh] w-full relative">
        <Canvas>
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
      <h2 className="text-2xl font-bold text-center mt-2 animate-bounce text-yellow-600 dark:text-yellow-400">
        ハァ？
      </h2>
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
  return <primitive object={scene} position={[0, -1, 0]} scale={2.5} rotation={[0, 0, 0]} />;
}

useGLTF.preload('/model.glb');

