import { useState } from "react";
import { productService, Product, CreateProductRequest } from "@/api/productService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/ImageUpload";
import { useAuth } from "@/context/authContext";

interface Props {
  initialData?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: string;
  prep_time_minutes: number;
  image_url?: string;
}

export default function ProductForm({ initialData, onSuccess, onCancel }: Props) {
  const { user } = useAuth();
  const [form, setForm] = useState<FormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    available: initialData?.available ?? true,
    category: initialData?.category || "",
    prep_time_minutes: initialData?.prep_time_minutes || 0,
    image_url: initialData?.image_url || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setForm(prev => ({ ...prev, available: checked }));
  };

  const handleImageUploaded = (imageUrl: string) => {
    setForm(prev => ({ ...prev, image_url: imageUrl }));
  };

  const handleImageRemoved = () => {
    setForm(prev => ({ ...prev, image_url: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.organization_id || !user?.project_id) {
      alert("Erro: dados de organização não encontrados");
      return;
    }

    try {
      setIsSubmitting(true);

      if (initialData?.id) {
        // Atualizar produto existente
        await productService.update(initialData.id, form);
      } else {
        // Criar novo produto
        const createData: CreateProductRequest = {
          ...form
        };
        console.log("Creating product with data:", createData);
        await productService.create(createData);
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
    "appetizer", "main_course", "dessert", "beverage", "side_dish"
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? "Editar Produto" : "Novo Produto"}</span>
            <Badge variant={form.available ? "default" : "secondary"}>
              {form.available ? "Disponível" : "Indisponível"}
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
                currentImageUrl={form.image_url}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                disabled={isSubmitting}
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
                  name="price"
                  value={form.price}
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
                      {cat.replace("_", " ")}
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
                value={form.prep_time_minutes}
                onChange={handleChange}
                placeholder="Ex: 25"
                min="0"
                disabled={isSubmitting}
              />
            </div>

            {/* Disponibilidade */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={form.available}
                onCheckedChange={handleSwitchChange}
                disabled={isSubmitting}
              />
              <label className="text-sm font-medium text-foreground">
                Produto disponível para pedidos
              </label>
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
