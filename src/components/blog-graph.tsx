"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as d3 from "d3";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Folder, FileText, ExternalLink } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  tags: string[];
  isExternal?: boolean;
  url?: string;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  label: string; // Short display label
  tags: string[];
  isExternal: boolean;
  url: string;
  radius: number;
  isCenter?: boolean;
  connectionCount?: number;
  category?: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  strength: number;
  type: "content" | "tag" | "center"; // Link type for styling
}

interface BlogGraphProps {
  posts: BlogPost[];
}

// Category definitions for sidebar
const CATEGORIES: Record<string, { name: string; slugs: string[] }> = {
  "philosophy": {
    name: "Philosophy",
    slugs: ["the-iteration", "sama", "durov"],
  },
  "health": {
    name: "Health",
    slugs: ["biohacking"],
  },
  "privacy": {
    name: "Privacy",
    slugs: ["the-art-of-invisibility", "durov"],
  },
  "education": {
    name: "Education",
    slugs: ["reasons-to-do-math", "stat-for-transfer-application-for-record", "things-i-find-useful"],
  },
  "lifestyle": {
    name: "Lifestyle",
    slugs: ["eataly", "my-self-built-mechanical-keyboard"],
  },
  "external": {
    name: "External",
    slugs: [], // Will be filled dynamically
  },
};

// Get category for a post
function getCategory(slug: string, isExternal: boolean): string {
  if (isExternal) return "external";
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    if (cat.slugs.includes(slug)) return key;
  }
  return "lifestyle"; // default
}

// Content-based relationships (semantic links between posts)
const CONTENT_LINKS: Array<{ source: string; target: string; reason: string }> = [
  // Philosophy & Discipline cluster
  { source: "biohacking", target: "durov", reason: "discipline, fasting, cold exposure" },
  { source: "biohacking", target: "the-iteration", reason: "autophagy, neuroplasticity, biology" },
  { source: "durov", target: "the-art-of-invisibility", reason: "privacy, freedom, surveillance" },
  
  // Success & Thinking cluster
  { source: "sama", target: "the-iteration", reason: "growth mindset, philosophy" },
  { source: "sama", target: "reasons-to-do-math", reason: "compounding, optionality" },
  { source: "reasons-to-do-math", target: "the-iteration", reason: "thinking, adaptation" },
  
  // Education & Resources cluster
  { source: "things-i-find-useful", target: "biohacking", reason: "biohacking resources" },
  { source: "things-i-find-useful", target: "reasons-to-do-math", reason: "math resources" },
  { source: "stat-for-transfer-application-for-record", target: "reasons-to-do-math", reason: "math + cs education" },
  
  // Privacy cluster
  { source: "durov", target: "the-iteration", reason: "freedom philosophy" },
  
  // Lifestyle cluster
  { source: "eataly", target: "my-self-built-mechanical-keyboard", reason: "lifestyle, hobbies" },
  
  // Math & DeepMind connection
  { source: "reasons-to-do-math", target: "https://medium.com/@heilcheng2-c/how-i-landed-a-google-deepmind-project-in-google-summer-of-code-2025-a-step-by-step-guide-ccb2dee66769", reason: "math, AI, research" },
  
  // Resources & DeepMind connection
  { source: "things-i-find-useful", target: "https://medium.com/@heilcheng2-c/how-i-landed-a-google-deepmind-project-in-google-summer-of-code-2025-a-step-by-step-guide-ccb2dee66769", reason: "useful resources, career guide" },
];

// Short labels for cleaner display
function getShortLabel(title: string, slug: string): string {
  const labelMap: Record<string, string> = {
    "biohacking": "biohacking",
    "durov": "durov",
    "eataly": "eataly",
    "my-self-built-mechanical-keyboard": "keyboard",
    "reasons-to-do-math": "math",
    "sama": "sama",
    "stat-for-transfer-application-for-record": "transfer stats",
    "the-art-of-invisibility": "invisibility",
    "the-iteration": "iteration",
    "things-i-find-useful": "resources",
  };
  
  if (labelMap[slug]) return labelMap[slug];
  
  // Special handling for external posts by URL
  if (slug.includes("how-i-landed-a-google-deepmind")) {
    return "journey to gdm";
  }
  if (slug.includes("medisafe")) {
    return "medisafe analysis";
  }
  
  // For external posts or unknown slugs, truncate intelligently
  const words = title.toLowerCase().split(" ");
  if (words.length <= 2) return title.toLowerCase();
  return words.slice(0, 2).join(" ");
}

export function BlogGraph({ posts }: BlogGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const router = useRouter();
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(CATEGORIES))
  );

  // Organize posts by category
  const postsByCategory = useMemo(() => {
    const result: Record<string, Array<{ slug: string; title: string; label: string; isExternal: boolean; url: string }>> = {};
    
    for (const key of Object.keys(CATEGORIES)) {
      result[key] = [];
    }
    
    posts.forEach((post) => {
      const category = getCategory(post.slug, post.isExternal || false);
      result[category].push({
        slug: post.slug,
        title: post.title,
        label: getShortLabel(post.title, post.slug),
        isExternal: post.isExternal || false,
        url: post.url || `/blog/${post.slug}`,
      });
    });
    
    return result;
  }, [posts]);

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

  // Handle resize
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

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (node.isExternal) {
        window.open(node.url, "_blank");
      } else {
        router.push(node.url);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!svgRef.current || posts.length === 0) return;

    const { width, height } = dimensions;

    // Build links first to count connections per node
    const links: GraphLink[] = [];
    const connectionCounts: Record<string, number> = {};
    const postSlugs = new Set(posts.map(p => p.slug));

    // Add content-based links (semantic relationships)
    CONTENT_LINKS.forEach(({ source, target }) => {
      if (postSlugs.has(source) && postSlugs.has(target)) {
        links.push({
          source,
          target,
          strength: 2, // Content links are stronger
          type: "content",
        });
        connectionCounts[source] = (connectionCounts[source] || 0) + 1;
        connectionCounts[target] = (connectionCounts[target] || 0) + 1;
      }
    });

    // Add tag-based links (weaker than content links)
    for (let i = 0; i < posts.length; i++) {
      for (let j = i + 1; j < posts.length; j++) {
        const sharedTags = posts[i].tags?.filter((tag) =>
          posts[j].tags?.some(
            (t) => t.toLowerCase() === tag.toLowerCase()
          )
        );
        // Only add tag link if no content link exists
        const hasContentLink = links.some(
          (l) =>
            (l.source === posts[i].slug && l.target === posts[j].slug) ||
            (l.source === posts[j].slug && l.target === posts[i].slug)
        );
        if (sharedTags && sharedTags.length > 0 && !hasContentLink) {
          links.push({
            source: posts[i].slug,
            target: posts[j].slug,
            strength: sharedTags.length * 0.5,
            type: "tag",
          });
          connectionCounts[posts[i].slug] = (connectionCounts[posts[i].slug] || 0) + 1;
          connectionCounts[posts[j].slug] = (connectionCounts[posts[j].slug] || 0) + 1;
        }
      }
    }

    // Build nodes with connection counts
    const nodes: GraphNode[] = posts.map((post) => ({
      id: post.slug,
      title: post.title,
      label: getShortLabel(post.title, post.slug),
      tags: post.tags || [],
      isExternal: post.isExternal || false,
      url: post.url || `/blog/${post.slug}`,
      radius: 6 + Math.min((connectionCounts[post.slug] || 0) * 2, 10),
      isCenter: false,
      connectionCount: connectionCounts[post.slug] || 0,
      category: getCategory(post.slug, post.isExternal || false),
    }));
    
    // Store nodes ref for sidebar interaction
    nodesRef.current = nodes;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", height);

    // Create container for zoom/pan
    const container = svg.append("g");

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Force simulation - no center node, organic clustering
    const simulation = d3
      .forceSimulation(nodes);
    
    simulationRef.current = simulation;
    
    simulation
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance((d) => {
            // Content links are closer than tag links
            return d.type === "content" ? 80 : 120;
          })
          .strength((d) => {
            return d.type === "content" ? 0.4 : 0.15;
          })
      )
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<GraphNode>().radius((d) => d.radius + 30)
      )
      .force("x", d3.forceX(width / 2).strength(0.03))
      .force("y", d3.forceY(height / 2).strength(0.03));

    // Draw links with different styles for content vs tag links
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

    // Draw nodes - size based on connections
    const node = container
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => {
        // Color based on connection count (more connected = darker purple)
        const count = d.connectionCount || 0;
        if (count >= 4) return "#7c3aed"; // Very connected
        if (count >= 2) return "#8b5cf6"; // Well connected
        if (count >= 1) return "#a78bfa"; // Some connections
        return "#c4b5fd"; // Isolated
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
          .style(
            "filter",
            "drop-shadow(0 0 12px rgba(139, 92, 246, 0.7))"
          );

        // Highlight connected links
        link
          .transition()
          .duration(150)
          .attr("stroke-opacity", (l) => {
            const sourceId =
              typeof l.source === "object" ? l.source.id : l.source;
            const targetId =
              typeof l.target === "object" ? l.target.id : l.target;
            return sourceId === d.id || targetId === d.id ? 1 : 0.08;
          })
          .attr("stroke-width", (l) => {
            const sourceId =
              typeof l.source === "object" ? l.source.id : l.source;
            const targetId =
              typeof l.target === "object" ? l.target.id : l.target;
            if (sourceId === d.id || targetId === d.id) {
              return l.type === "content" ? 3 : 2;
            }
            return l.type === "content" ? 2 : 1;
          })
          .attr("stroke", (l) => {
            const sourceId =
              typeof l.source === "object" ? l.source.id : l.source;
            const targetId =
              typeof l.target === "object" ? l.target.id : l.target;
            return sourceId === d.id || targetId === d.id
              ? "#7c3aed"
              : l.type === "content" ? "#8b5cf6" : "#a78bfa";
          });

        // Dim other nodes
        node
          .transition()
          .duration(150)
          .attr("opacity", (n) => {
            if (n.id === d.id) return 1;
            // Check if connected
            const isConnected = links.some((l) => {
              const sourceId =
                typeof l.source === "object" ? l.source.id : l.source;
              const targetId =
                typeof l.target === "object" ? l.target.id : l.target;
              return (
                (sourceId === d.id && targetId === n.id) ||
                (targetId === d.id && sourceId === n.id)
              );
            });
            return isConnected ? 1 : 0.25;
          });

        // Dim labels
        labels
          .transition()
          .duration(150)
          .attr("opacity", (n) => {
            if (n.id === d.id) return 1;
            const isConnected = links.some((l) => {
              const sourceId =
                typeof l.source === "object" ? l.source.id : l.source;
              const targetId =
                typeof l.target === "object" ? l.target.id : l.target;
              return (
                (sourceId === d.id && targetId === n.id) ||
                (targetId === d.id && sourceId === n.id)
              );
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
          .style(
            "filter",
            count >= 3
              ? "drop-shadow(0 0 6px rgba(139, 92, 246, 0.4))"
              : "none"
          );

        // Reset links
        link
          .transition()
          .duration(150)
          .attr("stroke-opacity", (l) => l.type === "content" ? 0.6 : 0.25)
          .attr("stroke-width", (l) => l.type === "content" ? 2 : 1)
          .attr("stroke", (l) => l.type === "content" ? "#8b5cf6" : "#a78bfa");

        // Reset nodes
        node.transition().duration(150).attr("opacity", 1);

        // Reset labels
        labels.transition().duration(150).attr("opacity", 1);
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        handleNodeClick(d);
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

    // Draw labels - using short labels for cleaner display
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

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);

      labels.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
    });

    // Initial zoom to fit
    const initialScale = 0.9;
    svg.call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width * (1 - initialScale) / 2, height * (1 - initialScale) / 2)
        .scale(initialScale)
    );

    return () => simulation.stop();
  }, [posts, dimensions, handleNodeClick]);

  if (posts.length === 0) {
    return null;
  }

  // Handle sidebar item hover - highlight node in graph
  const handleSidebarHover = useCallback((slug: string | null) => {
    setHighlightedSlug(slug);
    
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const nodes = svg.selectAll<SVGCircleElement, GraphNode>("circle");
    const labels = svg.selectAll<SVGTextElement, GraphNode>("text");
    const links = svg.selectAll<SVGLineElement, GraphLink>("line");
    
    if (slug === null) {
      // Reset all
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
      // Highlight the selected node
      nodes.transition().duration(150)
        .attr("opacity", (d) => d.id === slug ? 1 : 0.25)
        .attr("r", (d) => d.id === slug ? d.radius * 1.4 : d.radius)
        .style("filter", (d) => d.id === slug ? "drop-shadow(0 0 12px rgba(139, 92, 246, 0.7))" : "none");
      labels.transition().duration(150)
        .attr("opacity", (d) => d.id === slug ? 1 : 0.15);
      links.transition().duration(150)
        .attr("stroke-opacity", (d) => {
          const sourceId = typeof d.source === "object" ? d.source.id : d.source;
          const targetId = typeof d.target === "object" ? d.target.id : d.target;
          return sourceId === slug || targetId === slug ? 1 : 0.08;
        });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full mb-12 rounded-xl border border-border/50 bg-gradient-to-br from-violet-50/50 via-background to-purple-50/30 dark:from-violet-950/20 dark:via-background dark:to-purple-950/10 overflow-hidden"
    >
      {/* Decorative grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Sidebar Toggle Button */}
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
      
      {/* Sidebar */}
      <div
        className={`absolute left-0 top-0 bottom-0 z-20 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-48 opacity-100" : "w-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full bg-background/90 backdrop-blur-sm border-r border-border/50 overflow-hidden">
          <div className="p-3 pt-12 h-full overflow-y-auto">
            <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Categories
            </h3>
            
            <div className="space-y-1">
              {Object.entries(CATEGORIES).map(([key, category]) => {
                const categoryPosts = postsByCategory[key] || [];
                if (categoryPosts.length === 0) return null;
                
                const isExpanded = expandedCategories.has(key);
                
                return (
                  <div key={key}>
                    {/* Category header */}
                    <button
                      onClick={() => toggleCategory(key)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm rounded-md hover:bg-muted/50 transition-colors group"
                    >
                      <Folder className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-foreground/80 font-medium text-xs truncate">
                        {category.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {categoryPosts.length}
                      </span>
                      <ChevronRight
                        className={`w-3 h-3 text-muted-foreground transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    
                    {/* Category items */}
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {categoryPosts.map((post) => (
                          <button
                            key={post.slug}
                            onClick={() => {
                              if (post.isExternal) {
                                window.open(post.url, "_blank");
                              } else {
                                router.push(post.url);
                              }
                            }}
                            onMouseEnter={() => handleSidebarHover(post.slug)}
                            onMouseLeave={() => handleSidebarHover(null)}
                            className={`w-full flex items-center gap-1.5 px-2 py-1 text-left text-xs rounded-md transition-colors ${
                              highlightedSlug === post.slug
                                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                                : "hover:bg-muted/50 text-foreground/70"
                            }`}
                          >
                            {post.isExternal ? (
                              <ExternalLink className="w-3 h-3 shrink-0 opacity-50" />
                            ) : (
                              <FileText className="w-3 h-3 shrink-0 opacity-50" />
                            )}
                            <span className="truncate">{post.label}</span>
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
      
      {/* Graph container */}
      <svg
        ref={svgRef}
        className={`w-full relative z-10 transition-all duration-300 ${
          sidebarOpen ? "pl-48" : ""
        }`}
        style={{ minHeight: "300px" }}
      />

      {/* Tooltip */}
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
          {hoveredNode.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {hoveredNode.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                >
                  {tag}
                </span>
              ))}
              {hoveredNode.tags.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{hoveredNode.tags.length - 4} more
                </span>
              )}
            </div>
          )}
          {hoveredNode.isExternal && (
            <span className="text-xs text-muted-foreground mt-1 block">
              ↗ External link
            </span>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-3 right-3 text-xs text-muted-foreground/60 hidden sm:block">
        drag to move • scroll to zoom
      </div>
    </div>
  );
}

