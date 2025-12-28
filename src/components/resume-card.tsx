"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
  bullets?: readonly string[];
}

interface TimelineItemProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
  bullets?: readonly string[];
  isLast?: boolean;
}

export const TimelineItem = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
  bullets,
  isLast = false,
}: TimelineItemProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (description || bullets) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  const content = (
    <div 
      className={cn(
        "flex items-center gap-4 py-3 px-2 -mx-2 rounded-lg hover:bg-muted/30 transition-colors duration-200 cursor-pointer group",
        (description || bullets) && "cursor-pointer"
      )}
      onClick={handleClick}
    >
      {/* Logo */}
      <Avatar className="size-10 border bg-background flex-shrink-0">
        <AvatarImage
          src={logoUrl}
          alt={altText}
          className="object-contain"
        />
        <AvatarFallback className="text-xs">{altText[0]}</AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-sm leading-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-muted-foreground text-xs mt-0.5 leading-snug">
                {subtitle.split('\n').join(' | ')}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {period}
            </span>
            {(description || bullets) && (
              <ChevronRightIcon
                className={cn(
                  "size-3.5 text-muted-foreground transition-all duration-200",
                  isExpanded ? "rotate-90" : "rotate-0"
                )}
              />
            )}
          </div>
        </div>

        {/* Expandable content */}
        {(description || bullets) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isExpanded ? 1 : 0,
              height: isExpanded ? "auto" : 0,
            }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="overflow-hidden"
          >
            <div className="pt-2 mt-2 border-t border-border/30">
              {bullets ? (
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="size-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  if (href && href !== "#" && !description && !bullets) {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    );
  }

  return content;
};

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
  bullets,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (description || bullets) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Link
      href={href || "#"}
      className="block cursor-pointer"
      onClick={handleClick}
    >
      <Card className="flex p-0">
        <div className="flex-none p-content-md">
          <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
            <AvatarImage
              src={logoUrl}
              alt={altText}
              className="object-contain"
            />
            <AvatarFallback>{altText[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow items-center flex-col group">
          <CardHeader className="p-content-md">
            <div className="flex items-center justify-between gap-x-2 text-base">
              <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                {title}
                {badges && (
                  <span className="inline-flex gap-x-1 ml-2">
                    {badges.map((badge, index) => (
                      <Badge
                        variant="secondary"
                        className="align-middle text-xs"
                        key={index}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </span>
                )}
                <ChevronRightIcon
                  className={cn(
                    "size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100 ml-1",
                    isExpanded ? "rotate-90" : "rotate-0"
                  )}
                />
              </h3>
              <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                {period}
              </div>
            </div>
            {subtitle && (
              <div className="font-sans text-xs whitespace-pre-line">
                {subtitle}
              </div>
            )}
          </CardHeader>
          {(description || bullets) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isExpanded ? 1 : 0,
                height: isExpanded ? "auto" : 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="px-content-md pb-content-md text-xs sm:text-sm"
            >
              {bullets ? (
                <ul className="list-disc list-inside space-y-1">
                  {bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              ) : (
                description
              )}
            </motion.div>
          )}
        </div>
      </Card>
    </Link>
  );
};
