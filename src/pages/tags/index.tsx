import { useEffect, useState } from "react";
import { Tag, tagService, validateTag } from "../../api/tagService";
import { TagBadge } from "../../components/TagBadge";
import { Plus, Edit, Trash2, Loader2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ConfirmModal from "../../components/confirmModal";
import FormModal from "../../components/formModal";

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Tag>>({
    name: "",
    color: "#6B7280",
    description: "",
    entity_type: "",
    active: true,
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    filterTags();
  }, [tags, searchTerm, entityTypeFilter, statusFilter]);

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const response = await tagService.listTags();
      setTags(response.data);
    } catch (error) {
      console.error("Erro ao carregar tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTags = () => {
    let filtered = [...tags];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (tag) =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de tipo de entidade
    if (entityTypeFilter !== "all") {
      filtered = filtered.filter((tag) => tag.entity_type === entityTypeFilter);
    }

    // Filtro de status
    if (statusFilter === "active") {
      filtered = filtered.filter((tag) => tag.active);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((tag) => !tag.active);
    }

    setFilteredTags(filtered);
  };

  const handleOpenCreateModal = () => {
    setSelectedTag(null);
    setFormData({
      name: "",
      color: "#6B7280",
      description: "",
      entity_type: "",
      active: true,
    });
    setFormErrors([]);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (tag: Tag) => {
    setSelectedTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color || "#6B7280",
      description: tag.description || "",
      entity_type: tag.entity_type || "",
      active: tag.active,
    });
    setFormErrors([]);
    setIsFormModalOpen(true);
  };

  const handleSaveTag = async () => {
    const errors = validateTag(formData);
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (selectedTag) {
        await tagService.updateTag(selectedTag.id, formData);
      } else {
        await tagService.createTag(formData);
      }
      await loadTags();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar tag:", error);
      setFormErrors(["Erro ao salvar tag. Tente novamente."]);
    }
  };

  const handleDeleteTag = async () => {
    if (!selectedTag) return;

    try {
      await tagService.deleteTag(selectedTag.id);
      await loadTags();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Erro ao deletar tag:", error);
    }
  };

  const entityTypes = [
    { value: "all", label: "Todos os tipos" },
    { value: "product", label: "Produto" },
    { value: "customer", label: "Cliente" },
    { value: "table", label: "Mesa" },
    { value: "reservation", label: "Reserva" },
    { value: "order", label: "Pedido" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Tags</h1>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nova Tag
        </button>
      </div>

      {/* Filtros */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro de tipo */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 pointer-events-none" />
            <select
              value={entityTypeFilter}
              onChange={(e) => setEntityTypeFilter(e.target.value)}
              className="w-full h-9 pl-10 pr-4 rounded-md border border-input bg-card text-card-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none"
            >
              {entityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-9 px-4 rounded-md border border-input bg-card text-card-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>
        </div>
      </Card>

      {/* Lista de tags */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredTags.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Nenhuma tag encontrada</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TagBadge name={tag.name} color={tag.color} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {tag.description || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-muted-foreground">
                      {tag.entity_type
                        ? entityTypes.find((t) => t.value === tag.entity_type)
                            ?.label || tag.entity_type
                        : "Geral"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tag.active
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      {tag.active ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleOpenEditModal(tag)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTag(tag);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal de formulário */}
      <FormModal
        open={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedTag ? "Editar Tag" : "Nova Tag"}
        onSubmit={handleSaveTag}
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
              Nome *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Vegano, VIP, Aniversário..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Cor
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="h-9 w-20 border border-input rounded cursor-pointer bg-card"
              />
              <Input
                type="text"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="flex-1"
                placeholder="#6B7280"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-1 text-sm rounded-md border border-input bg-card text-card-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              rows={3}
              placeholder="Descrição opcional da tag..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de Entidade
            </label>
            <select
              value={formData.entity_type || ""}
              onChange={(e) =>
                setFormData({ ...formData, entity_type: e.target.value })
              }
              className="w-full h-9 px-3 rounded-md border border-input bg-card text-card-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Geral (todos os tipos)</option>
              <option value="product">Produto</option>
              <option value="customer">Cliente</option>
              <option value="table">Mesa</option>
              <option value="reservation">Reserva</option>
              <option value="order">Pedido</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
              Tag ativa
            </label>
          </div>
        </div>
      </FormModal>

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTag}
        title="Deletar Tag"
        message={`Tem certeza que deseja deletar a tag "${selectedTag?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
