"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import BlurFade from "./magicui/blur-fade";

interface CubeProps {
  position: [number, number, number];
  faceColors: string[]; // [top, bottom, left, right, front, back]
  id: number;
  isAnimating?: boolean;
}

const Cube = ({ position, faceColors, id, isAnimating }: CubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      {/* BoxGeometry material order: [right, left, top, bottom, front, back] */}
      <meshStandardMaterial color={faceColors[3]} attach="material-0" /> {/* right */}
      <meshStandardMaterial color={faceColors[2]} attach="material-1" /> {/* left */}
      <meshStandardMaterial color={faceColors[0]} attach="material-2" /> {/* top */}
      <meshStandardMaterial color={faceColors[1]} attach="material-3" /> {/* bottom */}
      <meshStandardMaterial color={faceColors[4]} attach="material-4" /> {/* front */}
      <meshStandardMaterial color={faceColors[5]} attach="material-5" /> {/* back */}
    </mesh>
  );
};

// Component that uses useFrame hook (must be inside Canvas)
const RotatingCubeGroup = ({ isSolving, children, groupRef }: { 
  isSolving: boolean; 
  children: React.ReactNode;
  groupRef: React.RefObject<THREE.Group>;
}) => {
  useFrame(() => {
    if (groupRef.current && !isSolving) {
      // Gentle rotation when not solving
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x += 0.002;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

const RubiksCubeScene = () => {
  const [isSolving, setIsSolving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const groupRef = useRef<THREE.Group>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [cubeStates, setCubeStates] = useState<{ [key: string]: string[] }>({});

  // Rubik's cube colors
  const colors = {
    white: "#ffffff",
    yellow: "#ffff00",
    red: "#ff0000",
    orange: "#ff8c00",
    blue: "#0000ff",
    green: "#00ff00",
  };

  // Define cube positions (3x3x3)
  const cubePositions: [number, number, number][] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubePositions.push([x, y, z]);
      }
    }
  }

  // Simple mouse controls
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && groupRef.current) {
      const deltaX = e.clientX - lastMousePosition.x;
      const deltaY = e.clientY - lastMousePosition.y;
      
      groupRef.current.rotation.y += deltaX * 0.01;
      groupRef.current.rotation.x += deltaY * 0.01;
      
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const startSolving = () => {
    setIsSolving(true);
    
    // Create a properly scrambled state first
    const scrambledStates: { [key: string]: string[] } = {};
    
    // Create a realistic scrambled state by applying some moves to a solved cube
    const solvedState: { [key: string]: string[] } = {};
    cubePositions.forEach((position) => {
      const key = `${position[0]},${position[1]},${position[2]}`;
      const [x, y, z] = position;
      // Start with solved state - each cube has 6 faces [top, bottom, left, right, front, back]
      let faceColors: string[] = [colors.white, colors.white, colors.white, colors.white, colors.white, colors.white];
      
      if (z === 1) {
        // Front face is blue
        faceColors[4] = colors.blue;
      } else if (z === -1) {
        // Back face is green
        faceColors[5] = colors.green;
      }
      
      if (x === 1) {
        // Right face is red
        faceColors[3] = colors.red;
      } else if (x === -1) {
        // Left face is orange
        faceColors[2] = colors.orange;
      }
      
      if (y === 1) {
        // Top face is yellow
        faceColors[0] = colors.yellow;
      } else if (y === -1) {
        // Bottom face is white
        faceColors[1] = colors.white;
      }
      
      solvedState[key] = faceColors;
    });
    
    // Apply some "moves" to scramble it
    const scrambled = { ...solvedState };
    
    // Simulate some cube moves by swapping face colors
    const swapFaceColors = (key1: string, key2: string) => {
      const temp = scrambled[key1];
      scrambled[key1] = scrambled[key2];
      scrambled[key2] = temp;
    };
    
    // Apply some random swaps to create a scrambled state
    const positions = Object.keys(scrambled);
    for (let i = 0; i < 10; i++) {
      const pos1 = positions[Math.floor(Math.random() * positions.length)];
      const pos2 = positions[Math.floor(Math.random() * positions.length)];
      if (pos1 !== pos2) {
        swapFaceColors(pos1, pos2);
      }
    }
    
    setCubeStates(scrambled);
    
    // Animation sequence that shows solving process
    let currentState = { ...scrambled };
    
    const solveSteps = [
      // Step 1: Start solving - fix the white face (bottom)
      () => {
        groupRef.current?.rotation.set(0, Math.PI / 6, 0);
        cubePositions.forEach((position) => {
          const key = `${position[0]},${position[1]},${position[2]}`;
          const [x, y, z] = position;
          if (y === -1) {
            // Fix bottom face to white
            const faceColors = [...currentState[key]];
            faceColors[1] = colors.white; // bottom face
            currentState[key] = faceColors;
          }
        });
        setCubeStates({ ...currentState });
      },
      // Step 2: Fix the yellow face (top)
      () => {
        groupRef.current?.rotation.set(0, Math.PI / 3, 0);
        cubePositions.forEach((position) => {
          const key = `${position[0]},${position[1]},${position[2]}`;
          const [x, y, z] = position;
          const faceColors = [...currentState[key]];
          if (y === -1) faceColors[1] = colors.white; // bottom face
          if (y === 1) faceColors[0] = colors.yellow; // top face
          currentState[key] = faceColors;
        });
        setCubeStates({ ...currentState });
      },
      // Step 3: Fix the side faces
      () => {
        groupRef.current?.rotation.set(0, Math.PI / 2, 0);
        cubePositions.forEach((position) => {
          const key = `${position[0]},${position[1]},${position[2]}`;
          const [x, y, z] = position;
          const faceColors = [...currentState[key]];
          if (y === -1) faceColors[1] = colors.white; // bottom face
          if (y === 1) faceColors[0] = colors.yellow; // top face
          if (x === 1) faceColors[3] = colors.red; // right face
          if (x === -1) faceColors[2] = colors.orange; // left face
          if (z === 1) faceColors[4] = colors.blue; // front face
          if (z === -1) faceColors[5] = colors.green; // back face
          currentState[key] = faceColors;
        });
        setCubeStates({ ...currentState });
      },
      // Step 4: Perfectly solved - proper Rubik's cube colors
      () => {
        groupRef.current?.rotation.set(0, 0, 0);
        const perfectlySolved: { [key: string]: string[] } = {};
        cubePositions.forEach((position) => {
          const key = `${position[0]},${position[1]},${position[2]}`;
          const [x, y, z] = position;
          // Perfectly solved state with proper face colors [top, bottom, left, right, front, back]
          let faceColors: string[] = [colors.white, colors.white, colors.white, colors.white, colors.white, colors.white];
          
          if (y === 1) faceColors[0] = colors.yellow; // top face
          else if (y === -1) faceColors[1] = colors.white; // bottom face
          
          if (z === 1) faceColors[4] = colors.blue; // front face
          else if (z === -1) faceColors[5] = colors.green; // back face
          
          if (x === 1) faceColors[3] = colors.red; // right face
          else if (x === -1) faceColors[2] = colors.orange; // left face
          
          perfectlySolved[key] = faceColors;
        });
        setCubeStates(perfectlySolved);
        setIsSolved(true);
      },
    ];

    let step = 0;
    const animateStep = () => {
      if (step < solveSteps.length && groupRef.current) {
        solveSteps[step]();
        step++;
        setTimeout(animateStep, 1000);
      } else {
        setIsSolving(false);
      }
    };

    animateStep();
  };

  const resetCube = () => {
    setIsSolving(false);
    setIsSolved(false);
    setCubeStates({});
    if (groupRef.current) {
      groupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div 
      className="w-full h-96 relative cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <RotatingCubeGroup isSolving={isSolving} groupRef={groupRef}>
          {/* Generate all 27 cubes */}
          {cubePositions.map((position, index) => {
            const key = `${position[0]},${position[1]},${position[2]}`;
            const [x, y, z] = position;
            
            // Use custom state if available, otherwise use default solved state
            let faceColors: string[] = [colors.white, colors.white, colors.white, colors.white, colors.white, colors.white];
            if (Object.keys(cubeStates).length > 0) {
              // Use the solving animation state
              faceColors = cubeStates[key] || [colors.white, colors.white, colors.white, colors.white, colors.white, colors.white];
            } else {
              // Default solved state - each cube has 6 faces [top, bottom, left, right, front, back]
              if (z === 1) {
                // Front face is blue
                faceColors[4] = colors.blue;
              } else if (z === -1) {
                // Back face is green
                faceColors[5] = colors.green;
              }
              
              if (x === 1) {
                // Right face is red
                faceColors[3] = colors.red;
              } else if (x === -1) {
                // Left face is orange
                faceColors[2] = colors.orange;
              }
              
              if (y === 1) {
                // Top face is yellow
                faceColors[0] = colors.yellow;
              } else if (y === -1) {
                // Bottom face is white
                faceColors[1] = colors.white;
              }
            }
            
            return (
              <Cube key={index} position={position} faceColors={faceColors} id={index} />
            );
          })}
        </RotatingCubeGroup>
      </Canvas>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={startSolving}
          disabled={isSolving}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {isSolving ? "Solving..." : "Solve"}
        </button>
        <button
          onClick={resetCube}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

interface RubiksCubeProps {
  delay?: number;
}

export const RubiksCube = ({ delay }: RubiksCubeProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <BlurFade delay={delay}>
      <div className="space-y-12 w-full py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              3D Rubik&apos;s Cube Solver.
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Interactive 3D visualization of a Rubik&apos;s cube solving algorithm.
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="bg-card border rounded-lg p-6 w-full max-w-2xl">
            {isClient ? <RubiksCubeScene /> : <div className="h-96 flex items-center justify-center">Loading 3D Cube...</div>}
          </div>
        </div>
      </div>
    </BlurFade>
  );
}; 