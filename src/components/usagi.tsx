'use client';

import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, ContactShadows, useGLTF, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Define Custom Shader Material
const ExplosionMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0, // 0 = Solid, 1 = Fully Exploded
    uTexture: null,
    uColor: new THREE.Color('#e6c15c')
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uProgress;
    attribute vec3 aRandom;
    varying vec2 vUv;
    varying float vProgress;

    void main() {
      vUv = uv;
      vProgress = uProgress;
      
      vec3 pos = position;
      
      // Explosion logic: move along normal + random direction
      vec3 direction = normalize(normal + aRandom);
      
      // Expand based on progress
      // Non-linear expansion for better feel
      float expansion = uProgress * 5.0;
      
      pos += direction * expansion;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // Scale point size by distance and progress
      // As it explodes, particles might get smaller or stay visible
      gl_PointSize = (10.0 * (1.0 - uProgress * 0.5)) * (1.0 / -mvPosition.z);
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying float vProgress;

    void main() {
      // Simple circle shape for particles
      float r = distance(gl_PointCoord, vec2(0.5));
      if (r > 0.5) discard;
      
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Mix texture color with base color
      // If texture is transparent/missing, use uColor
      vec3 finalColor = texColor.rgb;
      if (texColor.a < 0.1) finalColor = uColor;
      
      // Fade out at the end
      float alpha = 1.0 - smoothstep(0.8, 1.0, vProgress);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ ExplosionMaterial });

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
             <ExplodingUsagi />
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

function ExplodingUsagi() {
  const { scene } = useGLTF('/model.glb');
  const groupRef = useRef<THREE.Group>(null);
  const [exploded, setExploded] = useState(false);
  
  // Extract meshes and prepare geometry for particles
  const particles = useMemo(() => {
    const parts: { geometry: THREE.BufferGeometry, material: THREE.Material, texture: THREE.Texture | null }[] = [];
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geometry = mesh.geometry.clone();
        
        // Add random attribute for explosion direction variation
        const count = geometry.attributes.position.count;
        const randoms = new Float32Array(count * 3);
        for(let i=0; i<count*3; i++) {
            randoms[i] = (Math.random() - 0.5) * 2.0;
        }
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
        
        // Get texture if exists
        let tex = null;
        if (Array.isArray(mesh.material)) {
             if (mesh.material[0] && (mesh.material[0] as THREE.MeshStandardMaterial).map) 
                tex = (mesh.material[0] as THREE.MeshStandardMaterial).map;
        } else if ((mesh.material as THREE.MeshStandardMaterial).map) {
             tex = (mesh.material as THREE.MeshStandardMaterial).map;
        }
        
        parts.push({ 
            geometry, 
            material: mesh.material as THREE.Material,
            texture: tex
        });
      }
    });
    return parts;
  }, [scene]);

  // Animation state
  const progress = useRef(0);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Animation logic for explosion
    const target = exploded ? 1.0 : 0.0;
    progress.current = THREE.MathUtils.lerp(progress.current, target, 0.05);
    
    if (groupRef.current) {
        // Follow cursor (Standard behavior)
        const targetRotY = state.mouse.x * 0.5;
        const targetRotX = -state.mouse.y * 0.5;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
        
        // Reset scale to default (2.5) to remove jelly effect
        groupRef.current.scale.set(2.5, 2.5, 2.5);
    }
    
    // Update shader uniforms
    // We need to access the materials in the particle system
    // But wait, we are rendering EITHER primitive OR points.
  });

  // Click handler
  const handleClick = () => {
    setExploded(prev => !prev);
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group 
            ref={groupRef} 
            position={[0, -1, 0]} 
            scale={2.5} 
            onClick={handleClick}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
        >
            {/* 
               Strategy: 
               Render BOTH original model and Particles.
               Fade out original model when exploding.
               Fade in particles when exploding.
            */}
            
            {/* Original Model */}
            <group visible={!exploded && progress.current < 0.9}>
                 <primitive object={scene} />
            </group>

            {/* Particle System */}
            <group visible={exploded || progress.current > 0.01}>
                {particles.map((part, i) => (
                    <points key={i} geometry={part.geometry}>
                        {/* @ts-ignore */}
                        <explosionMaterial 
                            attach="material" 
                            uProgress={progress.current}
                            uTexture={part.texture}
                            transparent={true}
                            depthWrite={false}
                        />
                    </points>
                ))}
            </group>
        </group>
    </Float>
  );
}

useGLTF.preload('/model.glb');
