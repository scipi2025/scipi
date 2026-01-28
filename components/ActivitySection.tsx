"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface ActivityCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon: "events" | "projects" | "resources";
  color: string;
  delay: number;
  exploreText: string;
}

function ActivityCard({ title, subtitle, href, icon, color, delay, exploreText }: ActivityCardProps) {
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
            {/* Gears/Cogs icon - Projects - Similar to reference image */}
            
            {/* Large gear - top right */}
            <motion.g
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 4, repeat: isHovered ? Infinity : 0, ease: "linear" }}
              style={{ transformOrigin: "58px 38px" }}
            >
              {/* Outer ring */}
              <circle cx="58" cy="38" r="22" fill={color} stroke={color} strokeWidth="2" />
              {/* Inner hole */}
              <circle cx="58" cy="38" r="10" fill="#374151" />
              {/* Inner ring detail */}
              <circle cx="58" cy="38" r="14" fill="none" stroke="#374151" strokeWidth="2" opacity="0.3" />
              {/* Gear teeth - trapezoid style */}
              {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle) => (
                <path
                  key={angle}
                  d="M-5,-3 L5,-3 L4,3 L-4,3 Z"
                  fill={color}
                  transform={`translate(58, 38) rotate(${angle}) translate(0, -25)`}
                />
              ))}
            </motion.g>

            {/* Medium gear - left */}
            <motion.g
              animate={{ rotate: isHovered ? -360 : 0 }}
              transition={{ duration: 3, repeat: isHovered ? Infinity : 0, ease: "linear" }}
              style={{ transformOrigin: "30px 55px" }}
            >
              {/* Outer ring */}
              <circle cx="30" cy="55" r="18" fill={color} opacity="0.85" />
              {/* Inner hole */}
              <circle cx="30" cy="55" r="8" fill="#374151" />
              {/* Inner ring detail */}
              <circle cx="30" cy="55" r="11" fill="none" stroke="#374151" strokeWidth="2" opacity="0.3" />
              {/* Gear teeth */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <path
                  key={angle}
                  d="M-4,-2.5 L4,-2.5 L3,2.5 L-3,2.5 Z"
                  fill={color}
                  opacity="0.85"
                  transform={`translate(30, 55) rotate(${angle}) translate(0, -20)`}
                />
              ))}
            </motion.g>

            {/* Small gear - bottom */}
            <motion.g
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 2.5, repeat: isHovered ? Infinity : 0, ease: "linear" }}
              style={{ transformOrigin: "55px 78px" }}
            >
              {/* Outer ring */}
              <circle cx="55" cy="78" r="12" fill={color} opacity="0.75" />
              {/* Inner hole */}
              <circle cx="55" cy="78" r="5" fill="#374151" />
              {/* Inner ring detail */}
              <circle cx="55" cy="78" r="7" fill="none" stroke="#374151" strokeWidth="1.5" opacity="0.3" />
              {/* Gear teeth */}
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <path
                  key={angle}
                  d="M-3,-2 L3,-2 L2,2 L-2,2 Z"
                  fill={color}
                  opacity="0.75"
                  transform={`translate(55, 78) rotate(${angle}) translate(0, -14)`}
                />
              ))}
            </motion.g>

            {/* Sparkles on hover */}
            {isHovered && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.circle
                  cx="88"
                  cy="18"
                  r="3"
                  fill="#FCD34D"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.circle
                  cx="8"
                  cy="70"
                  r="2.5"
                  fill="#FCD34D"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.4, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
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
          className="relative bg-card border-2 border-border rounded-3xl p-8 md:p-10 flex flex-col items-center text-center transition-colors min-h-[320px] md:min-h-[360px]"
          style={{ borderColor: isHovered ? color : undefined }}
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
          <h3
            className="text-xl md:text-2xl font-bold mb-2 transition-colors duration-300"
            style={{ color: isHovered ? color : undefined }}
          >
            {title}
          </h3>

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
            <span>{exploreText}</span>
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
  const { t } = useLanguage();
  
  const activities = [
    {
      title: t("activity.events"),
      subtitle: t("activity.events.desc"),
      href: "/events",
      icon: "events" as const,
      color: "#3B82F6", // Blue
    },
    {
      title: t("activity.projects"),
      subtitle: t("activity.projects.desc"),
      href: "/projects",
      icon: "projects" as const,
      color: "#10B981", // Green
    },
    {
      title: t("activity.resources"),
      subtitle: t("activity.resources.desc"),
      href: "/resources",
      icon: "resources" as const,
      color: "#8B5CF6", // Purple
    },
  ];

  const exploreText = t("activity.explore");
  const sectionTitle = t("home.activity.title");
  const sectionSubtitle = t("home.activity.subtitle");
  
  return (
    <section className="py-12 md:py-16 bg-linear-to-b from-background to-muted/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          className="flex flex-col items-center text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with icon - inline on small, stacked on large */}
          <div className="flex items-center gap-4 md:flex-col md:gap-0">
            <motion.div 
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-sm md:mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Lightbulb className="size-6 md:size-7 text-primary" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl mb-0 md:mb-4">
              {sectionTitle}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-[600px] mx-auto md:text-lg">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* Activity cards */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {activities.map((activity, index) => (
            <ActivityCard
              key={activity.href}
              {...activity}
              exploreText={exploreText}
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
