# My Personal Website & Digital Playground

Welcome to the codebase for my personal website ([heilcheng.github.io](https://heilcheng.github.io)). This project is my digital garden—a place where I experiment with 3D visualizations, interactive maps, and share my thoughts on biology, AI, and philosophy.

Built with **Next.js 14**, **Tailwind CSS**, **Magic UI**, and **Three.js**.

## ✨ Features

### 🎮 Interactive 3D Showcase (`/showcase`)
A collection of 3D experiments and visualizations:
- **Rubik's Cube Solver**: A fully functional 3D Rubik's Cube implementing the CFOP method (Cross, F2L, OLL, PLL).
- **Protein Folding**: Visualizing protein structures with pLDDT confidence scores, inspired by AlphaFold.
- **Torus ↔ Mug Morph**: A topology demonstration morphing a doughnut into a coffee mug.
- **3D Pokeball**: An interactive, animated 3D model.

### 🌏 Data-Driven Maps
- **World Map**: Interactive visualization of visited countries using `react-simple-maps`.
- **Hong Kong Map**: A personal guide to my favorite spots in HK, built with `react-leaflet`.

### 📚 Digital Garden
- **Commonplace Book**: A curated collection of books shaping my worldview (Philosophy, History, Digital Privacy).
- **MDX Blog**: Thoughts on "The Iteration", "The Art of Invisibility", and more.
- **Ethics Quote**: Randomly generated ethical and philosophical reflections.

### 🎨 UI & Animations
- **Magic UI Integration**: Fluid animations including BlurFade, Orbiting Circles, and Dock navigation.
- **GitHub Contributions**: Real-time visualization of coding activity.
- **"Spanish or Vanish"**: A tribute to the Duolingo owl.
- **Usagi 3D**: A welcoming 3D rabbit mascot.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) & [Magic UI](https://magicui.design/)
- **3D**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/) & [react-simple-maps](https://www.react-simple-maps.io/)
- **Content**: [MDX](https://mdxjs.com/)

## 🚀 Quick Start

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/heilcheng/heilcheng.github.io.git
    cd heilcheng.github.io
    ```

2.  **Install dependencies** (using pnpm):
    ```bash
    pnpm install
    ```

3.  **Run locally**:
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📦 Deployment

This site is automatically deployed to **GitHub Pages** via GitHub Actions.
Any push to the `main` branch triggers the workflow defined in `.github/workflows/deploy.yml`.

## 📄 License

This project is open source and available under the [MIT](LICENSE) license.
