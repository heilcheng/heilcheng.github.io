"use client";

import { useEffect, useState } from "react";
import BlurFade from "./magicui/blur-fade";

interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface GitHubContributionsProps {
  username: string;
  delay?: number;
}

// Unified teal color function (matching brand color #8eb1c2)
const getTealColor = (count: number): string => {
  if (count === 0) return '#f3f4f6'; // Light gray for no contributions
  if (count <= 3) return '#d4e5eb'; // Very light teal
  if (count <= 6) return '#a7c8d4'; // Light teal
  if (count <= 9) return '#8eb1c2'; // Medium teal (brand color)
  return '#6a9aad'; // Dark teal for high activity
};

export const GitHubContributions = ({ username, delay = 0 }: GitHubContributionsProps) => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        // Using GitHub's GraphQL API to get contribution data
        const query = `
          query {
            user(login: "${username}") {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                      color
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''}`,
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          // Fallback to a simple visualization if API fails
          setContributions([]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];

        const allContributions: ContributionDay[] = [];
        weeks.forEach((week: any) => {
          week.contributionDays.forEach((day: any) => {
            allContributions.push({
              date: day.date,
              contributionCount: day.contributionCount,
              color: day.color,
            });
          });
        });

        setContributions(allContributions);
      } catch (error) {
        console.error('Error fetching GitHub contributions:', error);
        setContributions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  if (loading) {
    return (
      <BlurFade delay={delay}>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </BlurFade>
    );
  }

  // Create a simple contribution graph visualization
  const renderContributionGraph = () => {
    const days = contributions.slice(-365); // Last 365 days
    const weeks = [];

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="w-3 h-3 rounded-sm transition-transform hover:scale-125"
                style={{
                  backgroundColor: getTealColor(day.contributionCount),
                }}
                title={`${day.date}: ${day.contributionCount} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Teal color swatches for legend
  const tealSwatches = ['#d4e5eb', '#a7c8d4', '#8eb1c2', '#6a9aad'];

  return (
    <BlurFade delay={delay}>
      <div className="space-y-6 w-full py-4">
        {/* Title */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-center">
              My GitHub Activity.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Here&apos;s my contribution graph showing my coding activity over the past year.
            </p>
          </div>
        </div>

        {/* Legend - centered */}
        <div className="flex items-center gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
            <span className="text-sm text-muted-foreground">Less</span>
          </div>
          <div className="flex items-center gap-1">
            {tealSwatches.map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">More</span>
        </div>

        {/* Graph container with horizontal scroll */}
        <div className="w-full overflow-x-auto pb-2">
          <div className="flex justify-center min-w-max px-4">
            {renderContributionGraph()}
          </div>
        </div>
      </div>
    </BlurFade>
  );
};