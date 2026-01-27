import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export const GlassCard = ({ children, className, hover = true, delay = 0 }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-card/80 backdrop-blur-xl",
        "border border-border/50",
        "shadow-lg shadow-primary/5",
        hover && "cursor-pointer transition-shadow hover:shadow-xl hover:shadow-primary/10",
        className
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
