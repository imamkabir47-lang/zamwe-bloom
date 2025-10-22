import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Star, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  category: string;
  level: string;
  duration_hours: number;
  price: number;
  enrollments_count: number;
  rating: number;
  instructor?: { full_name: string };
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles!courses_instructor_id_fkey(full_name)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(courses.map(c => c.category))];
  const levels = ['beginner', 'intermediate', 'advanced'];

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
          <h1 className="text-4xl font-bold mb-4 text-gradient-primary">Learning Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enhance your business skills with our comprehensive courses
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="hover-lift cursor-pointer group" onClick={() => navigate(`/courses/${course.id}`)}>
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary" />
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge>{course.category}</Badge>
                  <Badge variant="outline" className="capitalize">{course.level}</Badge>
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration_hours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.enrollments_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-sm text-muted-foreground">by {course.instructor?.full_name || 'ZAMWE'}</p>
                    <p className="text-lg font-bold text-primary">
                      {course.price === 0 ? 'Free' : `₦${course.price.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No courses found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
