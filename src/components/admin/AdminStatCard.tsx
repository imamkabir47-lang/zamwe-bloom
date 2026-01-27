import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

interface AdminStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  description?: string;
  variant?: "primary" | "accent" | "success" | "warning";
  delay?: number;
}

export const AdminStatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  variant = "primary",
  delay = 0
}: AdminStatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const variantStyles = {
    primary: {
      bg: "from-primary/20 via-primary/10 to-transparent",
      icon: "bg-primary/10 text-primary",
      border: "border-primary/20"
    },
    accent: {
      bg: "from-accent/20 via-accent/10 to-transparent",
      icon: "bg-accent/20 text-accent-foreground",
      border: "border-accent/20"
    },
    success: {
      bg: "from-green-500/20 via-green-500/10 to-transparent",
      icon: "bg-green-500/10 text-green-600",
      border: "border-green-500/20"
    },
    warning: {
      bg: "from-orange-500/20 via-orange-500/10 to-transparent",
      icon: "bg-orange-500/10 text-orange-600",
      border: "border-orange-500/20"
    }
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-card border p-6 cursor-pointer group",
        styles.border
      )}
    >
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-60 group-hover:opacity-100 transition-opacity",
        styles.bg
      )} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
            styles.icon
          )}>
            <Icon className="h-7 w-7" />
          </div>
          
          {trend !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full",
              trend >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {trend >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        <div>
          <motion.p
            className="text-4xl font-bold text-foreground mb-1"
            key={displayValue}
          >
            {displayValue.toLocaleString()}
          </motion.p>
          <p className="text-base font-medium text-foreground/80">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
