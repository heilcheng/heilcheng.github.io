'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { createSolvedCubies, type CubieData, type FaceKey, type Color } from '../lib/cube-core';
import { BeginnerSolver } from '../lib/beginner-solver';

// --- Constants & Types ---
const ANIMATION_SPEED_MS = 300;
const COLOR_MAP: Record<Color, string> = {
  'W': '#ffffff',
  'Y': '#ffd500', // slightly warmer yellow
  'O': '#ff5800', // vibrant orange
  'R': '#b90000', // deep red
  'G': '#009e60', // standard green
  'B': '#0045ad', // standard blue
};
const PLASTIC_COLOR = '#2a2a2a';

// Helper to get axis/layer from move string
function parseMove(move: string): { axis: 'x'|'y'|'z', layer: number, angle: number } {
  const face = move[0];
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");
  
  let angle = Math.PI / 2;
  if (isPrime) angle = -Math.PI / 2;
  if (isDouble) angle = Math.PI;

  // Mapping Face -> Axis/Layer/Direction
  // R: x=1, angle=-PI/2 (Right hand rule on X points Right. R turn is clockwise looking at R. So rotation is negative around X)
  // Wait. Standard: R is clockwise looking at R face.
  // X axis points Right. Rotation around +X is L'.
  // So R = -90 deg around X.
  // L = +90 deg around X.
  // U = -90 deg around Y.
  // D = +90 deg around Y.
  // F = -90 deg around Z.
  // B = +90 deg around Z.
  
  let axis: 'x'|'y'|'z' = 'y';
  let layer = 0;
  let baseAngle = -Math.PI/2;

  switch (face) {
    case 'R': axis='x'; layer=1; baseAngle=-Math.PI/2; break;
    case 'L': axis='x'; layer=-1; baseAngle=Math.PI/2; break;
    case 'U': axis='y'; layer=1; baseAngle=-Math.PI/2; break;
    case 'D': axis='y'; layer=-1; baseAngle=Math.PI/2; break;
    case 'F': axis='z'; layer=1; baseAngle=-Math.PI/2; break;
    case 'B': axis='z'; layer=-1; baseAngle=Math.PI/2; break;
    case 'x': axis='x'; layer=99; baseAngle=-Math.PI/2; break; // 99 means all
    case 'y': axis='y'; layer=99; baseAngle=-Math.PI/2; break;
    case 'z': axis='z'; layer=99; baseAngle=-Math.PI/2; break;
  }

  if (isDouble) baseAngle *= 2;
  if (isPrime) baseAngle *= -1; // Invert (but double is 180 so sign flips to -180 == 180)
  // Wait, if base is -90. Prime is +90.
  // If base is -90. Double is -180.
  
  if (isPrime && isDouble) {
      // R2' is same as R2.
      // base=-90. prime means * -1 -> +90? No.
      // Logic:
      // R = -90.
      // R' = +90.
      // R2 = -180.
  }

  return { axis, layer, angle: baseAngle };
}

  // Main Scene Component
  const Cubie = ({ 
    data, 
    animating, 
    animAxis, 
    animAngle, 
    animProgress 
  }: { 
    data: CubieData; 
    animating: boolean; 
    animAxis: 'x'|'y'|'z'; 
    animAngle: number; 
    animProgress: number; 
  }) => {
    const group = useRef<THREE.Group>(null);
    
    // Maintain internal transform state
    // We use a ref to store the "current settled state" matrix
    // and apply animation on top of it every frame.
    const matrix = useRef(new THREE.Matrix4());
    
    // Initialize matrix once
    useEffect(() => {
      if (group.current) {
        matrix.current.setPosition(data.x, data.y, data.z);
        group.current.position.set(data.x, data.y, data.z);
  }
    }, [data.x, data.y, data.z]);

    // Update transform
    useFrame(() => {
      if (!group.current) return;
      
      if (animating) {
         // Create rotation matrix
         const rot = new THREE.Matrix4();
         const axisVec = new THREE.Vector3(
             animAxis==='x'?1:0, 
             animAxis==='y'?1:0, 
             animAxis==='z'?1:0
         );
         rot.makeRotationAxis(axisVec, animAngle * animProgress);
         
         // Combine: CurrentBase * Rotation
         const currentM = matrix.current.clone();
         currentM.premultiply(rot);
         currentM.decompose(group.current.position, group.current.quaternion, group.current.scale);
      } else {
         // Just sync with base matrix
         matrix.current.decompose(group.current.position, group.current.quaternion, group.current.scale);
      }
    });
    
    return (
      <group ref={group}>
         <mesh>
           <boxGeometry args={[0.9, 0.9, 0.9]} />
           <meshStandardMaterial color={PLASTIC_COLOR} roughness={0.6} metalness={0.1} />
         </mesh>
         {/* Stickers */}
         {Object.entries(data.stickers).map(([face, color]) => (
           <Sticker key={face} face={face as FaceKey} color={COLOR_MAP[color]} />
         ))}
      </group>
    );
  };

  // Special sticker component with slightly raised geometry
  const Sticker = ({ face, color }: { face: FaceKey, color: string }) => {
    const { pos, rot } = useMemo(() => {
      const offset = 0.48; // Slightly above box surface (0.45)
      switch (face) {
        case 'U': return { pos: [0, offset, 0], rot: [-Math.PI/2, 0, 0] };
        case 'D': return { pos: [0, -offset, 0], rot: [Math.PI/2, 0, 0] };
        case 'F': return { pos: [0, 0, offset], rot: [0, 0, 0] };
        case 'B': return { pos: [0, 0, -offset], rot: [0, Math.PI, 0] };
        case 'R': return { pos: [offset, 0, 0], rot: [0, -Math.PI/2, 0] };
        case 'L': return { pos: [-offset, 0, 0], rot: [0, Math.PI/2, 0] };
      }
    }, [face]);

    return (
      <mesh position={pos as any} rotation={rot as any}>
        <planeGeometry args={[0.86, 0.86]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.0} />
      </mesh>
    );
  };
  
// --- Main Scene Component ---
const CubeScene = ({ 
    moveQueue, 
    onMoveComplete 
}: { 
    moveQueue: string[], 
    onMoveComplete: () => void 
}) => {
  // We store the state of all 27 cubies
  // Each cubie has a "ref" to its scene object to update transforms directly
  const cubieRefs = useRef<THREE.Group[]>([]);
  // Logical positions (x,y,z) of each cubie. Index matches cubieRefs.
  const cubiePos = useRef<{x:number,y:number,z:number}[]>([]);
  
  const [cubiesData] = useState(() => createSolvedCubies());
  
  // Initialize logical positions
  useEffect(() => {
      cubiePos.current = cubiesData.map(c => ({ x: c.x, y: c.y, z: c.z }));
  }, [cubiesData]);

  const animationState = useRef({
    active: false,
    move: '',
    startTime: 0,
    duration: ANIMATION_SPEED_MS,
    affectedIndices: [] as number[],
    axis: 'y' as 'x'|'y'|'z',
    angle: 0,
    startMatrices: [] as THREE.Matrix4[] // Store state before animation
  });

  useFrame((state) => {
    const t = state.clock.elapsedTime * 1000;
    const anim = animationState.current;

    if (!anim.active) {
       // Check queue
       if (moveQueue.length > 0) {
           const nextMove = moveQueue[0];
           startAnimation(nextMove, t);
       }
       return;
    }

    // Animate
    const elapsed = t - anim.startTime;
    const progress = Math.min(elapsed / anim.duration, 1);
    // Easing
    const ease = 1 - Math.pow(1 - progress, 3); // Cubic out

    // Apply rotation to affected cubies
    const rotMatrix = new THREE.Matrix4();
    const axisVec = new THREE.Vector3(
        anim.axis==='x'?1:0, anim.axis==='y'?1:0, anim.axis==='z'?1:0
    );
    rotMatrix.makeRotationAxis(axisVec, anim.angle * ease);

    anim.affectedIndices.forEach((idx, i) => {
        const group = cubieRefs.current[idx];
        const startMat = anim.startMatrices[i];
        // Current = Rot * Start (World rotation)
        const m = rotMatrix.clone().multiply(startMat);
        m.decompose(group.position, group.quaternion, group.scale);
    });

    if (progress >= 1) {
        finishAnimation();
    }
  });

  const startAnimation = (move: string, startTime: number) => {
      const { axis, layer, angle } = parseMove(move);
      const indices: number[] = [];
      const startMats: THREE.Matrix4[] = [];

      // Find affected cubies
      cubiePos.current.forEach((pos, idx) => {
          let matches = false;
          if (layer === 99) matches = true; // Cube rotation
          else {
              if (axis === 'x' && Math.round(pos.x) === layer) matches = true;
              if (axis === 'y' && Math.round(pos.y) === layer) matches = true;
              if (axis === 'z' && Math.round(pos.z) === layer) matches = true;
          }
          
          if (matches) {
              indices.push(idx);
              const group = cubieRefs.current[idx];
              const m = new THREE.Matrix4();
              m.compose(group.position, group.quaternion, group.scale);
              startMats.push(m);
          }
      });

      animationState.current = {
          active: true,
          move,
          startTime,
          duration: ANIMATION_SPEED_MS,
          affectedIndices: indices,
          axis,
          angle,
          startMatrices: startMats
      };
  };
  
  const finishAnimation = () => {
      const anim = animationState.current;
      // 1. Snap to exact angle
      const rotMatrix = new THREE.Matrix4();
      const axisVec = new THREE.Vector3(
        anim.axis==='x'?1:0, anim.axis==='y'?1:0, anim.axis==='z'?1:0
      );
      rotMatrix.makeRotationAxis(axisVec, anim.angle);

      anim.affectedIndices.forEach((idx, i) => {
          const group = cubieRefs.current[idx];
          const startMat = anim.startMatrices[i];
          const finalMat = rotMatrix.clone().multiply(startMat);
          finalMat.decompose(group.position, group.quaternion, group.scale);
          
          // 2. Update logical position
          // Round position to integer
          const p = new THREE.Vector3();
          p.setFromMatrixPosition(finalMat);
          cubiePos.current[idx] = { 
              x: Math.round(p.x), 
              y: Math.round(p.y), 
              z: Math.round(p.z) 
          };
      });

      animationState.current.active = false;
      onMoveComplete();
  };
  
  return (
    <group>
       {cubiesData.map((c, i) => (
           <group key={c.id} ref={el => { if (el) cubieRefs.current[i] = el; }} position={[c.x, c.y, c.z]}>
               <mesh>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
                   <meshStandardMaterial color={PLASTIC_COLOR} roughness={0.5} metalness={0.1} />
      </mesh>
               {Object.entries(c.stickers).map(([face, color]) => (
                   <Sticker key={face} face={face as FaceKey} color={COLOR_MAP[color]} />
               ))}
           </group>
       ))}
    </group>
  );
};

export default function RubiksCube() {
    const [queue, setQueue] = useState<string[]>([]);
    const [history, setHistory] = useState<string[]>([]);
  const [isSolving, setIsSolving] = useState(false);
    
    // Solver instance (lazy loaded or recreated on scramble)
    const solverRef = useRef<BeginnerSolver | null>(null);

    const handleScramble = () => {
        const moves: string[] = [];
        const faces = ['U','D','L','R','F','B'];
        for (let i=0; i<20; i++) {
            const f = faces[Math.floor(Math.random()*6)];
            const mod = Math.random() > 0.5 ? "'" : (Math.random() > 0.5 ? "2" : "");
            moves.push(f+mod);
        }
        setQueue(prev => [...prev, ...moves]);
        
        // Reset solver logic? No, we need to track state.
        // Actually, we should track the moves in a "logical cube" to solve it later.
        if (!solverRef.current) solverRef.current = new BeginnerSolver();
        // Apply moves to logical solver
        // We don't need to apply them immediately if we only solve at the end.
        // But the visual moves take time.
        // We should queue logical updates or just re-init solver with the scramble?
        
        // Better: We maintain a list of ALL moves applied since solved state.
        // When "Solve" is clicked, we create a new Solver(), apply all history, then solve.
        setHistory(prev => [...prev, ...moves]);
    };
    
    const handleSolve = () => {
        if (isSolving) return;
        
        // Reconstruct state
        const solver = new BeginnerSolver();
        // Apply history
        // BeginnerSolver needs an 'apply' method or we construct with moves?
        // BeginnerSolver uses cubejs. cubejs can take moves.
        // We need to expose a way to apply setup moves.
        
        // Currently BeginnerSolver constructor takes 'cubeState', but easiest is to just move it.
        // I'll cast to any to access the internal cube and move it.
        const internalCube = (solver as any).cube;
        history.forEach(m => internalCube.move(m));
        
        const solution = solver.solve();
        console.log("Solution:", solution);
        
        setQueue(prev => [...prev, ...solution]);
    setIsSolving(true);
        
        // Update history with solution (so next solve works if we scramble again)
        setHistory(prev => [...prev, ...solution]);
  };
  
    const onMoveComplete = () => {
        setQueue(prev => prev.slice(1));
        if (queue.length <= 1) {
          setIsSolving(false);
        }
    };

    const handleReset = () => {
        // Reload page or just clear everything?
        // Resetting 3D state is hard without unmounting.
        window.location.reload(); // Simple brute force reset
  };
  
  return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
            <div className="relative w-full h-[500px] bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
                <Canvas camera={{ position: [6, 4, 6], fov: 45 }}>
                    <color attach="background" args={['#111']} />
                    <ambientLight intensity={1.0} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <directionalLight position={[-10, -10, -5]} intensity={1} />
                    <CubeScene moveQueue={queue} onMoveComplete={onMoveComplete} />
                    <OrbitControls makeDefault minDistance={5} maxDistance={20} />
                    <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
                </Canvas>
                
                {/* Overlay UI */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-md text-white p-3 rounded-lg pointer-events-auto">
                        <h1 className="text-xl font-bold">Rubik&apos;s Solver</h1>
                        <p className="text-sm opacity-80">Beginner Method Visualization</p>
                    </div>
                    
                    {queue.length > 0 && (
                        <div className="bg-blue-600/80 text-white px-4 py-2 rounded-full font-mono text-lg font-bold animate-pulse">
                            {queue[0]}
                        </div>
                    )}
      </div>
      
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 pointer-events-none">
        <button
                        onClick={handleScramble}
                        disabled={queue.length > 0}
                        className="pointer-events-auto px-6 py-3 bg-white dark:bg-gray-800 text-black dark:text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 active:scale-95"
        >
          Scramble
        </button>
        <button
                        onClick={handleSolve}
                        disabled={queue.length > 0 || history.length === 0}
                        className="pointer-events-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 active:scale-95"
        >
                        Solve Cube
        </button>
        <button
                        onClick={handleReset}
                        className="pointer-events-auto px-6 py-3 bg-red-500/80 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform active:scale-95"
        >
          Reset
        </button>
      </div>
      </div>
      
            {/* Queue Display */}
            <div className="mt-6 w-full p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Move Queue ({queue.length})</h3>
                <div className="flex flex-wrap gap-2 font-mono text-sm text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
                    {queue.length === 0 ? (
                        <span className="italic opacity-50">Ready...</span>
                    ) : (
                        queue.map((m, i) => (
                            <span key={i} className={i === 0 ? "text-blue-500 font-bold bg-blue-100 dark:bg-blue-900/30 px-1 rounded" : ""}>
                                {m}
            </span>
                        ))
                    )}
          </div>
          </div>
    </div>
  );
}
