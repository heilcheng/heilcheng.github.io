# Personal Portfolio & Digital Garden

Interactive portfolio built with Next.js 14, featuring knowledge graphs, 3D visualizations, and geospatial maps. Live at [heilcheng.github.io](https://heilcheng.github.io).

## Key Features

### Knowledge Graph Architecture
D3.js-powered force-directed graphs that visualize semantic relationships:
- Portfolio sections graph with content-based linking
- Blog posts graph with automatic connection generation
- Interactive navigation with drag, zoom, and smooth scrolling
- Collision detection and optimized force simulation parameters

### Geospatial Visualizations
- World map with visited countries using react-simple-maps and TopoJSON
- Interactive Hong Kong spots map built with React Leaflet

### Dynamic Content System
- MDX blog with syntax highlighting
- GitHub contributions visualization
- Real-time data fetching with Next.js App Router

## Tech Stack

**Core**: Next.js 14 (App Router), TypeScript, React 18

**Styling**: Tailwind CSS, shadcn/ui, Framer Motion, Magic UI

**Visualization**: D3.js, React Leaflet, react-simple-maps

**3D**: Three.js, React Three Fiber, @react-three/drei

**Content**: MDX, gray-matter, next-mdx-remote

**Tools**: pnpm, ESLint, PostCSS

## Project Structure

```
src/
├── app/                        # Next.js pages
│   ├── page.tsx                # Homepage with knowledge graph
│   ├── blog/                   # Blog and posts
│   └── showcase/               # 3D experiments
├── components/
│   ├── home-graph.tsx          # Portfolio knowledge graph
│   ├── blog-graph.tsx          # Blog knowledge graph
│   ├── hong-kong-map.tsx       # Interactive maps
│   └── magicui/                # Animation components
├── data/                       # Resume and blog metadata
└── lib/                        # Utilities
content/                        # MDX blog posts
```

## Implementation Highlights

**Force Simulation**: Custom D3 parameters with variable link distances, collision detection, and alpha decay tuning

**Static Export**: Next.js configuration for GitHub Pages with image optimization and asset management

**Type Safety**: Strongly-typed data layer with const assertions and discriminated unions

**Performance**: Code splitting, lazy loading, intersection observers, memoized calculations

## Development

```bash
pnpm install       # Install dependencies
pnpm dev           # Start dev server
pnpm build         # Build for production
pnpm lint          # Run linter
```

## Deployment

Automated via GitHub Actions: push to `main` triggers build and deployment to GitHub Pages.

## License

MIT License. Use as inspiration, but please don't copy content directly.

## Acknowledgments

Design inspiration from tech community portfolios, 3D models from Sketchfab, TopoJSON from Natural Earth, Magic UI components.
