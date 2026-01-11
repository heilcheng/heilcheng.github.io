"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { ChevronLeft, ChevronRight, Folder } from "lucide-react";

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  label: string;
  radius: number;
  connectionCount?: number;
  category?: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  strength: number;
  type: "content" | "tag"; // Link type for styling
}

// Semantic content-based relationships between portfolio sections
const CONTENT_LINKS: Array<{ source: string; target: string; reason: string }> = [
  // Core identity cluster
  { source: "hero", target: "about", reason: "introduction, personal story" },
  { source: "about", target: "books", reason: "philosophy, worldview, readings" },
  { source: "about", target: "ethics", reason: "values, philosophical foundation" },
  
  // Professional cluster
  { source: "hero", target: "work", reason: "current role, professional identity" },
  { source: "work", target: "education", reason: "academic foundation, learning path" },
  { source: "work", target: "projects", reason: "practical application, portfolio" },
  { source: "work", target: "tech-stack", reason: "technical skills, tools" },
  { source: "education", target: "projects", reason: "applied knowledge, research" },
  { source: "projects", target: "tech-stack", reason: "technologies used" },
  { source: "projects", target: "github", reason: "open source contributions" },
  
  // Location & culture cluster
  { source: "about", target: "hong-kong", reason: "hometown, cultural identity" },
  { source: "hero", target: "hong-kong", reason: "based in Hong Kong" },
  { source: "education", target: "world", reason: "study abroad experiences" },
  { source: "about", target: "world", reason: "international perspective" },
  
  // Skills & tools cluster
  { source: "tech-stack", target: "github", reason: "coding, open source" },
  
  // Values & work
  { source: "ethics", target: "work", reason: "ethical approach to tech" },
  { source: "ethics", target: "projects", reason: "values-driven development" },
];

// Section categories for organization
const CATEGORIES: Record<string, { name: string; sections: string[] }> = {
  "identity": {
    name: "About Me",
    sections: ["hero", "about", "ethics", "books"],
  },
  "professional": {
    name: "Professional",
    sections: ["work", "education", "tech-stack", "github"],
  },
  "projects": {
    name: "Projects",
    sections: ["projects"],
  },
  "places": {
    name: "Places",
    sections: ["hong-kong", "world"],
  },
};

// Get category for a section
function getCategory(id: string): string {
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    if (cat.sections.includes(id)) return key;
  }
  return "identity";
}

// Section definitions
const SECTIONS = [
  { id: "hero", title: "Introduction", label: "intro" },
  { id: "about", title: "About Me", label: "about" },
  { id: "ethics", title: "Ethics & Values", label: "ethics" },
  { id: "work", title: "Work Experience", label: "work" },
  { id: "education", title: "Education", label: "education" },
  { id: "tech-stack", title: "Technical Skills", label: "tech stack" },
  { id: "projects", title: "Projects", label: "projects" },
  { id: "github", title: "Open Source", label: "github" },
  { id: "books", title: "Reading List", label: "books" },
  { id: "hong-kong", title: "Hong Kong", label: "hong kong" },
  { id: "world", title: "World Map", label: "world" },
];

// Short labels for cleaner display
function getShortLabel(id: string): string {
  const section = SECTIONS.find(s => s.id === id);
  return section?.label || id;
}

export function HomeGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(CATEGORIES))
  );

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Handle sidebar item hover
  const handleSidebarHover = useCallback((id: string | null) => {
    setHighlightedId(id);
    
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const nodes = svg.selectAll<SVGCircleElement, GraphNode>("circle");
    const labels = svg.selectAll<SVGTextElement, GraphNode>("text");
    const links = svg.selectAll<SVGLineElement, GraphLink>("line");
    
    if (id === null) {
      nodes.transition().duration(150)
        .attr("opacity", 1)
        .attr("r", (d) => d.radius)
        .style("filter", (d) => {
          const count = d.connectionCount || 0;
          return count >= 3 ? "drop-shadow(0 0 6px rgba(139, 92, 246, 0.4))" : "none";
        });
      labels.transition().duration(150).attr("opacity", 1);
      links.transition().duration(150)
        .attr("stroke-opacity", (d) => d.type === "content" ? 0.6 : 0.25);
    } else {
      nodes.transition().duration(150)
        .attr("opacity", (d) => d.id === id ? 1 : 0.25)
        .attr("r", (d) => d.id === id ? d.radius * 1.4 : d.radius)
        .style("filter", (d) => d.id === id ? "drop-shadow(0 0 12px rgba(139, 92, 246, 0.7))" : "none");
      labels.transition().duration(150)
        .attr("opacity", (d) => d.id === id ? 1 : 0.15);
      links.transition().duration(150)
        .attr("stroke-opacity", (d) => {
          const sourceId = typeof d.source === "object" ? d.source.id : d.source;
          const targetId = typeof d.target === "object" ? d.target.id : d.target;
          return sourceId === id || targetId === id ? 1 : 0.08;
        });
    }
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setDimensions({ width, height: Math.min(500, width * 0.6) });
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
    if (!svgRef.current || SECTIONS.length === 0) return;

    const { width, height } = dimensions;

    // Build links first to count connections per node
    const links: GraphLink[] = [];
    const connectionCounts: Record<string, number> = {};
    const sectionIds = new Set(SECTIONS.map(s => s.id));

    // Add content-based links
    CONTENT_LINKS.forEach(({ source, target }) => {
      if (sectionIds.has(source) && sectionIds.has(target)) {
        links.push({
          source,
          target,
          strength: 2,
          type: "content",
        });
        connectionCounts[source] = (connectionCounts[source] || 0) + 1;
        connectionCounts[target] = (connectionCounts[target] || 0) + 1;
      }
    });

    // Build nodes with connection counts
    const nodes: GraphNode[] = SECTIONS.map((section) => ({
      id: section.id,
      title: section.title,
      label: getShortLabel(section.id),
      radius: 6 + Math.min((connectionCounts[section.id] || 0) * 2, 10),
      connectionCount: connectionCounts[section.id] || 0,
      category: getCategory(section.id),
    }));

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    const container = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance((d) => d.type === "content" ? 80 : 120)
          .strength((d) => d.type === "content" ? 0.4 : 0.15)
      )
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius((d) => d.radius + 30))
      .force("x", d3.forceX(width / 2).strength(0.03))
      .force("y", d3.forceY(height / 2).strength(0.03));

    simulationRef.current = simulation;

    const link = container
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => d.type === "content" ? "#8b5cf6" : "#a78bfa")
      .attr("stroke-opacity", (d) => d.type === "content" ? 0.6 : 0.25)
      .attr("stroke-width", (d) => d.type === "content" ? 2 : 1)
      .attr("stroke-dasharray", (d) => d.type === "tag" ? "3,3" : "none");

    const node = container
      .append("g")
      .attr("class", "nodes")
      .selectAll<SVGCircleElement, GraphNode>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => {
        const count = d.connectionCount || 0;
        if (count >= 4) return "#7c3aed";
        if (count >= 2) return "#8b5cf6";
        if (count >= 1) return "#a78bfa";
        return "#c4b5fd";
      })
      .attr("stroke", (d) => {
        const count = d.connectionCount || 0;
        return count >= 3 ? "#6d28d9" : "transparent";
      })
      .attr("stroke-width", (d) => {
        const count = d.connectionCount || 0;
        return count >= 3 ? 2 : 0;
      })
      .attr("class", "cursor-pointer transition-all duration-200")
      .style("filter", (d) => {
        const count = d.connectionCount || 0;
        return count >= 3 ? "drop-shadow(0 0 6px rgba(139, 92, 246, 0.4))" : "none";
      })
      .on("mouseenter", function (event, d) {
        setHoveredNode(d);
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", d.radius * 1.4)
          .style("filter", "drop-shadow(0 0 12px rgba(139, 92, 246, 0.7))");

        link
          .transition()
          .duration(150)
          .attr("stroke-opacity", (l) => {
            const sourceId = typeof l.source === "object" ? l.source.id : l.source;
            const targetId = typeof l.target === "object" ? l.target.id : l.target;
            return sourceId === d.id || targetId === d.id ? 1 : 0.08;
          })
          .attr("stroke-width", (l) => {
            const sourceId = typeof l.source === "object" ? l.source.id : l.source;
            const targetId = typeof l.target === "object" ? l.target.id : l.target;
            if (sourceId === d.id || targetId === d.id) {
              return l.type === "content" ? 3 : 2;
            }
            return l.type === "content" ? 2 : 1;
          })
          .attr("stroke", (l) => {
            const sourceId = typeof l.source === "object" ? l.source.id : l.source;
            const targetId = typeof l.target === "object" ? l.target.id : l.target;
            return sourceId === d.id || targetId === d.id ? "#7c3aed" : l.type === "content" ? "#8b5cf6" : "#a78bfa";
          });

        node.transition().duration(150).attr("opacity", (n) => {
          if (n.id === d.id) return 1;
          const isConnected = links.some((l) => {
            const sourceId = typeof l.source === "object" ? l.source.id : l.source;
            const targetId = typeof l.target === "object" ? l.target.id : l.target;
            return (sourceId === d.id && targetId === n.id) || (targetId === d.id && sourceId === n.id);
          });
          return isConnected ? 1 : 0.25;
        });

        labels.transition().duration(150).attr("opacity", (n) => {
          if (n.id === d.id) return 1;
          const isConnected = links.some((l) => {
            const sourceId = typeof l.source === "object" ? l.source.id : l.source;
            const targetId = typeof l.target === "object" ? l.target.id : l.target;
            return (sourceId === d.id && targetId === n.id) || (targetId === d.id && sourceId === n.id);
          });
          return isConnected ? 1 : 0.15;
        });
      })
      .on("mouseleave", function (event, d) {
        setHoveredNode(null);
        const count = d.connectionCount || 0;
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", d.radius)
          .style("filter", count >= 3 ? "drop-shadow(0 0 6px rgba(139, 92, 246, 0.4))" : "none");

        link
          .transition()
          .duration(150)
          .attr("stroke-opacity", (l) => l.type === "content" ? 0.6 : 0.25)
          .attr("stroke-width", (l) => l.type === "content" ? 2 : 1)
          .attr("stroke", (l) => l.type === "content" ? "#8b5cf6" : "#a78bfa");

        node.transition().duration(150).attr("opacity", 1);
        labels.transition().duration(150).attr("opacity", 1);
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        handleNodeClick(d.id);
      })
      .call(
        d3
          .drag<SVGCircleElement, GraphNode>()
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

    const labels = container
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.label)
      .attr("font-size", (d) => {
        const count = d.connectionCount || 0;
        return count >= 3 ? "11px" : "10px";
      })
      .attr("font-weight", (d) => {
        const count = d.connectionCount || 0;
        return count >= 3 ? "500" : "400";
      })
      .attr("fill", "currentColor")
      .attr("class", "text-foreground/60 pointer-events-none select-none")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.radius + 14);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
      labels.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
    });

    const initialScale = 0.9;
    svg.call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width * (1 - initialScale) / 2, height * (1 - initialScale) / 2)
        .scale(initialScale)
    );

    return () => {
      simulation.stop();
    };
  }, [dimensions, handleNodeClick]);

  return (
    <div
      ref={containerRef}
      className="relative w-full mb-12 rounded-xl border border-border/50 bg-gradient-to-br from-violet-50/50 via-background to-purple-50/30 dark:from-violet-950/20 dark:via-background dark:to-purple-950/10 overflow-hidden"
    >
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-3 left-3 z-30 p-1.5 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-muted/80 transition-colors"
        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      <div
        className={`absolute left-0 top-0 bottom-0 z-20 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-48 opacity-100" : "w-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full bg-background/90 backdrop-blur-sm border-r border-border/50 overflow-hidden">
          <div className="p-3 pt-12 h-full overflow-y-auto">
            <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Sections
            </h3>
            
            <div className="space-y-1">
              {Object.entries(CATEGORIES).map(([key, category]) => {
                const categorySections = SECTIONS.filter(s => category.sections.includes(s.id));
                if (categorySections.length === 0) return null;
                
                const isExpanded = expandedCategories.has(key);
                
                return (
                  <div key={key}>
                    <button
                      onClick={() => toggleCategory(key)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm rounded-md hover:bg-muted/50 transition-colors group"
                    >
                      <Folder className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-foreground/80 font-medium text-xs truncate">
                        {category.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {categorySections.length}
                      </span>
                      <ChevronRight
                        className={`w-3 h-3 text-muted-foreground transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {categorySections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => handleNodeClick(section.id)}
                            onMouseEnter={() => handleSidebarHover(section.id)}
                            onMouseLeave={() => handleSidebarHover(null)}
                            className={`w-full flex items-center gap-1.5 px-2 py-1 text-left text-xs rounded-md transition-colors ${
                              highlightedId === section.id
                                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                                : "hover:bg-muted/50 text-foreground/70"
                            }`}
                          >
                            <span className="truncate">{section.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <svg
        ref={svgRef}
        className={`w-full relative z-10 transition-all duration-300 ${
          sidebarOpen ? "pl-48" : ""
        }`}
        style={{ minHeight: "300px" }}
      />

      {hoveredNode && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 pointer-events-none z-20">
          <h4 className="font-medium text-sm text-foreground">
            {hoveredNode.title}
          </h4>
          {hoveredNode.connectionCount !== undefined && hoveredNode.connectionCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {hoveredNode.connectionCount} connection{hoveredNode.connectionCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}

      <div className="absolute top-3 right-3 text-xs text-muted-foreground/60 hidden sm:block">
        drag to move • scroll to zoom • click to navigate
      </div>
    </div>
  );
}
