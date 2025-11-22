'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

export function Pokeball3D() {
  return (
    <div className="h-[300px] w-full relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Environment preset="city" />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <group rotation={[0.2, -0.5, 0]}>
            <PokeballMesh />
          </group>
        </Float>
        
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

function PokeballMesh() {
  const groupRef = useRef<THREE.Group>(null);

  // Materials
  const redMaterial = new THREE.MeshStandardMaterial({ 
    color: '#ff0000', 
    roughness: 0.1, 
    metalness: 0.5 
  });
  
  const whiteMaterial = new THREE.MeshStandardMaterial({ 
    color: '#ffffff', 
    roughness: 0.1, 
    metalness: 0.5 
  });
  
  const blackMaterial = new THREE.MeshStandardMaterial({ 
    color: '#1a1a1a', 
    roughness: 0.2, 
    metalness: 0.2 
  });
  
  const buttonMaterial = new THREE.MeshStandardMaterial({ 
    color: '#ffffff', 
    roughness: 0.2, 
    metalness: 0.8,
    emissive: '#222222'
  });

  // Top Hemisphere (Red)
  // Sphere geometry: radius 2, 32 segments
  // Phi length: PI (half sphere)
  // We need to rotate it to be top
  
  return (
    <group ref={groupRef}>
      {/* Top Red Hemisphere */}
      <mesh material={redMaterial} position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2 - 0.15]} />
      </mesh>
      
      {/* Bottom White Hemisphere */}
      <mesh material={whiteMaterial} position={[0, -0.1, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2 - 0.15]} />
      </mesh>
      
      {/* Inner Black Sphere (Visible in gap) */}
      <mesh material={blackMaterial} scale={[0.95, 0.95, 0.95]}>
        <sphereGeometry args={[2, 64, 32]} />
      </mesh>
      
      {/* Black Band Ring (Torus? Or just the inner sphere showing through?) 
          Actually standard pokeball has a recessed band. The gap above does show the black inner.
          But we need the button housing.
      */}
      
      {/* Button Housing (Black Cylinder/Cylinder-ish) */}
      <group rotation={[0, 0, Math.PI/2]} position={[2, 0, 0]}>
         {/* Main Black Ring around button */}
         <mesh material={blackMaterial} position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 2.05, 32]} />
         </mesh>
      </group>
      
      {/* Refined Button Logic: 
          The button is on the "Front" or "Side". 
          Let's put it on Z axis for easier alignment? Or X axis.
          Let's align with X axis (Right side).
      */}
      
      {/* Button assembly position */}
      <group position={[1.9, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
          {/* Black base for button */}
          <mesh material={blackMaterial} position={[0, -0.1, 0]}>
             <cylinderGeometry args={[0.6, 0.6, 0.2, 32]} />
          </mesh>
          
          {/* White Button */}
          <mesh material={buttonMaterial} position={[0, 0.05, 0]}>
             <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
          </mesh>
          
          {/* Small inner button detail */}
          <mesh material={whiteMaterial} position={[0, 0.15, 0]}>
             <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
          </mesh>
      </group>
      
    </group>
  );
}

