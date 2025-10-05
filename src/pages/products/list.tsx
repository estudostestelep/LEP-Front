import { useEffect, useState } from "react";
import { productService } from "../../api/productService";
import type { Product } from "../../api/productService";
import { Tag, tagService } from "../../api/tagService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Package, Plus, Edit, Trash2, Clock, Filter, X } from "lucide-react";
import { TagBadge } from "@/components/TagBadge";
import ProductForm from "./form";
import ConfirmModal from "@/components/confirmModal";
import { AxiosError } from "axios";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Estados para filtro de tags
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string>("");
  const [productTags, setProductTags] = useState<Map<string, Tag[]>>(new Map());

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await productService.getAll();
      setProducts(response.data);

      // Carregar tags de cada produto
      const tagsMap = new Map<string, Tag[]>();
      for (const product of response.data) {
        try {
          const tagsResponse = await productService.getProductTags(product.id);
          tagsMap.set(product.id, tagsResponse.data);
        } catch (error) {
          console.error(`Erro ao carregar tags do produto ${product.id}:`, error);
          tagsMap.set(product.id, []);
        }
      }
      setProductTags(tagsMap);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      alert(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao carregar produtos"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await tagService.getTagsByEntityType("product");
      setAvailableTags(response.data.filter(tag => tag.active));
    } catch (error) {
      console.error("Erro ao carregar tags:", error);
    }
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await productService.remove(productToDelete);
      setProducts(products.filter(p => p.id !== productToDelete));
      setShowConfirm(false);
      setProductToDelete(null);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      alert(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao excluir mesa"
      );
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  useEffect(() => {
    fetchProducts();
    fetchTags();
  }, []);

  useEffect(() => {
    // Filtrar produtos por tag selecionada
    if (selectedTagId) {
      const filtered = products.filter(product => {
        const tags = productTags.get(product.id) || [];
        return tags.some(tag => tag.id === selectedTagId);
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedTagId, products, productTags]);

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
            <p className="text-muted-foreground mt-2">
              Gerencie os produtos do cardápio
            </p>
          </div>

          <Button
            size="lg"
            className="flex items-center space-x-2"
            onClick={handleNewProduct}
          >
            <Plus className="h-4 w-4" />
            <span>Novo Produto</span>
          </Button>
        </div>

        {/* Filtro de Tags */}
        {availableTags.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <select
                    value={selectedTagId}
                    onChange={(e) => setSelectedTagId(e.target.value)}
                    className="w-full md:w-64 px-3 py-2 border border-input bg-background text-sm rounded-md focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Todas as tags</option>
                    {availableTags.map(tag => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedTagId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTagId("")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                )}
                {selectedTagId && (
                  <span className="text-sm text-muted-foreground">
                    {filteredProducts.length} produto(s) encontrado(s)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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
          {filteredProducts.map((product) => (
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
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => product.id && handleDeleteClick(product.id)}
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
                      R$ {(product.price_normal || product.price || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={(product.active ?? product.available) ? "default" : "secondary"}>
                      {(product.active ?? product.available) ? "Disponível" : "Indisponível"}
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

                  {/* Tags do Produto */}
                  {productTags.get(product.id) && productTags.get(product.id)!.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="flex flex-wrap gap-1">
                        {productTags.get(product.id)!.map(tag => (
                          <TagBadge
                            key={tag.id}
                            name={tag.name}
                            color={tag.color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && !error && products.length > 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Não há produtos com a tag selecionada.
              </p>
              <Button variant="outline" onClick={() => setSelectedTagId("")}>
                Limpar Filtro
              </Button>
            </CardContent>
          </Card>
        )}

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
              <Button onClick={handleNewProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className=" rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <ProductForm
                initialData={editingProduct || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        <ConfirmModal
          open={showConfirm}
          title="Excluir Produto"
          message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowConfirm(false);
            setProductToDelete(null);
          }}
        />
      </div>
    </div>
  );
}
