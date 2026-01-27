import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Clock, Building2, Phone, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  application: any;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  index: number;
}

export const ApplicationCard = ({ application, onApprove, onReject, index }: ApplicationCardProps) => {
  const statusStyles = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    approved: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" }
  };

  const status = statusStyles[application.status as keyof typeof statusStyles] || statusStyles.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl bg-card border border-border/50 p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex gap-5">
        {/* Avatar */}
        <div className="shrink-0">
          <Avatar className="w-20 h-20 border-2 border-primary/20">
            <AvatarImage src={application.photo_url} alt={application.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
              {application.full_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground">{application.full_name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <Building2 className="h-4 w-4" />
                <span>{application.business_name}</span>
                <span className="text-border">•</span>
                <span className="text-primary font-medium">{application.business_type}</span>
              </div>
            </div>
            
            <Badge className={cn(
              "shrink-0 rounded-full px-3 py-1",
              status.bg, status.text, status.border
            )}>
              {application.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
              {application.status === "approved" && <Check className="h-3 w-3 mr-1" />}
              {application.status === "rejected" && <X className="h-3 w-3 mr-1" />}
              {application.status}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{application.phone_number}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{application.email || 'No email'}</span>
            </div>
          </div>

          {/* Why Join */}
          {application.why_join && (
            <div className="bg-muted/30 rounded-xl p-3 mb-4">
              <p className="text-sm text-foreground/80 line-clamp-2">{application.why_join}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                {application.membership_plan}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(application.submitted_at), { addSuffix: true })}
              </span>
            </div>

            {application.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onApprove(application.id)}
                  className="gap-1.5 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject(application.id)}
                  className="gap-1.5"
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
