import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Clock, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface MessageCardProps {
  message: any;
  onMarkRead: (id: string) => void;
  index: number;
}

export const MessageCard = ({ message, onMarkRead, index }: MessageCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => !message.is_read && onMarkRead(message.id)}
      className={cn(
        "rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg border",
        message.is_read 
          ? "bg-card border-border/50" 
          : "bg-primary/5 border-primary/20 shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold",
            message.is_read ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
          )}>
            {message.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{message.name}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {message.email}
              </span>
              {message.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {message.phone}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {!message.is_read && (
            <Badge className="bg-primary/10 text-primary border-primary/20">
              New
            </Badge>
          )}
          {message.is_read && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>
      </div>

      <div className="pl-15">
        <p className="text-foreground/80 text-sm leading-relaxed line-clamp-3 mb-3">
          {message.message}
        </p>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {formatDistanceToNow(new Date(message.submitted_at), { addSuffix: true })}
        </div>
      </div>
    </motion.div>
  );
};
