import dynamic from "next/dynamic";

const TorusMugMorph = dynamic(() => import("@/components/torus-mug-morph"), { ssr: false });
const ProteinFolding = dynamic(() => import("@/components/protein-folding").then(mod => mod.default), { ssr: false });
const RubiksCube = dynamic(() => import("@/components/rubiks-cube"), { ssr: false });
const Pokeball3D = dynamic(() => import("@/components/pokeball").then(mod => mod.Pokeball3D), { ssr: false });

export default function ShowcasePage() {
  return (
    <main className="flex flex-col min-h-[100dvh] py-section-md">
      <section className="mb-section-lg">
        <div className="space-y-content-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Torus ↔ Mug Morph</h1>
        <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Interactive 3D morphing between a torus (doughnut) and a coffee mug, demonstrating their topological equivalence.
        </p>
            </div>
      </div>
      <TorusMugMorph />
        </div>
      </section>
      
      <section className="mb-section-lg">
        <div className="space-y-content-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Protein Folding Visualization</h1>
        <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Interactive 3D visualization of protein folding from unfolded polypeptide chain to functional 3D structure.
        </p>
            </div>
      </div>
      <ProteinFolding />
        </div>
      </section>
      
      <section className="mb-section-lg">
        <div className="space-y-content-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Rubik&apos;s Cube Solver</h1>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Interactive 3D Rubik&apos;s Cube with CFOP solving algorithm featuring Cross, F2L, OLL, and PLL stages.
              </p>
            </div>
          </div>
          <RubiksCube />
        </div>
      </section>

      <section className="mb-section-lg">
        <div className="space-y-content-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">3D Pokeball</h1>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A high-quality, interactive 3D Pokeball with animations and lighting effects.
              </p>
            </div>
          </div>
          <div className="h-[600px] w-full flex items-center justify-center">
            <Pokeball3D />
          </div>
        </div>
      </section>
    </main>
  );
} 