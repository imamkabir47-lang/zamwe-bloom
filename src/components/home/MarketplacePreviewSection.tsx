import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Star, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  product_name: string | null;
  caption: string | null;
  price: number | null;
  currency: string | null;
  media_urls: any;
  likes_count: number | null;
  views_count: number | null;
  average_rating: number | null;
  profiles: {
    full_name: string;
    photo_url: string | null;
    is_verified: boolean | null;
  } | null;
}

const MarketplacePreviewSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("marketplace_posts")
        .select(`
          id,
          product_name,
          caption,
          price,
          currency,
          media_urls,
          likes_count,
          views_count,
          average_rating,
          user_id
        `)
        .eq("is_active", true)
        .order("likes_count", { ascending: false })
        .limit(4);

      if (data) {
        // Fetch profiles separately
        const userIds = data.map(p => p.user_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name, photo_url, is_verified")
          .in("user_id", userIds);

        const productsWithProfiles = data.map(product => ({
          ...product,
          profiles: profilesData?.find(p => p.user_id === product.user_id) || null
        }));

        setProducts(productsWithProfiles as Product[]);
      } else {
        setProducts([]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-2xl mb-3"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-5 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <Badge variant="outline" className="mb-4 border-primary text-primary">
              <ShoppingBag className="w-3 h-3 mr-1" />
              Marketplace
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Popular <span className="text-gradient-primary">Products</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Discover products and services from our talented members
            </p>
          </div>
          <Link to="/marketplace" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              Browse Marketplace
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Card 
                className="group overflow-hidden hover-lift border-0 shadow-md cursor-pointer"
                onClick={() => navigate(`/post/${product.id}`)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={(product.media_urls as string[])?.[0] || "https://via.placeholder.com/300"}
                    alt={product.product_name || "Product"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.average_rating && product.average_rating > 4 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-accent text-accent-foreground">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Top Rated
                      </Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex items-center gap-1 text-sm">
                      <Heart className="w-4 h-4" /> {product.likes_count || 0}
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <Eye className="w-4 h-4" /> {product.views_count || 0}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                    {product.product_name || "Product"}
                  </h3>
                  {product.price && (
                    <p className="text-lg font-bold text-primary mt-1">
                      {product.currency || "₦"} {product.price.toLocaleString()}
                    </p>
                  )}
                  {product.profiles && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <img
                        src={product.profiles.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.profiles.full_name)}`}
                        alt={product.profiles.full_name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="truncate">{product.profiles.full_name}</span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketplacePreviewSection;
