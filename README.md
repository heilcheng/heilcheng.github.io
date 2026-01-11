# Portfolio

Interactive portfolio built with Next.js 14. Live at [haileycheng.com](https://haileycheng.com).

## Technical Features

### Obsidian-style Knowledge Graph
A force-directed graph visualization powered by **D3.js** that continuously links content nodes:
- **Dynamic Linking**: Automatically connects blog posts and portfolio sections (Home, Blog, Showcase) into an interactive network.
- **Interactive Physics**: Features custom force simulation with collision detection, drag capabilities, and zoomable navigation.

### Data Visualizations
- **GitHub Contributions**: Integrated visualization of coding activity and streaks.
- **Interactive Maps**:
  - **World Map**: Visualization of visited countries using `react-simple-maps` and TopoJSON.
  - **Local Map**: Detailed Hong Kong map built with `React Leaflet` for highlighting specific locations.

## Tech Stack

- **Core**: Next.js 14 (App Router), TypeScript, React 18
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **3D & Graphics**: Three.js, React Three Fiber, D3.js
- **Content**: MDX, gray-matter

## Development

```bash
pnpm install       # Install dependencies
pnpm dev           # Start dev server
pnpm build         # Build for production
```

## Credits

Original template designed by [Dillion Verma](https://github.com/dillionverma/portfolio).

## License

MIT License.
