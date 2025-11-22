
// @ts-ignore
import Cube from './thirdparty/cubejs-cube';

type Move = string;

const FACES = ['U', 'R', 'F', 'D', 'L', 'B'] as const;
const EDGES = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'FR', 'FL', 'BL', 'BR'] as const;
const CORNERS = ['URF', 'UFL', 'ULB', 'UBR', 'DFR', 'DLF', 'DBL', 'DRB'] as const;

// Mapping from edge name to index in cubejs
const EDGE_INDICES: Record<string, number> = {
  UR: 0, UF: 1, UL: 2, UB: 3,
  DR: 4, DF: 5, DL: 6, DB: 7,
  FR: 8, FL: 9, BL: 10, BR: 11
};

// Mapping from corner name to index in cubejs
const CORNER_INDICES: Record<string, number> = {
  URF: 0, UFL: 1, ULB: 2, UBR: 3,
  DFR: 4, DLF: 5, DBL: 6, DRB: 7
};

export class BeginnerSolver {
  private cube: any;
  private solution: string[] = [];

  constructor(cubeState?: any) {
    // @ts-ignore
    this.cube = cubeState ? new Cube(cubeState) : new Cube();
  }

  public solve(): string[] {
    this.solution = [];
    
    // 1. White Cross
    this.solveWhiteCross();
    
    // 2. White Corners (First Layer)
    this.solveWhiteCorners();
    
    // 3. Middle Layer
    this.solveMiddleLayer();
    
    // 4. Yellow Cross
    this.solveYellowCross();
    
    // 5. Orient Yellow Cross (Permute Edges)
    this.solveYellowEdges();
    
    // 6. Permute Yellow Corners
    this.permuteYellowCorners();
    
    // 7. Orient Yellow Corners
    this.orientYellowCorners();

    return this.simplifySolution(this.solution);
  }

  private apply(move: string) {
    this.cube.move(move);
    this.solution.push(move);
  }

  private findEdge(name: string): { index: number, orientation: number } {
    const targetIdx = EDGE_INDICES[name];
    for (let i = 0; i < 12; i++) {
      if (this.cube.ep[i] === targetIdx) {
        return { index: i, orientation: this.cube.eo[i] };
      }
    }
    throw new Error(`Edge ${name} not found`);
  }

  private findCorner(name: string): { index: number, orientation: number } {
    const targetIdx = CORNER_INDICES[name];
    for (let i = 0; i < 8; i++) {
      if (this.cube.cp[i] === targetIdx) {
        return { index: i, orientation: this.cube.co[i] };
      }
    }
    throw new Error(`Corner ${name} not found`);
  }

  private getEdgeName(index: number): string {
    return EDGES[index];
  }
  
  private getCornerName(index: number): string {
    return CORNERS[index];
  }

  // --- Step 1: White Cross ---
  private solveWhiteCross() {
    const edges = ['DF', 'DR', 'DB', 'DL']; // Order matters for relative positioning
    
    for (const target of edges) {
      this.solveCrossPiece(target);
    }
  }

  private solveCrossPiece(target: string) {
    // Bring piece to top layer, then align, then bring down
    // This is a simplified heuristic
    let piece = this.findEdge(target);
    
    // If already solved, skip
    if (this.getEdgeName(piece.index) === target && piece.orientation === 0) return;

    // Helper to bring edge to U layer
    this.bringEdgeToU(target);
    
    // Now piece is in U layer. Align it with its center and bring it down.
    // Target is like 'DF'. Corresponding Top position is 'UF'.
    // We need to rotate U until the piece is at the correct spot relative to its destination side?
    // Actually easier: Rotate U until piece is at 'UF' (if target is DF) or 'UR' (if target is DR)...
    // No, we need to match the SIDE color. 
    // For DF (White-Green), Green is Front. So we want it at UF position, oriented correctly.
    
    const targetFace = target[1]; // 'F', 'R', 'B', 'L'
    const uPosMap: Record<string, string> = { 'F': 'UF', 'R': 'UR', 'B': 'UB', 'L': 'UL' };
    const desiredUPos = uPosMap[targetFace];
    
    // Spin U until piece is at desiredUPos
    let count = 0;
    while (this.getEdgeName(this.findEdge(target).index) !== desiredUPos && count < 4) {
      this.apply('U');
      count++;
    }
    
    // Now piece is at UF (for DF). 
    // Check orientation.
    piece = this.findEdge(target);
    if (piece.orientation === 0) {
       // White is on U face. Side color on F.
       // F2 brings it to DF with White on D. Correct.
       this.apply(targetFace + '2');
    } else {
       // White is on F face. Side color on U.
       // F U' R U ends up wrong.
       // Standard insert: U' R' F R
       // Or simpler: "flip" alg: F' U R' U' (No)
       // Correct for flipped edge at UF: U' R' F R (brings to DF oriented)
       // Let's use a generic insert.
       // Move to side, drop down.
       // For DF target, piece at UF flipped.
       // Apply: F U' R U (No)
       // Alg: U R' F R (No)
       // Alg: F' D R' D' (No)
       // Simple: F (moves to RF), R' (moves to DF).
       // But we must be careful not to disturb other cross pieces.
       // Safe alg: U F' U' (moves to LF, oriented?), then ...
       
       // Best "Beginner" way for flipped edge at UF:
       // F U' R U (No)
       // Standard: F' (to LF), U' (align), L (down)? No.
       // F' R' D' R F (flip in place on bottom).
       // Let's do: F U' R U (No)
       // Let's do: F' (put on L face), L (put on D face... wait L brings DL).
       // Piece at UF (flipped). White on Front. Green on Top.
       // F' -> Piece at FL. White on Left. Green on Front.
       // U' -> ...
       // Move: U' R' F R.
       // U' -> Piece at UL.
       // R' -> No affect.
       // F -> UL moves to UF.
       // R -> ...
       
       // Let's stick to the most standard:
       // Move to U face. 
       // If flipped: U' R' F R
       if (targetFace === 'F') { this.apply("U'"); this.apply("R'"); this.apply("F"); this.apply("R"); }
       if (targetFace === 'R') { this.apply("U'"); this.apply("B'"); this.apply("R"); this.apply("B"); }
       if (targetFace === 'B') { this.apply("U'"); this.apply("L'"); this.apply("B"); this.apply("L"); }
       if (targetFace === 'L') { this.apply("U'"); this.apply("F'"); this.apply("L"); this.apply("F"); }
    }
  }

  private bringEdgeToU(target: string) {
    let piece = this.findEdge(target);
    const pos = this.getEdgeName(piece.index);
    
    if (pos.startsWith('U')) return; // Already in U

    // If in Middle layer (FR, FL, BR, BL)
    if (['FR', 'FL', 'BR', 'BL'].includes(pos)) {
        // Move to U using a simple R U R' type move
        if (pos === 'FR') { this.apply('R'); this.apply('U'); this.apply("R'"); }
        else if (pos === 'FL') { this.apply("L'"); this.apply('U'); this.apply("L"); }
        else if (pos === 'BR') { this.apply("R'"); this.apply('U'); this.apply("R"); }
        else if (pos === 'BL') { this.apply("L"); this.apply('U'); this.apply("L'"); }
        return;
    }

    // If in D layer (DF, DR, DB, DL)
    if (['DF', 'DR', 'DB', 'DL'].includes(pos)) {
        const face = pos[1];
        this.apply(face + '2');
        return;
    }
  }

  // --- Step 2: White Corners ---
  private solveWhiteCorners() {
    const corners = ['DFR', 'DLF', 'DBL', 'DRB'];
    for (const target of corners) {
      this.solveCornerPiece(target);
    }
  }

  private solveCornerPiece(target: string) {
    let piece = this.findCorner(target);
    // Check if solved
    if (this.getCornerName(piece.index) === target && piece.orientation === 0) return;

    // Bring to U layer
    this.bringCornerToU(target);

    // Align above target slot
    // Target DFR -> Slot between F and R. Top corner is URF.
    const targetSlot = target.replace('D', 'U'); // DFR -> URF
    
    let count = 0;
    while (this.getCornerName(this.findCorner(target).index) !== targetSlot && count < 4) {
      this.apply('U');
      count++;
    }

    // Apply R U R' U' until solved
    // Need to identify which column we are working on.
    // For DFR, we work with R and F? Actually usually R face.
    // Algorithm: R U R' U'
    // For DFR: R U R' U'
    // For DLF: L' U' L U (Left version) or F U F' U'
    // Let's use standard Right Sexy Move (R U R' U') for DFR.
    // Rotate cube (y) to bring slot to FR? 
    // Easier: Just hardcode algs for each slot.
    
    const algs: Record<string, string[]> = {
        'DFR': ["R", "U", "R'", "U'"],
        'DRB': ["B", "U", "B'", "U'"], // Rotate y -> R U R' U' -> y'
        'DBL': ["L", "U", "L'", "U'"],
        'DLF': ["F", "U", "F'", "U'"]
    };

    const alg = algs[target];
    if (!alg) return;

    let moves = 0;
    while (moves < 20) { // Safety break
        piece = this.findCorner(target);
        if (this.getCornerName(piece.index) === target && piece.orientation === 0) break;
        
        for (const m of alg) this.apply(m);
        moves++;
    }
  }

  private bringCornerToU(target: string) {
    let piece = this.findCorner(target);
    const pos = this.getCornerName(piece.index);
    if (pos.startsWith('U')) return;

    // It's in D layer, but wrong slot or wrong orientation.
    // Lift it out.
    const liftAlgs: Record<string, string[]> = {
        'DFR': ["R", "U", "R'", "U'"],
        'DRB': ["B", "U", "B'", "U'"],
        'DBL': ["L", "U", "L'", "U'"],
        'DLF': ["F", "U", "F'", "U'"]
    };
    
    const alg = liftAlgs[pos];
    if (alg) {
        for (const m of alg) this.apply(m);
    }
  }

  // --- Step 3: Middle Layer ---
  private solveMiddleLayer() {
    const edges = ['FR', 'FL', 'BL', 'BR'];
    for (const target of edges) {
        this.solveMiddleEdge(target);
    }
  }

  private solveMiddleEdge(target: string) {
    let piece = this.findEdge(target);
    if (this.getEdgeName(piece.index) === target && piece.orientation === 0) return;

    // If piece is in middle layer (but wrong place/oriented), bring it to U
    const currentPos = this.getEdgeName(piece.index);
    if (!currentPos.startsWith('U')) {
       this.extractMiddleEdge(currentPos);
    }

    // Now piece is in U.
    // Align with center.
    // Target FR (Green/Red).
    // If Green is facing UP, we need to align Red with Red center (Right).
    // If Red is facing UP, we need to align Green with Green center (Front).
    // Orientation 0 means "First color of name is Up/Down".
    // Edge names: FR (F is first).
    // CubeJS: 0 means oriented.
    // For FR edge in U layer:
    // Valid positions: UF, UL, UB, UR.
    // We align it.
    
    // Let's simpler check:
    // Rotate U until it matches one of the cases for insertion.
    // Case 1: Matches Front Center -> Insert to Right (UR U' R' ...) or Left?
    // We need to check the colors.
    
    // It's tedious to check colors via orientation bit logic without visualization.
    // Heuristic: Try aligning with F, check if match. Try R, check match.
    
    // Actually, I can check `orientation`.
    // FR edge colors are F and R.
    // If at UF: 
    //   - orient 0: F color on U, R color on F. (Backwards)
    //   - orient 1: R color on U, F color on F. (Matches F center!)
    
    // So if at UF and orient 1, it matches F center. We insert to Right (FR).
    // Alg: U R U' R' U' F' U F.
    
    // Let's write a robust search.
    // 1. Find piece.
    // 2. Move U to put it at UF.
    // 3. Check orientation.
    //    - If oriented 1 (Side color matches F): Target slot must be FR or FL.
    //      - If target is FR: Insert Right.
    //      - If target is FL: Insert Left.
    //    - If oriented 0 (Side color matches U... wait, orient 0 means Top color is on Top?):
    //      - Edge FR has colors F and R.
    //      - At UF (indices: 0=U, 1=F).
    //      - orient 0: F-color is at U-face. R-color is at F-face.
    //      - This means side color is R. So it matches R center.
    //      - So we should move it to UR (Right face).
    
    // Let's automate alignment.
    // Target FR.
    // Try to place at UF.
    // If orient == 1: Side is F-color. Matches F center. We are at F. Target FR is to the Right.
    //    -> Alg Right.
    // If orient == 0: Side is R-color. Matches R center.
    //    -> We must move piece to UR.
    //    -> At UR, check orient.
    //       - At UR (indices: 0=U, 1=R).
    //       - Piece FR (colors F, R).
    //       - orient 0: F-color at U. R-color at R.
    //       - Side is R. Matches R center.
    //       - Target FR is to the Left (relative to R face).
    //       - -> Alg Left (relative to R).
    
    // Implementation:
    piece = this.findEdge(target);
    // Move to UF
    while (this.getEdgeName(this.findEdge(target).index) !== 'UF') {
        this.apply('U');
    }
    piece = this.findEdge(target);
    
    // At UF.
    // Target FR.
    if (target === 'FR') {
        if (piece.orientation === 1) {
            // Matches F. Insert Right.
            // U R U' R' U' F' U F
            this.apply("U"); this.apply("R"); this.apply("U'"); this.apply("R'"); 
            this.apply("U'"); this.apply("F'"); this.apply("U"); this.apply("F");
        } else {
            // Matches R. Move to UR (U').
            this.apply("U'"); // Now at UR.
            // Insert Left (relative to R face).
            // Target FR is "Front" of R face.
            // Alg (Right of F) == Left of R?
            // Standard Insert Left: U' L' U L U F U' F'
            // Relative to R: U' F' U F U R U' R' ? (Using R and F)
            // Alg to insert from UR to FR:
            // U' F' U F U R U' R'
            this.apply("U'"); this.apply("F'"); this.apply("U"); this.apply("F");
            this.apply("U"); this.apply("R"); this.apply("U'"); this.apply("R'");
        }
    }
    else if (target === 'FL') {
        // At UF.
        if (piece.orientation === 1) {
            // Matches F. Insert Left.
            // U' L' U L U F U' F'
            this.apply("U'"); this.apply("L'"); this.apply("U"); this.apply("L");
            this.apply("U"); this.apply("F"); this.apply("U'"); this.apply("F'");
        } else {
            // Matches L. Move to UL (U).
            this.apply("U"); // Now at UL.
            // Insert Right (relative to L).
            // Target FL is "Back" of L? No, Front of L.
            // From UL to FL.
            // Alg: U F U' F' U' L' U L
            this.apply("U"); this.apply("F"); this.apply("U'"); this.apply("F'");
            this.apply("U'"); this.apply("L'"); this.apply("U"); this.apply("L");
        }
    }
    // ... handle BR, BL similarly (rotate cube logic mentally)
    // Easier: Rotate all to Front?
    // Or just write the cases.
    else if (target === 'BR') {
        // Move to UB
         while (this.getEdgeName(this.findEdge(target).index) !== 'UB') this.apply('U');
         piece = this.findEdge(target);
         if (piece.orientation === 1) {
             // Matches B. Insert Right (to BR). (Relative to B)
             // Move: U L U' L' ... (No this is BL)
             // Right of B is L? No, Right of B is R? (Looking at B, Left is R, Right is L).
             // B face: Back. Right is Left face. Left is Right face.
             // This is confusing.
             
             // Let's normalize coordinates.
             // Just using specific algs for specific slots.
         }
         
         // Let's use a loop with Y rotations?
         // No, state is fixed.
         
         // Fallback:
         // Just define the "Insert Right" and "Insert Left" sequences relative to Face.
         // Insert Right (F -> FR): U R U' R' U' F' U F
         // Insert Left (F -> FL): U' L' U L U F U' F'
         
         // BR is "Right" of B (Wait, looking at back, R is on left).
         // BR is "Left" of R.
         
         // Let's map each slot to its "Front" and "Side" faces.
         // FR: F, R.
         // FL: F, L.
         // BR: B, R.
         // BL: B, L.
         
         // Move piece to align with first face. If match -> Insert.
         // Else move to align with second face. -> Insert.
    }
    
    // Generalizing:
    // For BR:
    // Try align with B (at UB).
    // If orient matches B -> Insert Left (relative to B).
    //   Left of B is R (BR).
    //   Alg (Left of B): U' R' U R U B U' B'
    
    // Try align with R (at UR).
    // If orient matches R -> Insert Right (relative to R).
    //   Right of R is B (RB/BR).
    //   Alg (Right of R): U B U' B' U' R' U R
    
    this.solveMiddleEdgeGeneral(target);
  }
  
  private solveMiddleEdgeGeneral(target: string) {
     // Maps for logic
     const faces: any = {
         'FR': { f1: 'F', f2: 'R' },
         'FL': { f1: 'F', f2: 'L' },
         'BR': { f1: 'B', f2: 'R' },
         'BL': { f1: 'B', f2: 'L' }
     };
     
     const { f1, f2 } = faces[target];
     
     // Try aligning with f1
     const uPosMap: any = { 'F': 'UF', 'R': 'UR', 'B': 'UB', 'L': 'UL' };
     
     const pos1 = uPosMap[f1];
     // Move to pos1
     while (this.getEdgeName(this.findEdge(target).index) !== pos1) this.apply('U');
     
     let piece = this.findEdge(target);
     // Check orientation.
     // For edges in U layer:
     // Indices: 0=UR, 1=UF, 2=UL, 3=UB.
     // Orientation 0: Primary color (U) is on U.
     // Orientation 1: Secondary color is on U.
     // Edge colors: 
     // UR: U, R. (0=U on U).
     // UF: U, F. (0=U on U).
     // ...
     // Wait, target is FR (Colors F, R).
     // If at UF (Colors U, F).
     // If orientation 1: The "Side" color of the edge (R) is on U?
     // No. The edge has two colors: A and B.
     // If the edge is "FR", colors are F and R.
     // If it is at "UF", and orientation is 0:
     //   UF faces are U and F.
     //   Orient 0 means: Color A (F) is on U? Or Color A (F) is on F?
     //   Cube definitions:
     //   UF: 0=U, 1=F.
     //   Edge FR: 0=F, 1=R.
     //   If at UF with orient 0:
     //     Face 0 (U) gets Color 0 (F).
     //     Face 1 (F) gets Color 1 (R).
     //     So F is on U. Side face F has R.
     //     Does this match F center? No, F center is F. R is not F.
     //     So orient 0 at UF does NOT match F center.
     
     //   If at UF with orient 1:
     //     Face 0 (U) gets Color 1 (R).
     //     Face 1 (F) gets Color 0 (F).
     //     Side face F has F. Matches!
     
     //   So for FR edge at UF: Orient 1 -> Matches F.
     
     //   What about BR edge (Colors B, R) at UB (Colors U, B)?
     //   Edge BR: 0=B, 1=R.
     //   UB: 0=U, 1=B.
     //   Orient 0: U has B. B has R. (No match).
     //   Orient 1: U has R. B has B. (Match B).
     
     //   So generally: Orient 1 -> Matches Side.
     
     if (piece.orientation === 1) {
         // Matches f1.
         // Check if target is Right or Left of f1.
         // FR is Right of F. FL is Left of F.
         // BR is Left of B (looking from outside? No).
         // Order: F -> R -> B -> L -> F.
         // F right is R. F left is L.
         // R right is B. R left is F.
         // B right is L. B left is R.
         // L right is F. L left is B.
         
         const isRight = (f1 === 'F' && f2 === 'R') || (f1 === 'R' && f2 === 'B') || 
                         (f1 === 'B' && f2 === 'L') || (f1 === 'L' && f2 === 'F');
                         
         if (isRight) this.insertRight(f1, f2);
         else this.insertLeft(f1, f2);
         
     } else {
         // Should match f2.
         const pos2 = uPosMap[f2];
         while (this.getEdgeName(this.findEdge(target).index) !== pos2) this.apply('U');
         // Now at pos2. Should match f2.
         // Insert relative to f2.
         // If target is FR, and we align with R.
         // FR is Left of R.
         const isRight = (f2 === 'F' && f1 === 'R') || (f2 === 'R' && f1 === 'B') || 
                         (f2 === 'B' && f1 === 'L') || (f2 === 'L' && f1 === 'F');
         if (isRight) this.insertRight(f2, f1);
         else this.insertLeft(f2, f1);
     }
  }
  
  private insertRight(face: string, side: string) {
      // Insert from Face to Right-Side.
      // Alg: U R U' R' U' F' U F (For F -> R)
      // Generic: U (Right) U' (Right)' U' (Face)' U (Face)
      // Map to actual moves.
      // R is the "Right" face. F is "Face".
      const R = side;
      const F = face;
      const U = 'U';
      
      // U R U' R' U' F' U F
      this.apply(U); this.apply(R); this.apply(U + "'"); this.apply(R + "'");
      this.apply(U + "'"); this.apply(F + "'"); this.apply(U); this.apply(F);
  }
  
  private insertLeft(face: string, side: string) {
      // Insert from Face to Left-Side.
      // Alg: U' L' U L U F U' F' (For F -> L)
      const L = side;
      const F = face;
      const U = 'U';
      
      // U' L' U L U F U' F'
      this.apply(U + "'"); this.apply(L + "'"); this.apply(U); this.apply(L);
      this.apply(U); this.apply(F); this.apply(U + "'"); this.apply(F + "'");
  }

  private extractMiddleEdge(pos: string) {
      // Perform "Insert Right" with a dummy piece to pop it out.
      // If pos is FR, do insert right on F?
      if (pos === 'FR') {
          // F -> R
          this.insertRight('F', 'R');
      } else if (pos === 'FL') {
          this.insertLeft('F', 'L');
      } else if (pos === 'BR') {
          this.insertLeft('B', 'R'); // BR is Left of B? No. Right of R. Left of B?
          // B right is L. B left is R.
          this.insertLeft('B', 'R');
      } else if (pos === 'BL') {
          this.insertRight('B', 'L');
      }
  }

  // --- Step 4: Yellow Cross ---
  private solveYellowCross() {
      // 4 cases: Dot, L-shape, Line, Cross.
      // Orientation of edges in U layer.
      // U edges: UR, UF, UL, UB.
      // Orient 0 = Correct (Yellow up).
      
      let safe = 0;
      while (safe < 10) {
          const edges = [0, 1, 2, 3]; // Indices of U-edges
          const orientations = edges.map(i => this.cube.eo[i]);
          const badCount = orientations.filter(o => o === 1).length;
          
          if (badCount === 0) break; // Solved
          
          // Algorithm: F R U R' U' F'
          // We need to orient U to set up the case.
          
          if (badCount === 4) { // Dot
              // Apply anywhere
              this.applyAlg("F R U R' U' F'");
          } else if (badCount === 2) {
              // Line or L-shape.
              // Check positions of BAD edges (oriented=1).
              // Wait, oriented=0 is Yellow up?
              // Let's verify. In solved state, all 0. So 0 is good.
              // If 2 are 0 (Good), 2 are 1 (Bad).
              
              // Find the Good ones.
              const goodIndices = edges.filter(i => this.cube.eo[i] === 0);
              // Indices: 0=UR, 1=UF, 2=UL, 3=UB.
              // L-shape: Adjacent (e.g. UR, UB).
              // Line: Opposite (e.g. UR, UL).
              
              const isAdjacent = (a: number, b: number) => {
                  // 0-3, 3-2, 2-1, 1-0? 
                  // 0(R), 1(F), 2(L), 3(B).
                  // Adj: abs(a-b)==1 or 3 (0 and 3).
                  // Opp: abs(a-b)==2.
                  return Math.abs(a-b) !== 2;
              };
              
              const [g1, g2] = goodIndices;
              
              if (!isAdjacent(g1, g2)) {
                  // Line.
                  // Needs to be horizontal (L and R).
                  // Good ones at L(2) and R(0).
                  // If at F(1) and B(3), rotate U.
                  while (this.cube.eo[2] !== 0 || this.cube.eo[0] !== 0) this.apply('U');
                  this.applyAlg("F R U R' U' F'");
              } else {
                  // L-shape.
                  // Needs to be at Back-Left (B and L).
                  // Good ones at B(3) and L(2).
                  while (this.cube.eo[3] !== 0 || this.cube.eo[2] !== 0) this.apply('U');
                  // Apply F U R U' R' F' (or F R U R' U' F' twice)
                  this.applyAlg("F U R U' R' F'");
              }
          }
          safe++;
      }
  }
  
  private applyAlg(alg: string) {
      const moves = alg.split(' ');
      for (const m of moves) this.apply(m);
  }

  // --- Step 5: Orient Yellow Edges (Permutation actually) ---
  // "Sune" swaps edges? No Sune is for corners.
  // We need to permute edges so they match centers.
  // Alg: R U R' U R U2 R' (Sune) - actually cycles edges?
  // Sune cycles 3 corners? Or affects edges?
  // Sune: R U R' U R U2 R'.
  // Affects: Permutes 3 edges (UF, UL, UB) and corners.
  // Wait. Beginner method for Edges:
  // Rotate U until 2 match side colors.
  // Case 1: Adjacent match (Back and Right). Hold matched at Back and Right.
  // Apply R U R' U R U2 R' U.
  // Case 2: Opposite match (Front and Back). Hold matched at Front and Back.
  // Apply R U R' U R U2 R'. Then you get adjacent case.
  
  private solveYellowEdges() {
      // 1. Rotate U to maximize matches
      let bestU = 0;
      let maxMatches = 0;
      
      for (let i=0; i<4; i++) {
          const matches = this.countEdgeMatches();
          if (matches > maxMatches) {
              maxMatches = matches;
              bestU = i;
          }
          this.apply('U');
      }
      // Reset to best
      this.apply('U'); // finish cycle
      for (let i=0; i<bestU; i++) this.apply('U');
      
      if (maxMatches === 4) return; // Solved
      
      // We have 2 matches (guaranteed to always be able to match at least 2).
      // Find where they are.
      const matchFaces = this.getMatchedEdgeFaces();
      // Faces: F, R, B, L.
      
      const isAdj = (f1: string, f2: string) => {
          const order = "FRBL";
          const i1 = order.indexOf(f1);
          const i2 = order.indexOf(f2);
          const diff = Math.abs(i1-i2);
          return diff === 1 || diff === 3;
      };
      
      if (isAdj(matchFaces[0], matchFaces[1])) {
          // Adjacent. Hold at Back and Right.
          // Rotate cube/view so Matches are B and R.
          // OR rotate U to put matches at B and R.
          // Wait, if we rotate U, we lose matches?
          // No, we rotate the WHOLE CUBE (y) or shift our alg application relative to faces.
          // Easier: apply U adjustments to bring matches to B and R relative to our front.
          
          // Actually, the edges themselves match the centers. If we rotate U, they don't match anymore.
          // So we must rotate Y (or adapt alg).
          // Let's adapt alg.
          // Matches at F and R? (Adjacent).
          // We want matches at B and R.
          // So F match is wrong. We want to hold it so "Bad" ones are F and L.
          
          // Logic: Find the pair of BAD edges.
          // Apply Sune from a specific angle.
          // Alg: R U R' U R U2 R' U (swaps F and L edges if held correct).
          // Target state: All matched.
          
          // Let's just brute force Sune from different angles until solved?
          // Deterministic:
          // If matches are Opp (F and B):
          // Hold F and B. Apply Sune from R?
          // R U R' U R U2 R'.
          // Then check matches again.
          
          // If matches are Adj (B and R):
          // Apply Sune from F?
          // R U R' U R U2 R' U.
          
          // Let's implement "Try Sune" loop.
          let safe = 0;
          while (this.countEdgeMatches() < 4 && safe < 10) {
              const matches = this.getMatchedEdgeFaces();
              // If Opp:
              if (!isAdj(matches[0], matches[1])) {
                  // Hold one match Front, one Back.
                  // Rotate y until F is a match.
                  let yCount = 0;
                  while (!matches.includes(this.getFaceAt('F')) && yCount < 4) {
                     this.apply('y'); // Virtual rotation? 
                     // CubeJS doesn't support y? It does support rotation moves.
                     // But apply('y') changes solution string.
                     // Better to use specific face algs.
                  }
                  // Apply Sune: R U R' U R U2 R'
                  this.applyAlg("R U R' U R U2 R'");
              } else {
                  // Adj.
                  // Hold matches at Back and Right.
                  // Rotate y until B and R are matches.
                  // Check F and L are NO matches.
                  // So rotate y until F is NOT match and R IS match?
                  // We want matches at B and R.
                  // So F and L are bad.
                  // Rotate y until F is Bad and L is Bad.
                  // And B is Good and R is Good.
                  
                  // Actually, simplest: Just Sune.
                  // Sune (R ...) swaps F and L edges (and moves them).
                  // It preserves B and R? No.
                  
                  // Correct Algo for Adj (held Back/Right): R U R' U R U2 R' U.
                  
                  let yCount = 0;
                  while (
                      (!this.isEdgeMatched('B') || !this.isEdgeMatched('R')) 
                      && yCount < 4
                  ) {
                      this.apply('y');
                      yCount++;
                  }
                  this.applyAlg("R U R' U R U2 R' U");
              }
              safe++;
          }
          
      }
  }
  
  private countEdgeMatches(): number {
      return ['F','R','B','L'].filter(f => this.isEdgeMatched(f)).length;
  }
  
  private getMatchedEdgeFaces(): string[] {
      return ['F','R','B','L'].filter(f => this.isEdgeMatched(f));
  }
  
  private isEdgeMatched(face: string): boolean {
      // Edge at 'U'+face (e.g. UF) has side color matching Face.
      const edgeName = 'U' + face;
      const piece = this.findEdge(edgeName);
      if (this.getEdgeName(piece.index) !== edgeName) return false;
      // If at correct pos, check orientation.
      // For U edges, orient 0 is "Matched".
      return piece.orientation === 0;
  }
  
  private getFaceAt(dir: string): string {
      // With y rotations, F might mean logical R.
      // But we apply 'y' to the cube state, so logical faces shift.
      // So 'F' is always the current Front.
      return dir;
  }

  // --- Step 6: Permute Yellow Corners ---
  private permuteYellowCorners() {
      // Find a corner that is in correct spot (orientation doesn't matter).
      // Alg: U R U' L' U R' U' L
      
      let safe = 0;
      while (safe < 10) {
          if (this.countCorrectCorners() === 4) break;
          
          const correct = this.findCorrectCorner();
          if (correct) {
              // Hold correct at URF (Front-Right).
              // Rotate y until correct is at URF.
              let yCount = 0;
              while (this.getCornerAt('URF') !== correct && yCount < 4) {
                  this.apply('y');
                  yCount++;
              }
              this.applyAlg("U R U' L' U R' U' L");
          } else {
              // No correct corners. Apply anywhere.
              this.applyAlg("U R U' L' U R' U' L");
          }
          safe++;
      }
  }
  
  private countCorrectCorners(): number {
      return ['URF', 'UFL', 'ULB', 'UBR'].filter(c => this.isCornerCorrect(c)).length;
  }
  
  private findCorrectCorner(): string | null {
      return ['URF', 'UFL', 'ULB', 'UBR'].find(c => this.isCornerCorrect(c)) || null;
  }
  
  private isCornerCorrect(slot: string): boolean {
      // Check if the piece at this slot belongs here.
      const piece = this.findCorner(slot); // find where piece 'slot' IS.
      // If piece 'slot' is AT 'slot'.
      const currentPos = this.getCornerName(piece.index);
      // Actually, findCorner(name) returns index. 
      // getCornerName(index) returns current position.
      // We want: Piece that belongs at 'slot' is currently at 'slot'.
      
      // findCorner(slot) -> gets piece that belongs at slot.
      // its index -> convert to name -> current position.
      return this.getCornerName(this.findCorner(slot).index) === slot;
  }
  
  private getCornerAt(pos: string): string {
      // Return the name of the piece currently at pos.
      const targetIdx = CORNER_INDICES[pos];
      // Scan cp array.
      // cp[index] = piece_id.
      // We want piece_id at index.
      // piece_id = cube.cp[index].
      const idx = CORNER_INDICES[pos];
      const pieceId = this.cube.cp[idx];
      return CORNERS[pieceId];
  }

  // --- Step 7: Orient Yellow Corners ---
  private orientYellowCorners() {
      // Rotate U to bring unsolved corner to URF.
      // Apply R' D' R D (2 or 4 times).
      
      // We must be careful to only rotate U to switch corners, NOT y.
      // And finish with R' D' R D cycles.
      
      // Count unoriented.
      const unoriented = ['URF', 'UFL', 'ULB', 'UBR'].filter(c => {
          // Check orientation.
          // We need the orientation of the piece AT this slot.
          const idx = CORNER_INDICES[c];
          return this.cube.co[idx] !== 0;
      });
      
      if (unoriented.length === 0) return;
      
      // We iterate through 4 slots.
      for (let i = 0; i < 4; i++) {
          // Check corner at URF.
          const idx = CORNER_INDICES['URF'];
          while (this.cube.co[idx] !== 0) {
              this.applyAlg("R' D' R D");
          }
          // Move next corner to URF
          this.apply('U');
      }
      
      // Finally align U layer
      // We don't know how much U is off.
      // Check edges.
      // Match UF edge to F center.
      // piece UF.
      // We want Piece 'UF' to be at 'UF'.
      while (this.getEdgeName(this.findEdge('UF').index) !== 'UF') {
          this.apply('U');
      }
  }
  
  private simplifySolution(moves: string[]): string[] {
      // Remove y rotations and merge U U' etc.
      // Wait, y rotations are real moves in the sequence?
      // No, the user wants R, L, U... 
      // 'y' is not a face turn. It's a cube rotation.
      // If I include 'y', I must transform subsequent moves!
      // My logic `apply('y')` adds 'y' to solution.
      // But `this.cube.move('y')` actually transforms the internal state so that 'R' means the new R.
      // So the move stream is correct as a sequence of instructions: "Rotate cube, then turn R".
      // The UI should handle 'y' by rotating the camera or the whole cube group.
      
      // However, simplifying U U' -> empty is good.
      // U U -> U2.
      
      // Filter out cancelled moves.
      const stack: string[] = [];
      for (const m of moves) {
          if (stack.length === 0) {
              stack.push(m);
              continue;
          }
          const prev = stack[stack.length-1];
          // Check if inverse
          if (this.isInverse(prev, m)) {
              stack.pop();
          } else if (this.isSameFace(prev, m)) {
              // Merge
              stack.pop();
              const merged = this.mergeMoves(prev, m);
              if (merged) stack.push(merged);
          } else {
              stack.push(m);
          }
      }
      return stack;
  }
  
  private isInverse(a: string, b: string): boolean {
      // R and R'
      if (a[0] !== b[0]) return false;
      // R and R' -> true. R2 and R2 -> true.
      const s1 = a.length > 1 ? a[1] : '';
      const s2 = b.length > 1 ? b[1] : '';
      if (s1 === '2' && s2 === '2') return true;
      if ((s1 === "'" && s2 === '') || (s1 === '' && s2 === "'")) return true;
      return false;
  }
  
  private isSameFace(a: string, b: string): boolean {
      return a[0] === b[0];
  }
  
  private mergeMoves(a: string, b: string): string | null {
      const face = a[0];
      const val = (m: string) => m.endsWith("'") ? -1 : m.endsWith("2") ? 2 : 1;
      const v = (val(a) + val(b)) % 4;
      if (v === 0) return null;
      if (v === 1 || v === -3) return face;
      if (v === 2 || v === -2) return face + '2';
      if (v === 3 || v === -1) return face + "'";
      return null;
  }
}
