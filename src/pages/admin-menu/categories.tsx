import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ConfirmModal from "@/components/confirmModal";
import FormModal from "@/components/formModal";
import ImageUpload, { ImageUploadRef } from "@/components/ImageUpload";
import { CategoryImage } from "@/components/CategoryImage";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { menuId } = useParams<{ menuId: string }>();
  const imageUploadRef = useRef<ImageUploadRef>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    notes: "",
    order: 0,
    active: true,
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    if (menuId) {
      loadMenu();
      loadCategories();
    }
  }, [menuId]);

  const loadMenu = async () => {
    if (!menuId) return;
    try {
      const response = await menuService.getById(menuId);
      setMenu(response.data);
    } catch (error) {
      console.error("Erro ao carregar menu:", error);
    }
  };

  const loadCategories = async () => {
    if (!menuId) return;
    setLoading(true);
    try {
      const response = await categoryService.getByMenu(menuId);
      console.log("📥 Categorias carregadas do backend:", response.data);

      // Log das imagens para debug
      response.data.forEach((cat: Category) => {
        console.log(`Categoria "${cat.name}":`, {
          image_url: cat.image_url,
          hasImage: !!cat.image_url
        });
      });

      setCategories(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setSelectedFile(null);
    setFormData({
      name: "",
      image_url: "",
      notes: "",
      order: categories.length,
      active: true,
    });
    setFormErrors([]);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
    setSelectedFile(null);
    setFormData({
      name: category.name,
      image_url: category.image_url || "",
      notes: category.notes || "",
      order: category.order,
      active: category.active,
    });
    setFormErrors([]);
    setIsFormModalOpen(true);
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
  };

  const handleImageRemoved = () => {
    setFormData(prev => ({ ...prev, image_url: "" }));
    setSelectedFile(null);
  };

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleSaveCategory = async () => {
    if (!formData.name || formData.name.trim().length === 0) {
      setFormErrors(["Nome da categoria é obrigatório"]);
      return;
    }

    if (!menuId) {
      setFormErrors(["ID do menu não encontrado"]);
      return;
    }

    try {
      setIsSaving(true);
      setFormErrors([]);

      // Se há um arquivo selecionado, fazer upload primeiro
      let imageUrl = formData.image_url; // Começar com a URL existente (pode ser URL manual ou existente)

      if (selectedFile && imageUploadRef.current) {
        try {
          console.log("🔄 Fazendo upload da imagem selecionada...");
          const uploadedImageUrl = await imageUploadRef.current.uploadSelectedFile();

          if (uploadedImageUrl) {
            imageUrl = uploadedImageUrl;
            console.log("✅ Upload concluído. URL:", uploadedImageUrl);
          } else {
            console.warn("⚠️ Upload retornou null");
          }
        } catch (uploadError) {
          console.error("❌ Erro ao fazer upload da imagem:", uploadError);
          setFormErrors(["Erro ao fazer upload da imagem. Tente novamente."]);
          setIsSaving(false);
          return;
        }
      }

      const categoryData = {
        menu_id: menuId,
        name: formData.name,
        image_url: imageUrl || undefined,
        notes: formData.notes || undefined,
        order: formData.order,
        active: formData.active,
      };

      console.log("📤 Enviando dados da categoria:", categoryData);
      console.log("📸 URL da imagem sendo enviada:", imageUrl);

      if (selectedCategory) {
        await categoryService.update(selectedCategory.id, categoryData);
        console.log("✅ Categoria atualizada com sucesso");
      } else {
        await categoryService.create(categoryData);
        console.log("✅ Categoria criada com sucesso");
      }

      await loadCategories();
      setIsFormModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("❌ Erro ao salvar categoria:", error);
      setFormErrors(["Erro ao salvar categoria. Tente novamente."]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await categoryService.remove(selectedCategory.id);
      await loadCategories();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      await categoryService.updateStatus(category.id, !category.active);
      await loadCategories();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleMoveUp = async (category: Category, index: number) => {
    if (index === 0) return;
    try {
      const prevCategory = categories[index - 1];
      await categoryService.updateOrder(category.id, prevCategory.order);
      await categoryService.updateOrder(prevCategory.id, category.order);
      await loadCategories();
    } catch (error) {
      console.error("Erro ao mover categoria:", error);
    }
  };

  const handleMoveDown = async (category: Category, index: number) => {
    if (index === categories.length - 1) return;
    try {
      const nextCategory = categories[index + 1];
      await categoryService.updateOrder(category.id, nextCategory.order);
      await categoryService.updateOrder(nextCategory.id, category.order);
      await loadCategories();
    } catch (error) {
      console.error("Erro ao mover categoria:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin-menu")}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Cardápios
        </Button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Categorias - {menu?.name || "Cardápio"}
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie as categorias deste cardápio
            </p>
          </div>
          <Button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nova Categoria
          </Button>
        </div>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">Nenhuma categoria cadastrada</p>
            <Button onClick={handleOpenCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Categoria
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              className={`hover:shadow-lg transition-shadow ${!category.active ? "opacity-60" : ""
                }`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <CategoryImage
                      imageUrl={category.image_url}
                      categoryName={category.name}
                      size="md"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Ordem: {category.order}
                      </p>
                      {category.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          {category.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(category)}
                      className={`p-2 rounded-lg transition-colors ${category.active
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      title={category.active ? "Pausar" : "Ativar"}
                    >
                      {category.active ? (
                        <Power className="h-4 w-4" />
                      ) : (
                        <PowerOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveUp(category, index)}
                      disabled={index === 0}
                      className="px-2"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveDown(category, index)}
                      disabled={index === categories.length - 1}
                      className="px-2"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditModal(category)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      // TODO: Navegar para produtos da categoria
                      navigate(`/admin-menu/${menuId}/categories/${category.id}/products`);
                    }}
                  >
                    Gerenciar Produtos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de formulário */}
      <FormModal
        open={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedCategory ? "Editar Categoria" : "Nova Categoria"}
        onSubmit={handleSaveCategory}
      >
        <div className="space-y-4">
          {formErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <ul className="list-disc list-inside">
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Nome da Categoria *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Entradas"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Imagem da Categoria
            </label>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <CategoryImage
                  imageUrl={formData.image_url}
                  categoryName={formData.name || "Categoria"}
                  size="lg"
                />
              </div>
              <div className="flex-1">
                <ImageUpload
                  ref={imageUploadRef}
                  currentImageUrl={formData.image_url}
                  onImageUploaded={handleImageUploaded}
                  onImageRemoved={handleImageRemoved}
                  onFileSelected={handleFileSelected}
                  disabled={isSaving}
                  category="categories"
                  maxSizeMB={5}
                  allowedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notas/Descrição
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Descrição ou observações sobre a categoria"
              rows={3}
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Ordem de Exibição
            </label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              min="0"
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
              disabled={isSaving}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
              Categoria ativa
            </label>
          </div>
        </div>
      </FormModal>

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Deletar Categoria"
        message={`Tem certeza que deseja deletar a categoria "${selectedCategory?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
