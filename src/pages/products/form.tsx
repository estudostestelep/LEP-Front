import { useState, useRef, useEffect } from "react";
import { productService, Product, CreateProductRequest } from "@/api/productService";
import { Tag } from "@/api/tagService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import ImageUpload, { ImageUploadRef } from "@/components/ImageUpload";
import { TagSelector } from "@/components/TagSelector";
import { useCurrentTenant } from '@/hooks/useCurrentTenant';
import { getCategoryDisplayName } from "@/lib/categories";

interface Props {
  initialData?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description: string;
  price_normal: number;
  active: boolean;
  category: string;
  prep_time_minutes: number;
  image_url?: string;
}

export default function ProductForm({ initialData, onSuccess, onCancel }: Props) {
  const { organization_id, project_id } = useCurrentTenant();
  const imageUploadRef = useRef<ImageUploadRef>(null);
  const [form, setForm] = useState<FormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price_normal: initialData?.price_normal || initialData?.price || 0,
    active: initialData?.active ?? initialData?.available ?? true,
    category: initialData?.category || "",
    prep_time_minutes: initialData?.prep_time_minutes || 0,
    image_url: initialData?.image_url || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  // Carregar tags do produto ao editar
  useEffect(() => {
    if (initialData?.id) {
      loadProductTags();
    }
  }, [initialData?.id]);

  const loadProductTags = async () => {
    if (!initialData?.id) return;
    try {
      const response = await productService.getProductTags(initialData.id);
      setSelectedTags(response.data);
    } catch (error) {
      console.error("Erro ao carregar tags do produto:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
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

      const finalForm = {
        ...baseForm,
        ...(uploadedImageUrl && { image_url: uploadedImageUrl })
      };

      let productId = initialData?.id;

      if (initialData?.id) {
        // Atualizar produto existente
        await productService.update(initialData.id, finalForm);
      } else {
        // Criar novo produto - mapeando para campos compatíveis
        const createData: CreateProductRequest = {
          name: finalForm.name,
          description: finalForm.description,
          price: finalForm.price_normal,
          available: finalForm.active,
          category: finalForm.category,
          prep_time_minutes: finalForm.prep_time_minutes,
          image_url: finalForm.image_url
        };
        console.log("Creating product with data:", createData);
        const response = await productService.create(createData);
        productId = response.data.id;
      }

      // Salvar tags (para criação e edição)
      if (productId) {
        // Sincronizar tags: remover antigas, adicionar novas
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

  const categories = [
    "appetizer", "main_course", "dessert", "beverage", "side_dish",
    "pizza", "wine", "beer", "cocktail", "coffee"
  ];

  return (
    <div className="max-w-2xl mx-auto">
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

            {/* Preço e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Preço (R$) *
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

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Categoria *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="capitalize">
                      {getCategoryDisplayName(cat)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tempo de Preparo */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Tempo de Preparo (minutos)
              </label>
              <Input
                type="number"
                name="prep_time_minutes"
                value={form.prep_time_minutes || ''}
                onChange={handleChange}
                placeholder="Ex: 25"
                min="0"
                disabled={isSubmitting}
              />
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
