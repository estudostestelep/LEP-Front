import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CategoryImage } from "@/components/CategoryImage";
import MenuSelector from "@/components/MenuSelector";
import { useIsDesktop } from "@/hooks/useMediaQuery";

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
  const { user, currentProject, currentOrganization } = useAuth();

  useEffect(() => {
    fetchData();
  }, [currentProject, currentOrganization]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // ✨ OTIMIZAÇÃO: Carregar produtos com tags em uma única requisição
      const [productsRes, menusRes, categoriesRes, tagsRes] = await Promise.all([
        productService.getAll({ includeTags: true }),
        menuService.getActive(),
        categoryService.getAll(),
        tagService.listActiveTags()
      ]);

      setProducts(productsRes.data);
      const activeMenus = menusRes.data.filter((m: Menu) => m.active);
      setMenus(activeMenus);
      setCategories(categoriesRes.data.filter((c: Category) => c.active));
      setTags(tagsRes.data.filter((t: Tag) => t.active && t.entity_type === 'product'));

      // ✨ OTIMIZAÇÃO: Construir mapa de tags a partir dos dados já carregados
      const tagsMap = new Map<string, Tag[]>();
      for (const product of productsRes.data) {
        if (product.tags && product.tags.length > 0) {
          tagsMap.set(product.id, product.tags);
        }
      }
      setProductTags(tagsMap);

      // ✨ SELEÇÃO INTELIGENTE: Selecionar o primeiro menu ativo automaticamente (maior prioridade)
      if (activeMenus.length > 0) {
        setSelectedMenu(activeMenus[0].id);
        setSelectedCategory("all");
        setSelectedType("all");
      }

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
    // Resetar para o primeiro menu ativo (seleção automática)
    if (menus.length > 0) {
      setSelectedMenu(menus[0].id);
    }
    setSelectedCategory("all");
    setSelectedType("all");
    setSelectedTags(new Set());
  };

  const hasActiveFilters = selectedType !== "all" ||
    selectedCategory !== "all" ||
    selectedTags.size > 0 ||
    selectedMenu !== (menus.length > 0 ? menus[0].id : "all");

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
        {/* Título Principal */}
        <div className="mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ChefHat className="h-8 w-8 text-foreground" />
              <h1 className="text-4xl font-bold text-foreground">Cardápio Digital</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Conheça nossos pratos deliciosos
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <Filter className="h-5 w-5 flex-shrink-0" />
                <CardTitle className="text-lg">Filtros</CardTitle>
              </div>

              {/* MenuSelector discreto dentro dos filtros - mobile first */}
              <div className="w-full sm:w-auto order-3 sm:order-none">
                <MenuSelector />
              </div>

              {/* Botões de controle */}
              <div className="flex items-center gap-2 order-2 sm:order-none ml-auto sm:ml-0">
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
                    <Button
                      variant={selectedTags.size === 0 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTags(new Set())}
                    >
                      Todas
                    </Button>
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

        <ProductsDisplay products={filteredProducts} expandedProducts={expandedProducts} toggleProductExpansion={toggleProductExpansion} user={user} productTags={productTags} />


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

/**
 * Componente responsivo que exibe produtos em:
 * - Mobile (< lg): Lista horizontal
 * - Desktop (>= lg): Grid de cards
 */
interface ProductsDisplayProps {
  products: Product[];
  expandedProducts: Set<string>;
  toggleProductExpansion: (id: string) => void;
  user: any;
  productTags: Map<string, Tag[]>;
}

function ProductsDisplay({
  products,
  expandedProducts,
  toggleProductExpansion,
  user,
  productTags,
}: ProductsDisplayProps) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    // Desktop: Grid de Cards
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => {
          const isExpanded = expandedProducts.has(product.id);
          const hasDetails = product.description && user;
          const prodTags = productTags.get(product.id) || [];

          return (
            <Card
              key={product.id}
              className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted flex-shrink-0">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <CardContent className="flex-1 flex flex-col p-3">
                {/* Name and Price */}
                <div className="mb-2">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h3>
                  <span className="text-price font-bold text-base">
                    R$ {product.price_normal.toFixed(2)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2 flex-1">
                  {product.description}
                </p>

                {/* Meta Info: Tags, Time, Rating */}
                <div className="space-y-1 text-xs text-muted-foreground">
                  {/* Tags */}
                  {prodTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {prodTags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs py-0"
                          style={{
                            borderColor: tag.color,
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Prep Time and Rating */}
                  <div className="flex items-center gap-3">
                    {product.prep_time_minutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{product.prep_time_minutes}min</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>4.8</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Expanded Details (Desktop) */}
              {isExpanded && hasDetails && (
                <div className="border-t border-border p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground">{product.description}</p>
                </div>
              )}

              {/* Action Button */}
              {hasDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleProductExpansion(product.id)}
                  className="w-full rounded-none border-t border-border text-xs h-8"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Mais
                    </>
                  )}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    );
  }

  // Mobile: Lista horizontal (como estava antes)
  return (
    <div className="space-y-3 sm:space-y-4">
      {products.map((product) => {
        const isExpanded = expandedProducts.has(product.id);
        const hasDetails = product.description && user;
        const prodTags = productTags.get(product.id) || [];

        return (
          <div
            key={product.id}
            className="border border-border rounded-lg overflow-hidden hover:bg-accent/50 transition-colors duration-200"
          >
            {/* Product Row */}
            <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
              {/* Product Image Thumbnail */}
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Product Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                {/* Header: Name and Price */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                    {product.name}
                  </h3>
                  <span className="text-price font-bold text-sm sm:text-base flex-shrink-0 whitespace-nowrap">
                    R$ {product.price_normal.toFixed(2)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                  {product.description}
                </p>

                {/* Tags and Meta Info */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Tags */}
                  {prodTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {prodTags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs py-0"
                          style={{
                            borderColor: tag.color,
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Prep Time */}
                  {product.prep_time_minutes && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{product.prep_time_minutes}min</span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && hasDetails && (
              <div className="border-t border-border p-3 sm:p-4 bg-muted/30">
                <h4 className="font-medium text-sm mb-2">Detalhes:</h4>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
            )}

            {/* Ver mais detalhes button */}
            {hasDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleProductExpansion(product.id)}
                className="w-full rounded-none border-t border-border"
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
          </div>
        );
      })}
    </div>
  );
}
