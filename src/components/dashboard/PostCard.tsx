import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Eye, Edit, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PostCardProps {
  post: any;
  index: number;
  onDelete: () => void;
}

export const PostCard = ({ post, index, onDelete }: PostCardProps) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    
    try {
      const { error } = await supabase
        .from('marketplace_posts')
        .delete()
        .eq('id', post.id);
      
      if (error) throw error;
      toast({ title: 'Post deleted successfully' });
      onDelete();
    } catch (err) {
      toast({ title: 'Failed to delete post', variant: 'destructive' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div 
          className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          <img
            src={post.media_urls?.[0] || 'https://via.placeholder.com/300'}
            alt={post.product_name || 'Post'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate">
                {post.product_name || 'Untitled Post'}
              </h3>
              {post.caption && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                  {post.caption}
                </p>
              )}
            </div>
            <Badge 
              variant={post.is_active ? "default" : "secondary"}
              className={cn(
                "shrink-0",
                post.is_active && "bg-green-500/10 text-green-600 border-green-500/20"
              )}
            >
              {post.is_active ? 'Active' : 'Draft'}
            </Badge>
          </div>

          {/* Price */}
          {post.price && (
            <p className="text-lg font-bold text-primary mb-2">
              {post.currency || '₦'} {post.price?.toLocaleString()}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-red-400" />
              <span>{post.likes_count || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-blue-400" />
              <span>{post.comments_count || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-purple-400" />
              <span>{post.views_count || 0}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => navigate(`/post/${post.id}`)}
              className="gap-1.5"
            >
              <ExternalLink className="h-4 w-4" />
              View
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => navigate(`/edit-post/${post.id}`)}
              className="gap-1.5"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleDelete}
              className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
