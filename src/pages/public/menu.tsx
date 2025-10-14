import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  //  Clock,
  //  Star,
  ChefHat,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { publicService } from "@/api/publicService";
import { Product } from "@/api/productService";

export default function PublicMenu() {
  const { orgId, projId } = useParams<{ orgId: string; projId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [projectInfo, setProjectInfo] = useState<{
    name: string;
    description?: string;
    image_url?: string;
    contact_info?: {
      phone?: string;
      email?: string;
      address?: string;
    };
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!orgId || !projId) {
        setError("Parâmetros de organização ou projeto inválidos");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [productsResponse, projectResponse] = await Promise.all([
          publicService.getMenuProducts(orgId, projId),
          publicService.getProjectInfo(orgId, projId).catch(() => ({ data: { name: "Restaurante" } }))
        ]);

        setProducts(productsResponse.data);
        setProjectInfo(projectResponse.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar o cardápio. Verifique se os parâmetros estão corretos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgId, projId]);

  const availableProducts = products.filter(p => p.active);
  const productTypes = Array.from(new Set(availableProducts.map(p => p.type).filter(t => !!t)));
  const categories = ["all", ...productTypes];

  const filteredProducts = selectedCategory === "all"
    ? availableProducts
    : availableProducts.filter(p => p.type === selectedCategory);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Ops! Algo deu errado</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
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
            <h1 className="text-4xl font-bold text-foreground">
              {projectInfo?.name || "Cardápio Digital"}
            </h1>
          </div>

          {projectInfo?.description && (
            <p className="text-xl text-muted-foreground mb-4">
              {projectInfo.description}
            </p>
          )}

          {/* Contact Info */}
          {projectInfo?.contact_info && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              {projectInfo.contact_info.phone && (
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{projectInfo.contact_info.phone}</span>
                </div>
              )}
              {projectInfo.contact_info.email && (
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{projectInfo.contact_info.email}</span>
                </div>
              )}
              {projectInfo.contact_info.address && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{projectInfo.contact_info.address}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-center">Categorias</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === "all" ? "Todos" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleProductClick(product)}
            >
              {/* Product Image - Hero Style */}
              <div className="aspect-square relative overflow-hidden bg-muted">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ChefHat className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}

                {/* Price overlay */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white font-bold text-lg px-3 py-1">
                    R$ {product.price_normal.toFixed(2)}
                  </Badge>
                </div>

                {/* Type badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="capitalize">
                    {product.type || 'Produto'}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>

                  {/* <div className="flex items-center justify-between pt-2">
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
                  </div> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">
              Nenhum produto disponível
            </h3>
            <p className="text-muted-foreground">
              {selectedCategory === "all"
                ? "Não há produtos disponíveis no momento."
                : "Nenhum produto disponível nesta categoria."
              }
            </p>
          </div>
        )}

        {/* Product Detail Modal */}
        <Modal
          isOpen={!!selectedProduct}
          onClose={closeModal}
          size="lg"
        >
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Image */}
              <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
                {selectedProduct.image_url ? (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ChefHat className="h-24 w-24 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                    <Badge variant="secondary" className="capitalize mt-2">
                      {selectedProduct.type || 'Produto'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      R$ {selectedProduct.price_normal.toFixed(2)}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {selectedProduct.description}
                </p>
                {/* 
                <div className="flex items-center space-x-6 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg">4.8</span>
                    <span className="text-muted-foreground">(124 avaliações)</span>
                  </div>

                  {selectedProduct.prep_time_minutes && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-5 w-5" />
                      <span>Tempo de preparo: {selectedProduct.prep_time_minutes} minutos</span>
                    </div>
                  )}
                </div> */}

                {/* Action Button */}
                <div className="pt-4">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      // Aqui você pode implementar lógica para adicionar ao pedido
                      // Por enquanto, apenas fecha o modal
                      closeModal();
                    }}
                  >
                    Ver mais detalhes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}