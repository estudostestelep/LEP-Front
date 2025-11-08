import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, menuService } from "../../api/menuService";
import { Plus, Edit, Trash2, Power, PowerOff, Loader2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmModal from "@/components/confirmModal";
import FormModal from "@/components/formModal";
import MenuConfigModal from "@/components/MenuConfigModal";
import { useAuth } from "@/context/authContext";

export default function AdminMenuPage() {
  const navigate = useNavigate();
  const { isMasterAdmin } = useAuth();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    order: 0,
    active: true,
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    setLoading(true);
    try {
      const response = await menuService.getAll();
      setMenus(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Erro ao carregar menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedMenu(null);
    setFormData({ name: "", order: menus.length, active: true });
    setFormErrors([]);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (menu: Menu) => {
    setSelectedMenu(menu);
    setFormData({
      name: menu.name,
      order: menu.order,
      active: menu.active,
    });
    setFormErrors([]);
    setIsFormModalOpen(true);
  };

  const handleSaveMenu = async () => {
    if (!formData.name || formData.name.trim().length === 0) {
      setFormErrors(["Nome do menu é obrigatório"]);
      return;
    }

    try {
      if (selectedMenu) {
        await menuService.update(selectedMenu.id, formData);
      } else {
        await menuService.create(formData);
      }
      await loadMenus();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar menu:", error);
      setFormErrors(["Erro ao salvar menu. Tente novamente."]);
    }
  };

  const handleDeleteMenu = async () => {
    if (!selectedMenu) return;

    try {
      await menuService.remove(selectedMenu.id);
      await loadMenus();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Erro ao deletar menu:", error);
    }
  };

  const handleToggleStatus = async (menu: Menu) => {
    try {
      await menuService.updateStatus(menu.id, !menu.active);
      await loadMenus();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleOpenConfigModal = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsConfigModalOpen(true);
  };

  const handleSaveMenuConfig = async (updatedMenu: Menu) => {
    setSelectedMenu(updatedMenu);
    await loadMenus();
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Menu</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus cardápios, categorias e produtos
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          Novo Cardápio
        </Button>
      </div>

      {menus.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum cardápio cadastrado</p>
            <Button onClick={handleOpenCreateModal} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Cardápio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menus.map((menu) => (
            <Card
              key={menu.id}
              className={`hover:shadow-lg transition-shadow ${!menu.active ? "opacity-60" : ""
                }`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">{menu.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ordem: {menu.order}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleToggleStatus(menu)}
                      variant={menu.active ? "default" : "outline"}
                      size="sm"
                      className="px-2"
                      title={menu.active ? "Pausar" : "Ativar"}
                    >
                      {menu.active ? (
                        <Power className="h-4 w-4" />
                      ) : (
                        <PowerOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => handleOpenEditModal(menu)}
                    className="flex-1 border border-border bg-card text-foreground hover:bg-muted transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  {isMasterAdmin && (
                    <Button
                      size="sm"
                      onClick={() => handleOpenConfigModal(menu)}
                      title="Configurar horários, dias e prioridade"
                      className="flex-1 border border-border bg-card text-foreground hover:bg-muted transition-colors"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Configurar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedMenu(menu);
                      setIsDeleteModalOpen(true);
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    className="w-full border border-border text-primary bg-transparent hover:bg-primary/10 font-semibold transition-all"
                    onClick={() => {
                      // Navegar para categorias do menu
                      navigate(`/admin-menu/${menu.id}/categories`);
                    }}
                  >
                    Gerenciar Categorias
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
        title={selectedMenu ? "Editar Cardápio" : "Novo Cardápio"}
        onSubmit={handleSaveMenu}
      >
        <div className="space-y-4">
          {formErrors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
              <ul className="list-disc list-inside">
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Cardápio *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Cardápio Executivo"
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
              className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-foreground">
              Cardápio ativo
            </label>
          </div>
        </div>
      </FormModal>

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteMenu}
        title="Deletar Cardápio"
        message={`Tem certeza que deseja deletar o cardápio "${selectedMenu?.name}"? Esta ação não pode ser desfeita.`}
      />

      {/* Modal de configuração (horários, dias, prioridade) */}
      {selectedMenu && (
        <MenuConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          menu={selectedMenu}
          onSave={handleSaveMenuConfig}
        />
      )}
    </div>
  );
}
