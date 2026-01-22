"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

interface ActivityCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon: "events" | "projects" | "resources";
  color: string;
  delay: number;
}

function ActivityCard({ title, subtitle, href, icon, color, delay }: ActivityCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: [0, -5, 5, -5, 0],
      transition: { rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 0.5 } }
    }
  };

  const cardVariants = {
    idle: { y: 0 },
    hover: { y: -8, transition: { type: "spring" as const, stiffness: 300 } }
  };

  const renderIcon = () => {
    const baseClass = "w-24 h-24 md:w-28 md:h-28";
    
    switch (icon) {
      case "events":
        return (
          <motion.svg
            viewBox="0 0 100 100"
            className={baseClass}
            variants={iconVariants}
            animate={isHovered ? "hover" : "idle"}
          >
            {/* Calendar body */}
            <motion.rect
              x="15"
              y="25"
              width="70"
              height="60"
              rx="8"
              fill={color}
              initial={{ opacity: 0.9 }}
              animate={{ opacity: isHovered ? 1 : 0.9 }}
            />
            {/* Calendar top */}
            <rect x="15" y="25" width="70" height="18" rx="8" fill={color} opacity="0.8" />
            {/* Calendar rings */}
            <motion.rect
              x="30"
              y="18"
              width="8"
              height="16"
              rx="4"
              fill="#374151"
              animate={{ y: isHovered ? [18, 14, 18] : 18 }}
              transition={{ duration: 0.3 }}
            />
            <motion.rect
              x="62"
              y="18"
              width="8"
              height="16"
              rx="4"
              fill="#374151"
              animate={{ y: isHovered ? [18, 14, 18] : 18 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
            {/* Calendar dots/events */}
            <motion.circle
              cx="35"
              cy="58"
              r="6"
              fill="white"
              animate={{ scale: isHovered ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4, delay: 0 }}
            />
            <motion.circle
              cx="50"
              cy="58"
              r="6"
              fill="white"
              animate={{ scale: isHovered ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            <motion.circle
              cx="65"
              cy="58"
              r="6"
              fill="white"
              animate={{ scale: isHovered ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />
            {/* Star burst on hover */}
            {isHovered && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <motion.circle
                  cx="75"
                  cy="30"
                  r="3"
                  fill="#FCD34D"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </motion.g>
            )}
          </motion.svg>
        );
      
      case "projects":
        return (
          <motion.svg
            viewBox="0 0 100 100"
            className={baseClass}
            variants={iconVariants}
            animate={isHovered ? "hover" : "idle"}
          >
            {/* Base/Platform */}
            <motion.ellipse
              cx="50"
              cy="88"
              rx="35"
              ry="5"
              fill={color}
              opacity="0.7"
            />
            <motion.rect
              x="35"
              y="83"
              width="30"
              height="5"
              rx="2"
              fill={color}
            />
            
            {/* Main vertical arm */}
            <motion.rect
              x="32"
              y="30"
              width="6"
              height="53"
              rx="2"
              fill={color}
              opacity="0.9"
            />
            
            {/* Stage (sample platform) */}
            <motion.ellipse
              cx="50"
              cy="70"
              rx="18"
              ry="3"
              fill={color}
              opacity="0.6"
            />
            <motion.rect
              x="32"
              y="68"
              width="36"
              height="4"
              rx="2"
              fill={color}
            />
            
            {/* Stage clips */}
            <motion.rect
              x="40"
              y="66"
              width="3"
              height="6"
              rx="1"
              fill="#374151"
            />
            <motion.rect
              x="57"
              y="66"
              width="3"
              height="6"
              rx="1"
              fill="#374151"
            />
            
            {/* Objective lenses (turret) */}
            <motion.circle
              cx="38"
              cy="58"
              r="8"
              fill={color}
              opacity="0.8"
            />
            <motion.circle
              cx="38"
              cy="58"
              r="4"
              fill="#374151"
              animate={{ 
                scale: isHovered ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
            />
            
            {/* Body tube (angled) */}
            <motion.rect
              x="30"
              y="25"
              width="12"
              height="35"
              rx="3"
              fill={color}
              style={{ transformOrigin: "36px 58px" }}
              animate={{ 
                rotate: isHovered ? [0, -3, 0] : 0 
              }}
              transition={{ duration: 0.8, repeat: isHovered ? Infinity : 0 }}
            />
            
            {/* Eyepiece tube */}
            <motion.rect
              x="33"
              y="12"
              width="8"
              height="16"
              rx="4"
              fill="#374151"
            />
            <motion.ellipse
              cx="37"
              cy="12"
              rx="5"
              ry="2"
              fill="#1F2937"
            />
            
            {/* Focus knobs */}
            <motion.circle
              cx="44"
              cy="45"
              r="4"
              fill="#374151"
              animate={{ 
                rotate: isHovered ? [0, 360] : 0 
              }}
              transition={{ duration: 2, repeat: isHovered ? Infinity : 0, ease: "linear" }}
            />
            <motion.circle
              cx="44"
              cy="45"
              r="2"
              fill={color}
            />
            
            {/* Arm connecting to base */}
            <motion.path
              d="M 38 83 Q 45 75, 38 58"
              fill="none"
              stroke={color}
              strokeWidth="6"
              opacity="0.9"
            />
            
            {/* Light source indicator */}
            <motion.circle
              cx="50"
              cy="78"
              r="3"
              fill="#FCD34D"
              animate={{ 
                opacity: isHovered ? [0.4, 1, 0.4] : 0.6,
              }}
              transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
            />
            
            {/* Light rays on hover */}
            {isHovered && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.line
                  x1="50" y1="75" x2="50" y2="68"
                  stroke="#FCD34D"
                  strokeWidth="2"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
                <motion.line
                  x1="47" y1="76" x2="44" y2="69"
                  stroke="#FCD34D"
                  strokeWidth="1.5"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                />
                <motion.line
                  x1="53" y1="76" x2="56" y2="69"
                  stroke="#FCD34D"
                  strokeWidth="1.5"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
              </motion.g>
            )}
          </motion.svg>
        );
      
      case "resources":
        return (
          <motion.svg
            viewBox="0 0 100 100"
            className={baseClass}
            variants={iconVariants}
            animate={isHovered ? "hover" : "idle"}
          >
            {/* Book stack - bottom book */}
            <motion.rect
              x="20"
              y="60"
              width="60"
              height="15"
              rx="3"
              fill={color}
              opacity="0.6"
              animate={{ x: isHovered ? 18 : 20 }}
              transition={{ duration: 0.3 }}
            />
            {/* Book stack - middle book */}
            <motion.rect
              x="22"
              y="45"
              width="56"
              height="15"
              rx="3"
              fill={color}
              opacity="0.8"
              animate={{ x: isHovered ? 24 : 22 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            />
            {/* Book stack - top book (open) */}
            <motion.g
              animate={{ y: isHovered ? -5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Left page */}
              <motion.path
                d="M50 20 L25 25 L25 50 L50 45 Z"
                fill="white"
                stroke={color}
                strokeWidth="2"
                animate={{ 
                  rotateY: isHovered ? -15 : 0,
                  d: isHovered 
                    ? "M50 18 L20 25 L20 52 L50 43 Z" 
                    : "M50 20 L25 25 L25 50 L50 45 Z"
                }}
                transition={{ duration: 0.4 }}
              />
              {/* Right page */}
              <motion.path
                d="M50 20 L75 25 L75 50 L50 45 Z"
                fill="white"
                stroke={color}
                strokeWidth="2"
                animate={{ 
                  rotateY: isHovered ? 15 : 0,
                  d: isHovered 
                    ? "M50 18 L80 25 L80 52 L50 43 Z" 
                    : "M50 20 L75 25 L75 50 L50 45 Z"
                }}
                transition={{ duration: 0.4 }}
              />
              {/* Text lines */}
              <motion.line x1="30" y1="32" x2="45" y2="30" stroke={color} strokeWidth="2" opacity="0.5" />
              <motion.line x1="30" y1="38" x2="45" y2="36" stroke={color} strokeWidth="2" opacity="0.5" />
              <motion.line x1="55" y1="30" x2="70" y2="32" stroke={color} strokeWidth="2" opacity="0.5" />
              <motion.line x1="55" y1="36" x2="70" y2="38" stroke={color} strokeWidth="2" opacity="0.5" />
            </motion.g>
            {/* Sparkles on hover */}
            {isHovered && (
              <>
                <motion.circle
                  cx="80"
                  cy="20"
                  r="3"
                  fill="#FCD34D"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.circle
                  cx="15"
                  cy="35"
                  r="2"
                  fill="#FCD34D"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                />
              </>
            )}
          </motion.svg>
        );
    }
  };

  return (
    <Link href={href}>
      <motion.div
        className="relative group cursor-pointer"
        variants={cardVariants}
        initial="idle"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl blur-xl"
          style={{ backgroundColor: color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Card */}
        <motion.div
          className="relative bg-card border-2 rounded-3xl p-8 md:p-10 flex flex-col items-center text-center transition-colors min-h-[320px] md:min-h-[360px]"
          style={{ borderColor: isHovered ? color : "hsl(var(--border))" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay }}
        >
          {/* Floating particles */}
          {isHovered && (
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: color,
                    left: `${20 + i * 15}%`,
                    bottom: "10%"
                  }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ 
                    y: -100, 
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}

          {/* Icon */}
          <div className="mb-6">
            {renderIcon()}
          </div>

          {/* Title */}
          <motion.h3
            className="text-xl md:text-2xl font-bold mb-2"
            animate={{ color: isHovered ? color : "hsl(var(--foreground))" }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h3>

          {/* Subtitle */}
          <p className="text-muted-foreground text-sm md:text-base">
            {subtitle}
          </p>

          {/* Arrow indicator */}
          <motion.div
            className="mt-4 flex items-center gap-2 text-sm font-medium"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span>Explorează</span>
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                d="M4 10H16M16 10L11 5M16 10L11 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
}

export function ActivitySection() {
  const activities = [
    {
      title: "Evenimente",
      subtitle: "Conferințe, workshop-uri și întâlniri profesionale",
      href: "/events",
      icon: "events" as const,
      color: "#3B82F6", // Blue
    },
    {
      title: "Proiecte de cercetare",
      subtitle: "Cercetare clinică și studii inovatoare",
      href: "/projects",
      icon: "projects" as const,
      color: "#10B981", // Green
    },
    {
      title: "Resurse educaționale",
      subtitle: "Ghiduri, articole și materiale de studiu",
      href: "/resources",
      icon: "resources" as const,
      color: "#8B5CF6", // Purple
    },
  ];
  
  return (
    <section className="py-12 md:py-16 bg-linear-to-b from-background to-muted/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Descoperă
          </motion.span>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Activitatea noastră
          </h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto md:text-lg">
            Explorează evenimentele, proiectele și resursele comunității SCIPI
          </p>
        </motion.div>

        {/* Activity cards */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {activities.map((activity, index) => (
            <ActivityCard
              key={activity.href}
              {...activity}
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
