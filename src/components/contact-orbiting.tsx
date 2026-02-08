"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Linkedin, Github, Send, ArrowRight } from "lucide-react";
import { DATA } from "@/data/resume";
import Link from "next/link";

interface ContactOrbitingProps {
  delay?: number;
}

export const ContactOrbiting = ({ delay = 0 }: ContactOrbitingProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: delay + 0.3 + i * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  const contactMethods = [
    {
      name: "Email",
      icon: Mail,
      href: DATA.contact.social.email.url,
      description: "Send me an email",
      color: "from-primary/20 to-primary/5",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: DATA.contact.social.LinkedIn.url,
      description: "Connect with me",
      color: "from-primary/15 to-primary/5",
    },
    {
      name: "GitHub",
      icon: Github,
      href: DATA.contact.social.GitHub.url,
      description: "View my code",
      color: "from-primary/10 to-primary/5",
    },
  ];

  return (
    <motion.section
      ref={ref}
      id="contact"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="w-full"
    >
      <div className="flex flex-col items-center text-center space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Get in Touch.</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Have a question or want to collaborate? I&apos;d love to hear from you.
          </p>
        </div>

        {/* Beautiful teal-themed contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.name}
              custom={index}
              variants={iconVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={method.href}
                target={method.name !== "Email" ? "_blank" : undefined}
                rel={method.name !== "Email" ? "noopener noreferrer" : undefined}
                className={`group relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br ${method.color} border border-primary/10 hover:border-primary/30 transition-all duration-300`}
              >
                {/* Icon with animated background */}
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{method.name}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>

                {/* Hover arrow */}
                <ArrowRight className="absolute top-4 right-4 w-4 h-4 text-primary/0 group-hover:text-primary/60 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Subtle animated dots */}
        <div className="flex items-center gap-2 pt-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/30"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}; 