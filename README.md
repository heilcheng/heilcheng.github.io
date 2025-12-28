# Personal Portfolio & Digital Garden

A modern, interactive portfolio built with Next.js 14, featuring dynamic visualizations, 3D experiences, and a knowledge graph architecture. Live at [heilcheng.github.io](https://heilcheng.github.io).

## Architecture Highlights

### Obsidian-Style Knowledge Graph
An interactive force-directed graph built with D3.js that maps semantic relationships between portfolio sections. Features include:
- Content-based semantic linking between sections (not just tag-based)
- Real-time node dragging and zoom/pan controls
- Sidebar navigation with category organization
- Hover interactions with connection highlighting
- Smooth scroll-to-section on node click

Implementation uses D3's force simulation with custom link strength calculations and collision detection for optimal layout.

### Blog Knowledge Graph
Similar graph architecture applied to blog content, automatically generating connections based on:
- Explicit content relationships defined via semantic mapping
- Shared tags and categories
- External Medium post integration
- Dynamic filtering and search capabilities

### 3D Interactive Components
Built with Three.js and React Three Fiber:
- **Protein Folding Visualization**: Displays protein structures with pLDDT confidence coloring, inspired by AlphaFold's output format
- **Topology Morphing**: Real-time animation demonstrating homeomorphism (torus to coffee mug transformation)
- **3D Model Viewer**: Custom GLTF loader with orbit controls and environment mapping
- **Usagi 3D**: Interactive rabbit mascot with mouse-tracking rotation

### Geospatial Visualizations
- **World Map**: Built with react-simple-maps and TopoJSON, highlighting visited countries with custom styling
- **Hong Kong Spots**: Interactive Leaflet map with custom markers for personal recommendations, featuring tile layers and popup information

### Dynamic Content System
- MDX-based blog with syntax highlighting and custom components
- Automated GitHub contribution graph using GitHub API
- Real-time data fetching with Next.js App Router
- Server-side rendering for optimal SEO

## Tech Stack

### Core Framework
- **Next.js 14** (App Router) - React framework with static export for GitHub Pages
- **TypeScript** - Type-safe development
- **React 18** - Latest React features including Server Components

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **shadcn/ui** - Re-usable component library built on Radix UI
- **Framer Motion** - Production-ready animation library
- **Magic UI** - Custom animation components (BlurFade, Orbiting Circles, Dock)

### Data Visualization
- **D3.js** - Force-directed graphs and data-driven DOM manipulation
- **React Leaflet** - Interactive maps with custom tile layers
- **react-simple-maps** - Geographic data visualization with TopoJSON

### 3D Graphics
- **Three.js** - WebGL 3D rendering engine
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F (OrbitControls, Float, ContactShadows)
- **@react-three/fiber** - Declarative 3D scene management

### Content & Data
- **MDX** - Markdown with JSX for rich blog content
- **gray-matter** - Front matter parsing for blog metadata
- **next-mdx-remote** - MDX rendering in Next.js

### Development Tools
- **pnpm** - Fast, disk-efficient package manager
- **ESLint** - Code linting with Next.js config
- **PostCSS** - CSS processing for Tailwind
- **TypeScript** - Static type checking

## Project Structure

```
heilcheng.github.io/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage with knowledge graph
│   │   ├── blog/               # Blog listing and post pages
│   │   └── showcase/           # 3D experiments showcase
│   ├── components/             # React components
│   │   ├── home-graph.tsx      # Portfolio knowledge graph
│   │   ├── blog-graph.tsx      # Blog knowledge graph
│   │   ├── usagi.tsx           # 3D rabbit component
│   │   ├── protein-folding.tsx # AlphaFold-inspired viz
│   │   ├── torus-mug-morph.tsx # Topology animation
│   │   ├── hong-kong-map.tsx   # Interactive HK map
│   │   ├── world-map.tsx       # Visited countries viz
│   │   └── magicui/            # Custom animation components
│   ├── data/                   # Static data and content
│   │   ├── resume.tsx          # Experience and education data
│   │   ├── blog.ts             # Blog post metadata
│   │   └── medium-posts.ts     # External blog integration
│   └── lib/                    # Utility functions
│       ├── cube-solver.ts      # Rubik's cube algorithm
│       ├── beginner-solver.ts  # Cube solving methods
│       └── utils.ts            # General utilities
├── content/                    # MDX blog posts
├── public/                     # Static assets
└── .github/workflows/          # CI/CD automation
```

## Notable Implementation Details

### Force Simulation Optimization
The knowledge graphs use custom force parameters tuned for readability:
- Link distance varies by connection type (content vs tag-based)
- Collision radius includes label width for overlap prevention
- Gradual alpha decay prevents oscillation while maintaining responsiveness

### Static Export Configuration
Custom Next.js config handles:
- Image optimization for static hosting
- Trailing slash handling for GitHub Pages
- Asset prefix management
- Output directory configuration

### Type-Safe Data Layer
All content data is strongly typed with TypeScript:
- Const assertions for immutable data structures
- Discriminated unions for polymorphic components
- Zod-like runtime validation for external data

### Performance Optimizations
- Dynamic imports for code splitting
- Lazy loading for 3D components
- Intersection Observer for animation triggers
- Memoized calculations in force simulations
- Debounced resize handlers

## Development Workflow

### Local Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint
```

### Deployment
Automated deployment via GitHub Actions:
1. Push to `main` branch
2. GitHub Actions workflow triggers
3. Next.js build runs with static export
4. Artifacts deployed to GitHub Pages
5. Site available at heilcheng.github.io

### Adding Blog Posts
1. Create new `.mdx` file in `content/`
2. Add front matter with metadata
3. Write content with MDX syntax
4. Post automatically appears in blog listing
5. Knowledge graph updates with new connections

## Custom Domain Configuration

To use a custom domain with this portfolio:

1. Create `public/CNAME` file with your domain
2. Configure DNS A records:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
3. Add CNAME record: `www` → `heilcheng.github.io`
4. Enable HTTPS in GitHub Pages settings

## Browser Support

Targets modern browsers with:
- ES2020+ JavaScript features
- CSS Grid and Flexbox
- WebGL for 3D rendering
- Service Worker for caching (planned)

## License

This project is open source under the MIT License. Feel free to use it as inspiration or a starting point for your own portfolio, but please don't directly copy the content.

## Acknowledgments

- Design inspiration from various personal portfolios in the tech community
- 3D models from Sketchfab (CC licensed)
- TopoJSON data from Natural Earth
- Magic UI components from the Magic UI project
