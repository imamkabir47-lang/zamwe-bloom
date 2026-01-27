import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Settings, LogOut, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  profile: any;
  user: any;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  onLogout: () => void;
}

export const ProfileCard = ({ profile, user, stats, onLogout }: ProfileCardProps) => {
  const navigate = useNavigate();
  const isPro = profile?.user_type === "pro";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-primary/5 border border-border/50 p-6"
    >
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        {/* Avatar with ring */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <div className={cn(
              "absolute -inset-1 rounded-full bg-gradient-to-r",
              isPro ? "from-accent via-primary to-accent" : "from-primary to-primary/60",
              "animate-pulse opacity-75"
            )} />
            <div className="relative">
              <img
                src={profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=f472b6&color=ffffff`}
                alt={profile?.full_name}
                className="w-24 h-24 rounded-full object-cover border-4 border-background"
              />
              {profile?.is_verified && (
                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                  <CheckCircle className="h-6 w-6 text-primary fill-primary/20" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-foreground">
              {profile?.full_name || user?.email}
            </h2>
            {isPro && (
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground gap-1">
                <Crown className="h-3 w-3" />
                PRO
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-1">
            @{profile?.username || 'user'}
          </p>
          
          {profile?.business_name && (
            <p className="text-xs text-primary font-medium">
              {profile.business_name}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-6 p-4 rounded-2xl bg-muted/30">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-foreground"
            >
              {stats.posts}
            </motion.div>
            <div className="text-xs text-muted-foreground">Posts</div>
          </div>
          <div className="text-center border-x border-border/50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-foreground"
            >
              {stats.followers}
            </motion.div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-foreground"
            >
              {stats.following}
            </motion.div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button 
            onClick={() => navigate('/profile')} 
            className="w-full gap-2 rounded-xl"
            size="lg"
          >
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button>
          <Button 
            onClick={onLogout} 
            variant="ghost" 
            className="w-full gap-2 text-muted-foreground hover:text-destructive rounded-xl"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
