"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as d3 from "d3";
import { ChevronLeft, ChevronRight, Layout, Briefcase, GraduationCap, Code2, BookOpen, MapPin, Globe } from "lucide-react";

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  label: string;
  radius: number;
  icon?: any;
  color?: string;
  connectionCount?: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  strength: number;
}

const SECTION_NODES = [
  { id: "about", title: "About Me", label: "About", icon: Layout, color: "#8b5cf6" },
  { id: "work", title: "Experience", label: "Work", icon: Briefcase, color: "#7c3aed" },
  { id: "education", title: "Education", label: "Education", icon: GraduationCap, color: "#6d28d9" },
  { id: "projects", title: "Projects", label: "Projects", icon: Code2, color: "#8b5cf6" },
  { id: "tech-stack", title: "Skills", label: "Tech Stack", icon: Code2, color: "#a78bfa" },
  { id: "books", title: "Readings", label: "Books", icon: BookOpen, color: "#7c3aed" },
  { id: "hong-kong", title: "Hong Kong", label: "HK", icon: MapPin, color: "#6d28d9" },
  { id: "world", title: "Travel", label: "World", icon: Globe, color: "#8b5cf6" },
  { id: "github", title: "Open Source", label: "GitHub", icon: Code2, color: "#c4b5fd" },
];

const SECTION_LINKS = [
  { source: "about", target: "work", strength: 1 },
  { source: "about", target: "education", strength: 1 },
  { source: "work", target: "projects", strength: 1 },
  { source: "work", target: "tech-stack", strength: 1 },
  { source: "education", target: "tech-stack", strength: 1 },
  { source: "projects", target: "tech-stack", strength: 1 },
  { source: "projects", target: "github", strength: 1 },
  { source: "hong-kong", target: "about", strength: 1 },
  { source: "world", target: "about", strength: 1 },
  { source: "books", target: "about", strength: 1 },
];

export function HomeGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setDimensions({ width, height: Math.min(400, width * 0.5) });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleNodeClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const { width, height } = dimensions;

    const connectionCounts: Record<string, number> = {};
    SECTION_LINKS.forEach(({ source, target }) => {
      connectionCounts[source] = (connectionCounts[source] || 0) + 1;
      connectionCounts[target] = (connectionCounts[target] || 0) + 1;
    });

    const nodes: GraphNode[] = SECTION_NODES.map((n) => ({
      ...n,
      radius: 20 + (connectionCounts[n.id] || 0) * 2,
      connectionCount: connectionCounts[n.id] || 0,
    }));

    const links: GraphLink[] = SECTION_LINKS.map((l) => ({ ...l }));

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", height);

    const container = svg.append("g");

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius((d) => d.radius + 20));

    simulationRef.current = simulation;

    const link = container
      .append("g")
      .attr("stroke", "#8b5cf6")
      .attr("stroke-opacity", 0.2)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    const node = container
      .append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodes)
      .join("g")
      .attr("class", "cursor-pointer")
      .on("mouseenter", function (event, d) {
        setHoveredNode(d);
        d3.select(this).select("circle").transition().duration(200).attr("r", d.radius * 1.2);
        
        link.transition().duration(200)
          .attr("stroke-opacity", (l) => {
            const s = typeof l.source === "object" ? l.source.id : l.source;
            const t = typeof l.target === "object" ? l.target.id : l.target;
            return s === d.id || t === d.id ? 0.8 : 0.05;
          })
          .attr("stroke-width", (l) => {
            const s = typeof l.source === "object" ? l.source.id : l.source;
            const t = typeof l.target === "object" ? l.target.id : l.target;
            return s === d.id || t === d.id ? 2 : 1.5;
          });
      })
      .on("mouseleave", function (event, d) {
        setHoveredNode(null);
        d3.select(this).select("circle").transition().duration(200).attr("r", d.radius);
        link.transition().duration(200).attr("stroke-opacity", 0.2).attr("stroke-width", 1.5);
      })
      .on("click", (event, d) => handleNodeClick(d.id))
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node.append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => d.color || "#8b5cf6")
      .attr("fill-opacity", 0.1)
      .attr("stroke", (d) => d.color || "#8b5cf6")
      .attr("stroke-width", 2);

    node.append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .attr("fill", "currentColor")
      .attr("class", "pointer-events-none select-none dark:text-white");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [dimensions, handleNodeClick]);

  return (
    <div ref={containerRef} className="relative w-full aspect-[2/1] max-h-[400px] mb-section-lg rounded-xl border border-border/50 bg-background/50 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      <svg ref={svgRef} className="w-full h-full relative z-10" />
      <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground/60">
        drag to explore • click to navigate
      </div>
    </div>
  );
}

