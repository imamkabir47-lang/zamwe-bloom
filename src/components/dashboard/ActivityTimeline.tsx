import { motion } from "framer-motion";
import { Heart, MessageCircle, Eye, UserPlus, ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: "like" | "comment" | "view" | "follow" | "purchase" | "review";
  message: string;
  timestamp: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const iconMap = {
  like: { icon: Heart, color: "text-red-500", bg: "bg-red-50" },
  comment: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-50" },
  view: { icon: Eye, color: "text-purple-500", bg: "bg-purple-50" },
  follow: { icon: UserPlus, color: "text-green-500", bg: "bg-green-50" },
  purchase: { icon: ShoppingBag, color: "text-primary", bg: "bg-primary/10" },
  review: { icon: Star, color: "text-accent", bg: "bg-accent/20" }
};

export const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent activity
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const { icon: Icon, color, bg } = iconMap[activity.type];
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4 pl-2"
            >
              {/* Icon */}
              <div className={cn(
                "relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                bg
              )}>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 pb-4">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
