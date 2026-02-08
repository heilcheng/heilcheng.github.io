"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Fish } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Aquarium } from "./aquarium";

export default function Navbar() {
  const [isAquariumActive, setIsAquariumActive] = useState(false);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14">
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-gradient-to-t from-background/80 to-transparent backdrop-blur-md"></div>
      <Dock className="glass-navbar z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-2 rounded-2xl transform-gpu">
        {DATA.navbar.map((item) => (
          <DockIcon key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-200"
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="glass-card border-none">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full opacity-30" />
        {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={social.url}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-200"
                    )}
                  >
                    <social.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-none">
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        <Separator orientation="vertical" className="h-full py-2 opacity-30" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAquariumActive(!isAquariumActive)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "size-12 rounded-xl transition-all duration-200",
                  isAquariumActive
                    ? "bg-blue-400/30 dark:bg-blue-500/30 shadow-lg shadow-blue-400/20"
                    : "hover:bg-white/50 dark:hover:bg-white/10"
                )}
              >
                <Fish className="size-4" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent className="glass-card border-none">
              <p>{isAquariumActive ? "Hide Aquarium" : "Show Aquarium"}</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent className="glass-card border-none">
              <p>Theme</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>

      {/* Aquarium Component */}
      <Aquarium isActive={isAquariumActive} />
    </div>
  );
}
