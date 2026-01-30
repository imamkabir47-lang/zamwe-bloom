import { motion } from "framer-motion";
import logo from "@/assets/logo-zamwe.png";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner = ({ fullScreen = true, message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-background/95 backdrop-blur-sm z-[100]" : "py-12"
      }`}
    >
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary" />
      </motion.div>
      
      <motion.div
        className="absolute"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <img src={logo} alt="ZAMWE" className="w-10 h-10" />
      </motion.div>
      
      <motion.div
        className="mt-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="font-serif text-2xl font-bold text-gradient-primary">ZAMWE</span>
        <motion.span
          className="text-sm text-muted-foreground mt-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.span>
      </motion.div>
      
      {/* Animated dots */}
      <div className="flex gap-1 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
