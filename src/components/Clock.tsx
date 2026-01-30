import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock as ClockIcon } from "lucide-react";

interface ClockProps {
  showDate?: boolean;
  compact?: boolean;
}

const Clock = ({ showDate = false, compact = false }: ClockProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: compact ? undefined : "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <ClockIcon className="w-3.5 h-3.5" />
        <span className="font-mono">{formatTime(time)}</span>
      </div>
    );
  }

  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-2 rounded-xl glass-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="p-2 rounded-lg bg-primary/10">
        <ClockIcon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex flex-col">
        <motion.span
          key={time.getSeconds()}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="font-mono text-lg font-semibold"
        >
          {formatTime(time)}
        </motion.span>
        {showDate && (
          <span className="text-xs text-muted-foreground">{formatDate(time)}</span>
        )}
      </div>
    </motion.div>
  );
};

export default Clock;
