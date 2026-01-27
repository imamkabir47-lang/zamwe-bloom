import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  ShoppingBag, 
  MessageCircle, 
  Users, 
  Calendar, 
  BookOpen,
  Video,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { icon: PlusCircle, label: "Create Post", path: "/create-post", color: "from-primary to-primary/70" },
  { icon: ShoppingBag, label: "Marketplace", path: "/marketplace", color: "from-accent to-accent/70" },
  { icon: MessageCircle, label: "Messages", path: "/messages", color: "from-blue-500 to-blue-400" },
  { icon: Users, label: "Community", path: "/forum", color: "from-green-500 to-green-400" },
  { icon: Calendar, label: "Events", path: "/events", color: "from-purple-500 to-purple-400" },
  { icon: BookOpen, label: "Courses", path: "/courses", color: "from-orange-500 to-orange-400" },
  { icon: Video, label: "Videos", path: "/videos", color: "from-red-500 to-red-400" },
  { icon: FileText, label: "Resources", path: "/resources", color: "from-teal-500 to-teal-400" },
];

export const QuickActionsGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(action.path)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/50 hover:shadow-lg transition-all group"
        >
          <div className={cn(
            "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white",
            action.color
          )}>
            <action.icon className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {action.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};
