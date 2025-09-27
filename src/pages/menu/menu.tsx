import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Star,
  ChefHat,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Product, productService } from "@/api/productService";
import { getCategoryDisplayName, getOrganizedCategories } from "@/lib/categories";
import { useAuth } from "@/context/authContext";

export default function PublicMenu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAll();
        setProducts(response.data);
      } catch (err) {
        setError("Erro ao carregar o cardápio. Tente novamente mais tarde.");
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const availableProducts = products.filter(p => p.available);
  const productCategories = Array.from(new Set(availableProducts.map(p => p.category)));
  const organizedCategories = getOrganizedCategories(productCategories);
  const categories = ["all", ...organizedCategories];

  const filteredProducts = selectedCategory === "all"
    ? availableProducts
    : availableProducts.filter(p => p.category === selectedCategory);

  const toggleProductExpansion = (productId: string) => {
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Cardápio Digital</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Conheça nossos pratos deliciosos
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Categorias</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === "all" ? "Todos" : getCategoryDisplayName(category)}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isExpanded = expandedProducts.has(product.id);
            const hasDetails = product.notes && user; // Notas só aparecem para usuários logados

            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                {product.image_url && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant="secondary" className="capitalize">
                      {getCategoryDisplayName(product.category)}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">4.8</span>
                    </div>
                    {product.prep_time_minutes && (
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{product.prep_time_minutes} min</span>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && hasDetails && (
                    <div className="mb-4 p-3 bg-muted rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Notas do Chef:</h4>
                      <p className="text-sm text-muted-foreground">{product.notes}</p>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-green-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Ver mais detalhes button - só aparece se há detalhes para mostrar */}
                  {hasDetails && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleProductExpansion(product.id)}
                      className="w-full"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Ver menos detalhes
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Ver mais detalhes
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum produto disponível nesta categoria.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}