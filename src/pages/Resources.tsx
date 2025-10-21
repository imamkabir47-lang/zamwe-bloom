import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Resources = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error loading resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", ...Array.from(new Set(resources.map((r) => r.category)))];

  const filteredResources =
    selectedCategory === "all"
      ? resources
      : resources.filter((r) => r.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 flex items-center justify-center">
        <div className="text-foreground/60">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Resources
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Download templates, guides, and training materials to grow your business
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              size="sm"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                  <Badge variant="outline">{resource.category}</Badge>
                </div>
              </div>

              {resource.description && (
                <p className="text-sm text-foreground/70 mb-4">
                  {resource.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-foreground/60 mb-4">
                <Calendar className="w-3 h-3" />
                <span>
                  Added {formatDistanceToNow(new Date(resource.created_at))} ago
                </span>
              </div>

              <Button
                onClick={() => window.open(resource.file_url, "_blank")}
                className="w-full"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <Card className="p-12 text-center text-foreground/60">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No resources available yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Resources;
