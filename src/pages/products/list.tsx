import { useEffect, useState } from "react";
import { productService } from "../../api/productService";
import type { Product } from "../../api/productService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Package, Plus, Edit, Trash2, Clock } from "lucide-react";
import { ProtectedAction } from "@/components/ProtectedFeature";
import { usePermissions } from "@/hooks/usePermissions";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const permissions = usePermissions();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string; message?: string } } };
      setError(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao carregar produtos"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await productService.remove(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string; message?: string } } };
        alert(
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao excluir produto"
        );
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
              <Package className="h-8 w-8" />
              <span>Gerenciar Produtos</span>
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <p className="text-muted-foreground">
                Gerencie os produtos do cardápio
              </p>
              {permissions.usage && permissions.limits && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">
                    Produtos: {permissions.usage.products_count} / {permissions.limits.max_products}
                  </span>
                  {permissions.isNearLimit('products') && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      Próximo ao limite
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          <ProtectedAction
            action="createProduct"
            onUpgrade={() => console.log('Redirect to subscription page')}
          >
            <Button size="lg" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Novo Produto</span>
            </Button>
          </ProtectedAction>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchProducts}
                  className="ml-auto"
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => product.id && handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Preço</span>
                    <span className="font-semibold text-lg">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={product.available ? "default" : "secondary"}>
                      {product.available ? "Disponível" : "Indisponível"}
                    </Badge>
                  </div>

                  {product.prep_time_minutes && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tempo de Preparo</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{product.prep_time_minutes} min</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum produto cadastrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece cadastrando seu primeiro produto do cardápio.
              </p>
              <ProtectedAction
                action="createProduct"
                onUpgrade={() => console.log('Redirect to subscription page')}
              >
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
              </ProtectedAction>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
