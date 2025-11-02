import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  MapPin,
  Filter,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { publicService } from "@/api/publicService";
import { Product } from "@/api/productService";
import { Menu, menuService } from "@/api/menuService";
import { Category, categoryService } from "@/api/categoryService";
import { Tag, tagService } from "@/api/tagService";
import { ThemeToggle } from "@/components/theme-toggle";
import { CategoryImage } from "@/components/CategoryImage";

export default function PublicMenu() {
  const { orgId, projId } = useParams<{ orgId: string; projId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [productTags, setProductTags] = useState<Map<string, Tag[]>>(new Map());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedMenu, setSelectedMenu] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(true);

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

        const [productsResponse, projectResponse, menusRes, categoriesRes, tagsRes] = await Promise.all([
          publicService.getMenuProducts(orgId, projId),
          publicService.getProjectInfo(orgId, projId).catch(() => ({ data: { name: "Restaurante" } })),
          menuService.getActive().catch(() => ({ data: [] })),
          categoryService.getAll().catch(() => ({ data: [] })),
          tagService.listActiveTags().catch(() => ({ data: [] }))
        ]);

        setProducts(productsResponse.data);
        setProjectInfo(projectResponse.data);
        setMenus(menusRes.data.filter((m: Menu) => m.active));
        setCategories(categoriesRes.data.filter((c: Category) => c.active));
        setTags(tagsRes.data.filter((t: Tag) => t.active && t.entity_type === 'product'));

        // ✨ OTIMIZAÇÃO: Construir mapa de tags a partir dos dados já carregados
        const tagsMap = new Map<string, Tag[]>();
        for (const product of productsResponse.data) {
          if (product.tags && product.tags.length > 0) {
            tagsMap.set(product.id, product.tags);
          }
        }
        setProductTags(tagsMap);

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

  // Aplicar filtros
  const filteredProducts = availableProducts.filter(product => {
    // Filtro por tipo
    if (selectedType !== "all" && product.type !== selectedType) {
      return false;
    }

    // Filtro por menu (via categoria)
    if (selectedMenu !== "all") {
      const productCategory = categories.find(c => c.id === product.category_id);
      if (!productCategory || productCategory.menu_id !== selectedMenu) {
        return false;
      }
    }

    // Filtro por categoria
    if (selectedCategory !== "all" && product.category_id !== selectedCategory) {
      return false;
    }

    // Filtro por tags (produto deve ter TODAS as tags selecionadas)
    if (selectedTags.size > 0) {
      const prodTags = productTags.get(product.id) || [];
      const prodTagIds = new Set(prodTags.map(t => t.id));
      for (const tagId of selectedTags) {
        if (!prodTagIds.has(tagId)) {
          return false;
        }
      }
    }

    return true;
  });

  // Categorias filtradas por menu selecionado
  const filteredCategories = selectedMenu === "all"
    ? categories
    : categories.filter(c => c.menu_id === selectedMenu);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tagId)) {
        newSet.delete(tagId);
      } else {
        newSet.add(tagId);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedMenu("all");
    setSelectedCategory("all");
    setSelectedTags(new Set());
  };

  const hasActiveFilters = selectedType !== "all" ||
    selectedMenu !== "all" ||
    selectedCategory !== "all" ||
    selectedTags.size > 0;

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
          <div className="flex items-center justify-center space-x-2 mb-4 relative">
            <ChefHat className="h-8 w-8 text-foreground" />
            <h1 className="text-4xl font-bold text-foreground">
              {projectInfo?.name || "Cardápio Digital"}
            </h1>
            <div className="absolute right-0 top-0">
              <ThemeToggle />
            </div>
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
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{projectInfo.contact_info.phone}</span>
                </div>
              )}
              {projectInfo.contact_info.email && (
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{projectInfo.contact_info.email}</span>
                </div>
              )}
              {projectInfo.contact_info.address && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{projectInfo.contact_info.address}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <CardTitle className="text-lg">Filtros</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Mostrar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          {showFilters && (
            <CardContent className="space-y-6">
              {/* Tipo de Produto */}
              <div>
                <h3 className="text-sm font-medium mb-3">Tipo de Produto</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("all")}
                  >
                    Todos
                  </Button>
                  {productTypes.map(type => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                      className="capitalize"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Menu (Cardápio) */}
              {menus.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Menu (Cardápio)</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedMenu === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedMenu("all");
                        setSelectedCategory("all");
                      }}
                    >
                      Todos
                    </Button>
                    {menus.map(menu => (
                      <Button
                        key={menu.id}
                        variant={selectedMenu === menu.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedMenu(menu.id);
                          setSelectedCategory("all");
                        }}
                      >
                        {menu.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categoria */}
              {filteredCategories.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Categoria</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                    >
                      Todas
                    </Button>
                    {filteredCategories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="flex items-center gap-2 relative overflow-hidden"
                      >
                        <CategoryImage
                          imageUrl={category.image_url}
                          categoryName={category.name}
                          asBackground
                          className="absolute inset-0 opacity-20"
                        />
                        <span className="relative z-10 flex items-center gap-2">
                          <CategoryImage
                            imageUrl={category.image_url}
                            categoryName={category.name}
                            size="sm"
                            className="w-6 h-6"
                          />
                          {category.name}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Button
                        key={tag.id}
                        variant={selectedTags.has(tag.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleTag(tag.id)}
                        style={{
                          backgroundColor: selectedTags.has(tag.id) ? tag.color : undefined,
                          borderColor: tag.color,
                          color: selectedTags.has(tag.id) ? '#fff' : undefined
                        }}
                      >
                        {tag.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const prodTags = productTags.get(product.id) || [];

            return (
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

                    {/* Tags do produto */}
                    {prodTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {prodTags.map(tag => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: tag.color,
                              color: tag.color
                            }}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            )}
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