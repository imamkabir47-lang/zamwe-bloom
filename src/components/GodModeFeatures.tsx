import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  Eye, 
  MessageSquare, 
  TrendingUp,
  Users,
  Rocket,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Live Visitors Counter Component
export const LiveVisitorsBadge = () => {
  const [visitors, setVisitors] = useState(0);
  
  useEffect(() => {
    // Simulate live visitors (in production, use Supabase Presence)
    const updateVisitors = () => {
      setVisitors(Math.floor(Math.random() * 20) + 5);
    };
    updateVisitors();
    const interval = setInterval(updateVisitors, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20">
        <motion.div
          className="w-2 h-2 rounded-full bg-green-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="text-sm font-medium">{visitors} online</span>
        <Eye className="w-4 h-4 text-muted-foreground" />
      </div>
    </motion.div>
  );
};

// Floating Action Button with Quick Actions
export const FloatingActionHub = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const actions = [
    { icon: MessageSquare, label: "Chat", color: "bg-blue-500" },
    { icon: TrendingUp, label: "Analytics", color: "bg-green-500" },
    { icon: Users, label: "Network", color: "bg-purple-500" },
    { icon: Rocket, label: "Boost", color: "bg-orange-500" },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col gap-3 mb-3"
          >
            {actions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`${action.color} p-3 rounded-full text-white shadow-lg hover:scale-110 transition-transform`}
                title={action.label}
              >
                <action.icon className="w-5 h-5" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover-glow"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
};

// Confetti Celebration Effect
export const useConfetti = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string }>>([]);
  
  const trigger = () => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: ["#FF69B4", "#FFD54F", "#4FC3F7", "#81C784"][Math.floor(Math.random() * 4)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  };

  const Confetti = () => (
    <AnimatePresence>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1 }}
          animate={{ y: "100vh", opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 + Math.random() }}
          className="fixed top-0 z-50 pointer-events-none"
          style={{ left: `${p.x}%` }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: p.color }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );

  return { trigger, Confetti };
};

// Smart Greeting based on time
export const SmartGreeting = ({ name }: { name?: string }) => {
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("👋");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
      setEmoji("☀️");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
      setEmoji("🌤️");
    } else if (hour < 21) {
      setGreeting("Good evening");
      setEmoji("🌅");
    } else {
      setGreeting("Good night");
      setEmoji("🌙");
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-lg font-medium">
        {greeting}{name ? `, ${name}` : ""}!
      </span>
    </motion.div>
  );
};

// Keyboard Shortcuts Hook
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Trigger search modal
        document.dispatchEvent(new CustomEvent("open-search"));
      }
      // Ctrl/Cmd + / for help
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent("open-help"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
};

// Scroll Progress Indicator
export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-accent"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};
