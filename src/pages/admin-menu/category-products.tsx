import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Product, productService } from "../../api/productService";
import { Category, categoryService } from "../../api/categoryService";
import { Menu, menuService } from "../../api/menuService";
import {
  Plus,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Loader2,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Package,
  ImageOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ConfirmModal from "@/components/confirmModal";
import ProductForm from "../products/form";

export default function CategoryProducts() {
  const navigate = useNavigate();
  const { menuId, categoryId } = useParams<{
    menuId: string;
    categoryId: string;
  }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (menuId && categoryId) {
      loadData();
    }
  }, [menuId, categoryId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Carregar menu, categoria e produtos em paralelo
      const [menuResponse, categoryResponse, productsResponse] =
        await Promise.all([
          menuId ? menuService.getById(menuId) : Promise.resolve(null),
          categoryId ? categoryService.getById(categoryId) : Promise.resolve(null),
          categoryId
            ? productService.getByCategory(categoryId)
            : Promise.resolve({ data: [] }),
        ]);

      if (menuResponse) setMenu(menuResponse.data);
      if (categoryResponse) setCategory(categoryResponse.data);
      setProducts(productsResponse.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await productService.remove(selectedProduct.id);
      await loadData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      await productService.updateStatus(product.id, !product.active);
      await loadData();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleMoveUp = async (product: Product, index: number) => {
    if (index === 0) return;
    try {
      const prevProduct = products[index - 1];
      await productService.updateOrder(product.id, prevProduct.order);
      await productService.updateOrder(prevProduct.id, product.order);
      await loadData();
    } catch (error) {
      console.error("Erro ao mover produto:", error);
    }
  };

  const handleMoveDown = async (product: Product, index: number) => {
    if (index === products.length - 1) return;
    try {
      const nextProduct = products[index + 1];
      await productService.updateOrder(product.id, nextProduct.order);
      await productService.updateOrder(nextProduct.id, product.order);
      await loadData();
    } catch (error) {
      console.error("Erro ao mover produto:", error);
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setSelectedProduct(null);
    loadData();
  };

  const handleFormCancel = () => {
    setIsFormModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin-menu")}
          className="mb-2 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Cardápios
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span
            onClick={() => navigate("/admin-menu")}
            className="hover:text-foreground cursor-pointer"
          >
            Admin Menu
          </span>
          <span>/</span>
          <span
            onClick={() => navigate(`/admin-menu/${menuId}/categories`)}
            className="hover:text-foreground cursor-pointer"
          >
            {menu?.name || "Cardápio"}
          </span>
          <span>/</span>
          <span className="text-foreground font-medium">
            {category?.name || "Categoria"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Produtos - {category?.name || "Categoria"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os produtos desta categoria
            </p>
          </div>
          <Button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Novo Produto
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Nenhum produto cadastrado</p>
            <Button onClick={handleOpenCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Produto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className={`hover:shadow-lg transition-shadow ${
                !product.active ? "opacity-60" : ""
              }`}
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted rounded-t-lg">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageOff className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Button
                      onClick={() => handleToggleStatus(product)}
                      variant={product.active ? "default" : "outline"}
                      size="sm"
                      className="px-2"
                      title={product.active ? "Pausar" : "Ativar"}
                    >
                      {product.active ? (
                        <Power className="h-4 w-4" />
                      ) : (
                        <PowerOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold truncate">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-success text-white">
                          R$ {product.price_normal.toFixed(2)}
                        </Badge>
                        {product.type && (
                          <Badge variant="outline" className="capitalize">
                            {product.type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    Ordem: {product.order}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveUp(product, index)}
                        disabled={index === 0}
                        className="px-2"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveDown(product, index)}
                        disabled={index === products.length - 1}
                        className="px-2"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditModal(product)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <ProductForm
              initialData={selectedProduct || undefined}
              preselectedCategoryId={categoryId}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Deletar Produto"
        message={`Tem certeza que deseja deletar o produto "${selectedProduct?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
