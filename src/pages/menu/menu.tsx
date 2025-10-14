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
  ChevronUp,
  ImageOff,
  Filter,
  X
} from "lucide-react";
import { Product, productService } from "@/api/productService";
import { Menu, menuService } from "@/api/menuService";
import { Category, categoryService } from "@/api/categoryService";
import { Tag, tagService } from "@/api/tagService";
import { useAuth } from "@/context/authContext";

export default function MenuPage() {
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

  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, menusRes, categoriesRes, tagsRes] = await Promise.all([
        productService.getAll(),
        menuService.getActive(),
        categoryService.getAll(),
        tagService.listActiveTags()
      ]);

      setProducts(productsRes.data);
      setMenus(menusRes.data.filter((m: Menu) => m.active));
      setCategories(categoriesRes.data.filter((c: Category) => c.active));
      setTags(tagsRes.data.filter((t: Tag) => t.active && t.entity_type === 'product'));

      // Carregar tags de cada produto
      const tagsMap = new Map<string, Tag[]>();
      for (const product of productsRes.data) {
        try {
          const productTagsRes = await productService.getProductTags(product.id);
          tagsMap.set(product.id, productTagsRes.data);
        } catch (err) {
          console.error(`Erro ao carregar tags do produto ${product.id}:`, err);
        }
      }
      setProductTags(tagsMap);

    } catch (err) {
      setError("Erro ao carregar o cardápio. Tente novamente mais tarde.");
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

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
                      >
                        {category.name}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isExpanded = expandedProducts.has(product.id);
            const hasDetails = product.description && user;
            const prodTags = productTags.get(product.id) || [];

            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}

                  {/* Placeholder */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      product.image_url ? 'hidden' : 'flex'
                    }`}
                    style={{ display: product.image_url ? 'none' : 'flex' }}
                  >
                    <div className="text-center p-4">
                      <ImageOff className="h-12 w-12 text-muted-foreground/40 mx-auto mb-2" />
                      <span className="text-xs text-muted-foreground/60 font-medium block mb-1">
                        Sem imagem
                      </span>
                    </div>
                  </div>

                  {/* Type badge overlay */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {product.type || 'Produto'}
                    </Badge>
                  </div>

                  {/* Price badge overlay */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-600 text-white font-bold">
                      R$ {product.price_normal.toFixed(2)}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </CardDescription>

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
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Product Info Row */}
                  <div className="flex items-center justify-between mb-3">
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
                      <h4 className="font-medium text-sm mb-2">Detalhes:</h4>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                  )}

                  {/* Ver mais detalhes button */}
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
            <p className="text-muted-foreground text-lg mb-2">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
