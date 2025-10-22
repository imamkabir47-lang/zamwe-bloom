import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, Plus, Search, Pin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: string;
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  created_at: string;
  author?: { full_name: string; photo_url?: string };
}

const Forum = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ['General', 'Business Tips', 'Networking', 'Success Stories', 'Questions', 'Announcements'];

  useEffect(() => {
    checkUser();
    loadPosts();
    setupRealtime();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          author:profiles!forum_posts_author_id_fkey(full_name, photo_url)
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtime = () => {
    const channel = supabase
      .channel('forum_posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_posts'
        },
        () => loadPosts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createPost = async () => {
    if (!currentUser) {
      toast({ title: 'Please log in to create a post', variant: 'destructive' });
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim() || !selectedCategory) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.from('forum_posts').insert({
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        category: selectedCategory,
        author_id: currentUser.id
      });

      if (error) throw error;

      toast({ title: 'Post created successfully!' });
      setNewPostTitle('');
      setNewPostContent('');
      setSelectedCategory('');
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error creating post', variant: 'destructive' });
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient-primary mb-2">Community Forum</h1>
            <p className="text-muted-foreground">Share ideas, ask questions, and connect with members</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Enter post title..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map(cat => (
                      <Button
                        key={cat}
                        variant={selectedCategory === cat ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(cat)}
                        size="sm"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    placeholder="Write your post content..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={6}
                  />
                </div>
                <Button onClick={createPost} className="w-full">Create Post</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-xl mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.map(post => (
            <Card key={post.id} className="hover-lift cursor-pointer" onClick={() => navigate(`/forum/${post.id}`)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar>
                      <AvatarImage src={post.author?.photo_url} />
                      <AvatarFallback>{post.author?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        {post.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        by {post.author?.full_name || 'Unknown'} • {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge>{post.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 mb-4">{post.content}</CardDescription>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments_count} comments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No posts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
