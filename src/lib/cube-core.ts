
export type Color = 'W'|'Y'|'O'|'R'|'G'|'B';
export type FaceKey = 'U'|'D'|'L'|'R'|'F'|'B';

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
