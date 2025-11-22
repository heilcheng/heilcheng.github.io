
export type Color = 'W'|'Y'|'O'|'R'|'G'|'B';
export type FaceKey = 'U'|'D'|'L'|'R'|'F'|'B';

export interface Vec3 { x: -1|0|1; y: -1|0|1; z: -1|0|1 }

export interface Cubie {
  id: string;
  pos: Vec3;
  faceColors: Partial<Record<FaceKey, Color>>;
}

export interface CubeState {
  cubies: Cubie[];
}

export const SOLVED_COLORS: Record<FaceKey, Color> = {
  U: 'W', D: 'Y', L: 'O', R: 'R', F: 'G', B: 'B'
};

// Basic types for the visual component
export interface CubieData {
  id: number;
  x: number; 
  y: number; 
  z: number;
  // Which stickers does this cubie have? (Static)
  // e.g. URF corner has U, R, F stickers.
  stickers: Partial<Record<FaceKey, Color>>;
}

export function createSolvedCubies(): CubieData[] {
  const cubies: CubieData[] = [];
  let id = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const stickers: Partial<Record<FaceKey, Color>> = {};
        // Assign stickers based on initial position
        if (y === 1) stickers.U = 'W';
        if (y === -1) stickers.D = 'Y';
        if (x === 1) stickers.R = 'R';
        if (x === -1) stickers.L = 'O';
        if (z === 1) stickers.F = 'G';
        if (z === -1) stickers.B = 'B';

        cubies.push({ id: id++, x, y, z, stickers });
      }
    }
  }
  return cubies;
}

// Helper to check if a move string is valid
export function isValidMove(m: string): boolean {
    return /^[UDLRFB]['2]?$/.test(m) || ['x','y','z'].includes(m[0]);
}

// --- State Manipulation Helpers ---

export function createSolvedState(): CubeState {
  const cubies: Cubie[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const pos = { x: x as -1|0|1, y: y as -1|0|1, z: z as -1|0|1 };
        const faceColors: Partial<Record<FaceKey, Color>> = {};
        if (y === 1) faceColors.U = SOLVED_COLORS.U;
        if (y === -1) faceColors.D = SOLVED_COLORS.D;
        if (x === -1) faceColors.L = SOLVED_COLORS.L;
        if (x === 1) faceColors.R = SOLVED_COLORS.R;
        if (z === 1) faceColors.F = SOLVED_COLORS.F;
        if (z === -1) faceColors.B = SOLVED_COLORS.B;
        cubies.push({ id: `${x},${y},${z}`, pos, faceColors });
      }
    }
      }
  return { cubies };
}

// Basic rotations
function rotatePosAroundX(p: Vec3, dir: 1|-1): Vec3 {
  return dir === 1 ? { x: p.x, y: (-p.z) as -1|0|1, z: p.y } : { x: p.x, y: p.z, z: (-p.y) as -1|0|1 };
}
function rotatePosAroundY(p: Vec3, dir: 1|-1): Vec3 {
  return dir === 1 ? { x: p.z, y: p.y, z: (-p.x) as -1|0|1 } : { x: (-p.z) as -1|0|1, y: p.y, z: p.x };
}
function rotatePosAroundZ(p: Vec3, dir: 1|-1): Vec3 {
  return dir === 1 ? { x: (-p.y) as -1|0|1, y: p.x, z: p.z } : { x: p.y, y: (-p.x) as -1|0|1, z: p.z };
}

function rotateFaceKeysAroundX(keys: Partial<Record<FaceKey, Color>>, dir: 1|-1): Partial<Record<FaceKey, Color>> {
  const out: Partial<Record<FaceKey, Color>> = {};
  if (keys.R) out.R = keys.R;
  if (keys.L) out.L = keys.L;
  if (dir === 1) {
    if (keys.U) out.B = keys.U;
    if (keys.B) out.D = keys.B;
    if (keys.D) out.F = keys.D;
    if (keys.F) out.U = keys.F;
  } else {
    if (keys.U) out.F = keys.U;
    if (keys.F) out.D = keys.F;
    if (keys.D) out.B = keys.D;
    if (keys.B) out.U = keys.B;
  }
  return out;
}

function rotateFaceKeysAroundY(keys: Partial<Record<FaceKey, Color>>, dir: 1|-1): Partial<Record<FaceKey, Color>> {
  const out: Partial<Record<FaceKey, Color>> = {};
  if (keys.U) out.U = keys.U;
  if (keys.D) out.D = keys.D;
  if (dir === 1) {
    if (keys.F) out.R = keys.F;
    if (keys.R) out.B = keys.R;
    if (keys.B) out.L = keys.B;
    if (keys.L) out.F = keys.L;
  } else {
    if (keys.F) out.L = keys.F;
    if (keys.L) out.B = keys.L;
    if (keys.B) out.R = keys.B;
    if (keys.R) out.F = keys.R;
  }
  return out;
}

function rotateFaceKeysAroundZ(keys: Partial<Record<FaceKey, Color>>, dir: 1|-1): Partial<Record<FaceKey, Color>> {
  const out: Partial<Record<FaceKey, Color>> = {};
  if (keys.F) out.F = keys.F;
  if (keys.B) out.B = keys.B;
  if (dir === 1) {
    if (keys.U) out.R = keys.U;
    if (keys.R) out.D = keys.R;
    if (keys.D) out.L = keys.D;
    if (keys.L) out.U = keys.L;
  } else {
    if (keys.U) out.L = keys.U;
    if (keys.L) out.D = keys.L;
    if (keys.D) out.R = keys.D;
    if (keys.R) out.U = keys.R;
  }
  return out;
}

export function applyMove(state: CubeState, move: string): CubeState {
  const s = {
    cubies: state.cubies.map(c => ({ 
      id: c.id, 
      pos: { ...c.pos }, 
      faceColors: { ...c.faceColors } 
    }))
  };
  
  const token = move[0];
  const isPrime = move.endsWith("'");
  const isDouble = move.endsWith('2');
  const turns = isDouble ? 2 : 1;
  
  const isCubeRotation = token === 'x' || token === 'y' || token === 'z';
  let axis: 'x'|'y'|'z';
  let layer: -1|1 | null = null;
  let dir: 1|-1;
  if (isCubeRotation) {
    axis = token as 'x'|'y'|'z';
    dir = (isPrime ? -1 : 1);
  } else {
    const face = token as FaceKey;
    axis = (face === 'U' || face === 'D') ? 'y' : (face === 'L' || face === 'R') ? 'x' : 'z';
    layer = (face === 'U' || face === 'R' || face === 'F') ? 1 : -1;
    const baseDir: 1|-1 = (face === 'R' || face === 'U' || face === 'F') ? 1 : -1;
    dir = (isPrime ? -baseDir : baseDir) as 1|-1;
  }
  
  for (let t = 0; t < turns; t++) {
    for (const cubie of s.cubies) {
      const inLayer = isCubeRotation 
        ? true 
        : (axis === 'x' && cubie.pos.x === layer) ||
          (axis === 'y' && cubie.pos.y === layer) ||
          (axis === 'z' && cubie.pos.z === layer);
      if (!inLayer) continue;
      
      if (axis === 'x') {
        cubie.pos = rotatePosAroundX(cubie.pos, dir);
        cubie.faceColors = rotateFaceKeysAroundX(cubie.faceColors, dir);
      } else if (axis === 'y') {
        cubie.pos = rotatePosAroundY(cubie.pos, dir);
        cubie.faceColors = rotateFaceKeysAroundY(cubie.faceColors, dir);
      } else {
        cubie.pos = rotatePosAroundZ(cubie.pos, dir);
        cubie.faceColors = rotateFaceKeysAroundZ(cubie.faceColors, dir);
    }
  }
  }
  
  return s;
}

export function applyMoves(state: CubeState, moves: string[]): CubeState {
  return moves.reduce((acc, m) => applyMove(acc, m), state);
}

export function isCrossSolved(state: CubeState, face: 'D'|'U' = 'D'): boolean {
  const faceColor = SOLVED_COLORS[face];
  const layerY = face === 'D' ? -1 : 1;
  const edges = state.cubies.filter(c => c.pos.y === layerY && Math.abs(c.pos.x) + Math.abs(c.pos.z) === 1);
  return edges.every(e => e.faceColors[face] === faceColor && 
    Object.keys(e.faceColors).length === 2 && // is Edge
    // Check matching side center
    Object.keys(e.faceColors).every(k => k===face || e.faceColors[k as FaceKey] === SOLVED_COLORS[k as FaceKey])
  );
}

export function isFirstTwoLayersSolved(state: CubeState): boolean {
  for (const c of state.cubies) {
    if (c.pos.y === 1) continue;
    for (const k of Object.keys(c.faceColors) as FaceKey[]) {
      if (c.faceColors[k]! !== SOLVED_COLORS[k]) return false;
    }
  }
  return true;
}

export function isOLLSolved(state: CubeState): boolean {
  const up = state.cubies.filter(c => c.pos.y === 1);
  return up.every(c => c.faceColors.U === SOLVED_COLORS.U);
}
