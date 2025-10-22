import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  views: number;
  created_at: string;
}

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(videos.map(v => v.category))];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient-primary">Video Library</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch educational videos, success stories, and workshops from our community
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Button
            variant={searchQuery === '' ? 'default' : 'outline'}
            onClick={() => setSearchQuery('')}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={searchQuery === category ? 'default' : 'outline'}
              onClick={() => setSearchQuery(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <Card key={video.id} className="hover-lift cursor-pointer group">
              <div className="relative aspect-video bg-muted overflow-hidden">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                    <Play className="h-16 w-16 text-primary" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="lg" className="rounded-full">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Now
                  </Button>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-primary">{video.category}</span>
                  <span className="text-xs text-muted-foreground">{video.views} views</span>
                </div>
                <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {video.description || 'No description available'}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No videos found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
