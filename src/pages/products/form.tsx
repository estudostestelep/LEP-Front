import { useState, useRef, useEffect } from "react";
import { productService, Product, ProductType, CreateProductDTO } from "@/api/productService";
import { Tag } from "@/api/tagService";
import { Menu, menuService } from "@/api/menuService";
import { Category, categoryService } from "@/api/categoryService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp } from "lucide-react";
import ImageUpload, { ImageUploadRef } from "@/components/ImageUpload";
import { TagSelector } from "@/components/TagSelector";
import { useCurrentTenant } from '@/hooks/useCurrentTenant';

interface Props {
  initialData?: Product;
  onSuccess: () => void;
  onCancel: () => void;
  preselectedCategoryId?: string; // Para quando criar produto a partir da página de categoria
}

interface FormData {
  // Campos básicos
  name: string;
  description: string;
  price_normal: number;
  active: boolean;
  image_url?: string;

  // Opções avançadas
  type: ProductType;
  menu_id: string;
  category_id: string;
  subcategory_id?: string;
  order: number;
  pdv_code?: string;
  stock?: number;
  prep_time_minutes: number;
  price_promo?: number;

  // Campos para Bebida/Vinho
  volume?: number;
  alcohol_content?: number;

  // Campos para Vinho
  vintage?: string;
  country?: string;
  region?: string;
  winery?: string;
  wine_type?: string;
  grapes?: string[];
  price_bottle?: number;
  price_half_bottle?: number;
  price_glass?: number;
}

export default function ProductForm({ initialData, onSuccess, onCancel, preselectedCategoryId }: Props) {
  const { organization_id, project_id } = useCurrentTenant();
  const imageUploadRef = useRef<ImageUploadRef>(null);

  const [form, setForm] = useState<FormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price_normal: initialData?.price_normal || 0,
    active: initialData?.active ?? true,
    image_url: initialData?.image_url || "",
    type: initialData?.type || "prato",
    menu_id: "",
    category_id: preselectedCategoryId || initialData?.category_id || "",
    subcategory_id: initialData?.subcategory_id || "",
    order: initialData?.order || 0,
    pdv_code: initialData?.pdv_code || "",
    stock: initialData?.stock || undefined,
    prep_time_minutes: initialData?.prep_time_minutes || 0,
    price_promo: initialData?.price_promo || undefined,
    volume: initialData?.volume || undefined,
    alcohol_content: initialData?.alcohol_content || undefined,
    vintage: initialData?.vintage || "",
    country: initialData?.country || "",
    region: initialData?.region || "",
    winery: initialData?.winery || "",
    wine_type: initialData?.wine_type || "",
    grapes: initialData?.grapes || [],
    price_bottle: initialData?.price_bottle || undefined,
    price_half_bottle: initialData?.price_half_bottle || undefined,
    price_glass: initialData?.price_glass || undefined,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  // Dropdowns data
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Carregar menus ao montar
  useEffect(() => {
    loadMenus();
  }, []);

  // Carregar categorias quando menu for selecionado
  useEffect(() => {
    if (form.menu_id) {
      loadCategories(form.menu_id);
    }
  }, [form.menu_id]);

  // Carregar tags do produto ao editar
  useEffect(() => {
    if (initialData?.id) {
      loadProductTags();
      // Se estiver editando, carregar o menu da categoria
      if (initialData.category_id) {
        loadMenuForCategory(initialData.category_id);
      }
    }
  }, [initialData?.id]);

  const loadMenus = async () => {
    try {
      setLoadingMenus(true);
      const response = await menuService.getActive();
      setMenus(response.data);
    } catch (error) {
      console.error("Erro ao carregar menus:", error);
    } finally {
      setLoadingMenus(false);
    }
  };

  const loadCategories = async (menuId: string) => {
    try {
      setLoadingCategories(true);
      const response = await categoryService.getByMenu(menuId);
      setCategories(response.data.filter(cat => cat.active));
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadMenuForCategory = async (categoryId: string) => {
    try {
      const categoryResponse = await categoryService.getById(categoryId);
      const category = categoryResponse.data;
      if (category.menu_id) {
        setForm(prev => ({ ...prev, menu_id: category.menu_id }));
      }
    } catch (error) {
      console.error("Erro ao carregar menu da categoria:", error);
    }
  };

  const loadProductTags = async () => {
    if (!initialData?.id) return;
    try {
      const response = await productService.getProductTags(initialData.id);
      setSelectedTags(response.data);
    } catch (error) {
      console.error("Erro ao carregar tags do produto:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? undefined : parseFloat(value)) : value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setForm(prev => ({ ...prev, active: checked }));
  };

  const handleImageUploaded = (imageUrl: string) => {
    setForm(prev => ({ ...prev, image_url: imageUrl }));
  };

  const handleImageRemoved = () => {
    setForm(prev => ({ ...prev, image_url: "" }));
    setSelectedFile(null);
  };

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleGrapesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({
      ...prev,
      grapes: value ? value.split(",").map(g => g.trim()) : []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organization_id || !project_id) {
      alert("Erro: dados de organização não encontrados");
      return;
    }

    try {
      setIsSubmitting(true);

      // Preparar dados do formulário
      const baseForm = { ...form };

      // Se há um arquivo selecionado, fazer upload primeiro
      let uploadedImageUrl = null;
      if (selectedFile && imageUploadRef.current) {
        try {
          uploadedImageUrl = await imageUploadRef.current.uploadSelectedFile();
        } catch (uploadError) {
          console.error("Erro ao fazer upload da imagem:", uploadError);
          alert("Erro ao fazer upload da imagem. Tente novamente.");
          return;
        }
      }

      // Preparar DTO para criação/atualização
      const productData: CreateProductDTO = {
        name: baseForm.name,
        description: baseForm.description,
        type: baseForm.type,
        order: baseForm.order,
        active: baseForm.active,
        pdv_code: baseForm.pdv_code,
        category_id: baseForm.category_id || undefined,
        subcategory_id: baseForm.subcategory_id || undefined,
        price_normal: baseForm.price_normal,
        price_promo: baseForm.price_promo,
        volume: baseForm.volume,
        alcohol_content: baseForm.alcohol_content,
        vintage: baseForm.vintage,
        country: baseForm.country,
        region: baseForm.region,
        winery: baseForm.winery,
        wine_type: baseForm.wine_type,
        grapes: baseForm.grapes,
        price_bottle: baseForm.price_bottle,
        price_half_bottle: baseForm.price_half_bottle,
        price_glass: baseForm.price_glass,
        stock: baseForm.stock,
        prep_time_minutes: baseForm.prep_time_minutes,
        image_url: uploadedImageUrl || baseForm.image_url || undefined,
      };

      let productId = initialData?.id;

      if (initialData?.id) {
        // Atualizar produto existente
        await productService.update(initialData.id, productData);
      } else {
        // Criar novo produto
        const response = await productService.create(productData);
        productId = response.data.id;
      }

      // Salvar tags (para criação e edição)
      if (productId) {
        try {
          const currentTagsResponse = await productService.getProductTags(productId);
          const currentTags = currentTagsResponse.data;

          // Remover tags que não estão mais selecionadas
          for (const currentTag of currentTags) {
            if (!selectedTags.find(t => t.id === currentTag.id)) {
              await productService.removeTagFromProduct(productId, currentTag.id);
            }
          }

          // Adicionar tags que foram selecionadas
          for (const selectedTag of selectedTags) {
            if (!currentTags.find(t => t.id === selectedTag.id)) {
              await productService.addTagToProduct(productId, selectedTag.id);
            }
          }
        } catch (tagError) {
          console.error("Erro ao salvar tags:", tagError);
          // Não bloqueia o fluxo se houver erro nas tags
        }
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const productTypes: ProductType[] = ["prato", "bebida", "vinho"];
  const wineTypes = ["Tinto", "Branco", "Rosé", "Espumante", "Fortificado", "Sobremesa"];

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? "Editar Produto" : "Novo Produto"}</span>
            <Badge variant={form.active ? "default" : "secondary"}>
              {form.active ? "Disponível" : "Indisponível"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ==== SEÇÃO BÁSICA ==== */}

            {/* Upload de Imagem */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Imagem do Produto
              </label>
              <ImageUpload
                ref={imageUploadRef}
                currentImageUrl={form.image_url}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                onFileSelected={handleFileSelected}
                disabled={isSubmitting}
                category="product"
                maxSizeMB={10}
                allowedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
              />
            </div>

            {/* Nome */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Nome do Produto *
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Pizza Margherita"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Descrição *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descreva o produto..."
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-md"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Preço Normal */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Preço Normal (R$) *
              </label>
              <Input
                type="number"
                name="price_normal"
                value={form.price_normal || ''}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Menu e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Menu (Cardápio) *
                </label>
                <select
                  name="menu_id"
                  value={form.menu_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                  required
                  disabled={isSubmitting || loadingMenus}
                >
                  <option value="">Selecione um menu</option>
                  {menus.map(menu => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Categoria *
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                  required
                  disabled={isSubmitting || !form.menu_id || loadingCategories}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {!form.menu_id && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Selecione um menu primeiro
                  </p>
                )}
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={form.active}
                onCheckedChange={handleSwitchChange}
                disabled={isSubmitting}
              />
              <label className="text-sm font-medium text-foreground">
                Produto disponível para pedidos
              </label>
            </div>

            {/* ==== TOGGLE OPÇÕES AVANÇADAS ==== */}
            <div className="border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between"
              >
                <span className="font-medium">Opções Avançadas</span>
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {/* ==== SEÇÃO AVANÇADA ==== */}
            {showAdvanced && (
              <div className="space-y-6 border rounded-lg p-4 bg-muted/30">

                {/* Tipo de Produto */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Tipo de Produto
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md capitalize"
                    disabled={isSubmitting}
                  >
                    {productTypes.map(type => (
                      <option key={type} value={type} className="capitalize">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grid de campos secundários */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Preço Promocional (R$)
                    </label>
                    <Input
                      type="number"
                      name="price_promo"
                      value={form.price_promo || ''}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Estoque (unidades)
                    </label>
                    <Input
                      type="number"
                      name="stock"
                      value={form.stock || ''}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tempo de Preparo (min)
                    </label>
                    <Input
                      type="number"
                      name="prep_time_minutes"
                      value={form.prep_time_minutes || ''}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Código PDV
                    </label>
                    <Input
                      name="pdv_code"
                      value={form.pdv_code || ''}
                      onChange={handleChange}
                      placeholder="Ex: PDV001"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Ordem de Exibição
                    </label>
                    <Input
                      type="number"
                      name="order"
                      value={form.order || ''}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* ==== CAMPOS PARA BEBIDAS/VINHOS ==== */}
                {(form.type === "bebida" || form.type === "vinho") && (
                  <div className="border-t pt-4 space-y-4">
                    <h3 className="font-medium text-sm">Informações de Bebida</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Volume (ml)
                        </label>
                        <Input
                          type="number"
                          name="volume"
                          value={form.volume || ''}
                          onChange={handleChange}
                          placeholder="Ex: 750"
                          min="0"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Teor Alcoólico (%)
                        </label>
                        <Input
                          type="number"
                          name="alcohol_content"
                          value={form.alcohol_content || ''}
                          onChange={handleChange}
                          placeholder="Ex: 13.5"
                          step="0.1"
                          min="0"
                          max="100"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ==== CAMPOS ESPECÍFICOS PARA VINHOS ==== */}
                {form.type === "vinho" && (
                  <div className="border-t pt-4 space-y-4">
                    <h3 className="font-medium text-sm">Informações de Vinho</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Safra
                        </label>
                        <Input
                          name="vintage"
                          value={form.vintage || ''}
                          onChange={handleChange}
                          placeholder="Ex: 2020"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          País
                        </label>
                        <Input
                          name="country"
                          value={form.country || ''}
                          onChange={handleChange}
                          placeholder="Ex: Brasil"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Região
                        </label>
                        <Input
                          name="region"
                          value={form.region || ''}
                          onChange={handleChange}
                          placeholder="Ex: Vale dos Vinhedos"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Vinícola
                        </label>
                        <Input
                          name="winery"
                          value={form.winery || ''}
                          onChange={handleChange}
                          placeholder="Ex: Miolo"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Tipo de Vinho
                      </label>
                      <select
                        name="wine_type"
                        value={form.wine_type || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                        disabled={isSubmitting}
                      >
                        <option value="">Selecione o tipo</option>
                        {wineTypes.map(type => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Uvas (separadas por vírgula)
                      </label>
                      <Input
                        value={form.grapes?.join(", ") || ''}
                        onChange={handleGrapesChange}
                        placeholder="Ex: Cabernet Sauvignon, Merlot"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Preço Garrafa (R$)
                        </label>
                        <Input
                          type="number"
                          name="price_bottle"
                          value={form.price_bottle || ''}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Preço Meia Garrafa (R$)
                        </label>
                        <Input
                          type="number"
                          name="price_half_bottle"
                          value={form.price_half_bottle || ''}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Preço Taça (R$)
                        </label>
                        <Input
                          type="number"
                          name="price_glass"
                          value={form.price_glass || ''}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tags do Produto */}
            <div className="border-t pt-6">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Tags do Produto
              </label>
              <TagSelector
                entityType="product"
                selectedTags={selectedTags}
                onChange={setSelectedTags}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Salvando..." : (initialData ? "Atualizar" : "Criar Produto")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
