import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Import all event images
import turbaning from "@/assets/events/turbaning-ceremony.jpeg";
import government from "@/assets/events/government-meeting.jpeg";
import tradeshow1 from "@/assets/events/tradeshow-promo-1.jpeg";
import tradeshow2 from "@/assets/events/tradeshow-promo-2.jpeg";
import groupEvent from "@/assets/events/group-event.jpeg";
import teamPhoto from "@/assets/events/team-photo.jpeg";
import zamweTradeshow from "@/assets/events/zamwe-tradeshow.jpeg";
import kidsCarnival from "@/assets/posters/kids-carnival.jpeg";
import meetGreet from "@/assets/posters/meet-and-greet.jpeg";
import tradeshowPoster from "@/assets/posters/tradeshow-poster.jpeg";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const images = [
    { src: zamweTradeshow, category: "events", title: "ZAMWE Tradeshow 0.3" },
    { src: turbaning, category: "events", title: "Turbaning Ceremony" },
    { src: government, category: "events", title: "Government Meeting" },
    { src: tradeshow1, category: "events", title: "Tradeshow Promotion" },
    { src: tradeshow2, category: "events", title: "Tradeshow Event" },
    { src: groupEvent, category: "members", title: "Group Event" },
    { src: teamPhoto, category: "members", title: "Team Photo" },
    { src: kidsCarnival, category: "workshops", title: "Kids Carnival" },
    { src: meetGreet, category: "workshops", title: "Meet and Greet" },
    { src: tradeshowPoster, category: "events", title: "Tradeshow Poster" },
  ];

  const filteredImages = filter === "all" 
    ? images 
    : images.filter(img => img.category === filter);

  const categories = [
    { id: "all", label: "All" },
    { id: "events", label: "Events" },
    { id: "members", label: "Members" },
    { id: "workshops", label: "Workshops" },
    { id: "market-days", label: "Market Days" },
  ];

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Our Gallery
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Moments capturing the spirit of women empowerment, community, and entrepreneurial excellence
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={filter === cat.id ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-sm hover-scale"
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <Card
              key={index}
              className="group overflow-hidden cursor-pointer hover-scale animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-medium">{image.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-foreground/60 text-lg">No images found in this category</p>
          </div>
        )}

        {/* Lightbox */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Gallery image"
                className="w-full h-auto"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Gallery;
