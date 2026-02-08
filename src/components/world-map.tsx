"use client";

import { useState, useEffect, useMemo } from "react";
import BlurFade from "./magicui/blur-fade";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import geoData from "../../public/world-countries.json";

// List of countries you've visited (ISO 3166-1 alpha-3 codes)
const visitedCountries = [
  "USA", // United States
  "CHN", // China
  "TWN", // Taiwan
  "JPN", // Japan
  "KOR", // South Korea
  "MYS", // Malaysia
  "THA", // Thailand
  "FRA", // France
  "ESP", // Spain
  "CHE", // Switzerland
  "ITA", // Italy
  "QAT", // Qatar
  "GBR", // United Kingdom
  "FIN", // Finland
  "VAT", // Vatican City
];

// Map of country codes to full names and categories for the word list
const countryData: { [key: string]: { name: string; category: string } } = {
  "USA": { name: "United States", category: "North America" },
  "CHN": { name: "China", category: "Asia" },
  "TWN": { name: "Taiwan", category: "Asia" },
  "JPN": { name: "Japan", category: "Asia" },
  "KOR": { name: "South Korea", category: "Asia" },
  "MYS": { name: "Malaysia", category: "Asia" },
  "THA": { name: "Thailand", category: "Asia" },
  "FRA": { name: "France", category: "Europe" },
  "ESP": { name: "Spain", category: "Europe" },
  "CHE": { name: "Switzerland", category: "Europe" },
  "ITA": { name: "Italy", category: "Europe" },
  "QAT": { name: "Qatar", category: "Middle East" },
  "GBR": { name: "United Kingdom", category: "Europe" },
  "FIN": { name: "Finland", category: "Europe" },
  "VAT": { name: "Vatican City", category: "Europe" },
};

interface WorldMapProps {
  delay?: number;
}

export const WorldMap = ({ delay }: WorldMapProps) => {
  const [isClient, setIsClient] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1.5 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Helper to get country name from feature
  const getCountryName = (feature: any) => {
    return feature.properties.name;
  };

  // Helper to get country code from feature
  const getCountryCode = (feature: any) => {
    return feature.id;
  };

  // Memoize visited set for fast lookup
  const visitedSet = useMemo(() => new Set(visitedCountries), []);

  if (!isClient) {
    return (
      <BlurFade delay={delay}>
        <div className="flex justify-center">
          <div className="h-96 flex items-center justify-center w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </BlurFade>
    );
  }

  return (
    <BlurFade delay={delay}>
      <div className="flex justify-center">
        <div className="flex flex-col items-center space-y-6 w-full">
          <div className="relative w-full max-w-2xl">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 150,
              }}
              width={800}
              height={400}
              style={{ width: "100%", height: "auto", maxHeight: 400 }}
            >
              <ZoomableGroup
                zoom={position.zoom}
                center={position.coordinates as [number, number]}
                onMoveEnd={({ coordinates, zoom }) => setPosition({ coordinates, zoom })}
              >
                <Geographies geography={geoData}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const code = getCountryCode(geo);
                      const isVisited = visitedSet.has(code);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => setHoveredCountry(getCountryName(geo))}
                          onMouseLeave={() => setHoveredCountry(null)}
                          style={{
                            default: {
                              fill: isVisited ? "#8eb1c2" : "#e5e7eb", // Brand purple for visited
                              stroke: "#ffffff",
                              strokeWidth: 0.75,
                              outline: "none",
                              transition: "fill 0.2s",
                              cursor: "pointer",
                            },
                            hover: {
                              fill: "#a7c8d4", // Lighter purple on hover
                              stroke: "#ffffff",
                              strokeWidth: 1,
                              outline: "none",
                              cursor: "pointer",
                            },
                            pressed: {
                              fill: isVisited ? "#8eb1c2" : "#e5e7eb",
                              stroke: "#ffffff",
                              strokeWidth: 1,
                              outline: "none",
                              cursor: "pointer",
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            {/* Tooltip for hovered country */}
            {hoveredCountry && (
              <div className="absolute left-1/2 top-2 transform -translate-x-1/2 glass-card px-4 py-2 text-center pointer-events-none z-10">
                <span className="font-semibold text-base text-primary">{hoveredCountry}</span>
              </div>
            )}
          </div>
          {/* Legend */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8eb1c2' }}></div>
              <span className="text-muted-foreground">Visited</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="text-muted-foreground">Not Yet Visited</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#a7c8d4' }}></div>
              <span className="text-muted-foreground">Hover</span>
            </div>
          </div>

          {/* Visited Countries Word List */}
          <div className="w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-center mb-4 text-primary">Countries Visited</h3>
            <div className="text-center space-y-3">
              {(() => {
                // Group countries by category
                const categories: { [key: string]: string[] } = {};
                visitedCountries.forEach(countryCode => {
                  const category = countryData[countryCode]?.category || "Other";
                  if (!categories[category]) {
                    categories[category] = [];
                  }
                  categories[category].push(countryData[countryCode]?.name || countryCode);
                });

                return Object.entries(categories).map(([category, countries]) => (
                  <div key={category} className="space-y-1">
                    <div className="text-sm font-medium text-primary/70">{category}</div>
                    <div className="text-sm text-foreground">
                      {countries.join(", ")}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    </BlurFade>
  );
};