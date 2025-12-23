"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  {
    src: "/build.jpeg",
    alt: "build (2021.12.29)",
    caption: "build (2021.12.29)",
  },
  {
    src: "/my-room-2021.jpeg",
    alt: "my room 2021",
    caption: "my room 2021",
  },
  {
    src: "/now.jpeg",
    alt: "now (2025)",
    caption: "now (2025)",
  },
];

export function ImageGallery() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative group w-full max-w-md mx-auto aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 mb-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[index].src}
            alt={images[index].alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white text-sm font-medium">
            {images[index].caption}
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="size-5" />
      </button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/40 text-white text-xs backdrop-blur-sm">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

