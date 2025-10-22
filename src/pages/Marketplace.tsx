import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Package, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: any;
  stock_quantity: number;
  views: number;
  seller?: { full_name: string; business_name?: string };
}

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:profiles!products_seller_id_fkey(full_name, business_name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Card key={i}>
              <Skeleton className="h-64 w-full" />
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
          <h1 className="text-4xl font-bold mb-4 text-gradient-primary">Member Marketplace</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and support products from fellow ZAMWE members
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="hover-lift cursor-pointer group" onClick={() => navigate(`/marketplace/${product.id}`)}>
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                {product.images && Array.isArray(product.images) && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-primary" />
                  </div>
                )}
              </div>
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge>{product.category}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{product.views}</span>
                  </div>
                </div>
                <CardTitle className="line-clamp-2 text-lg">{product.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-primary">
                      {product.currency} {product.price.toLocaleString()}
                    </p>
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    by {product.seller?.business_name || product.seller?.full_name || 'ZAMWE Member'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
