import { useEffect, useState } from "react";
import { X, Clock, Zap, Settings } from "lucide-react";
import { Menu } from "@/types/menu";
import { menuService } from "@/api/menuService";
import MenuConfigModal from "./MenuConfigModal";
import { useAuth } from "@/context/authContext";

interface MenuSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenu: Menu;
  onMenuSelected: (menu: Menu) => void;
}

interface MenuOption {
  menu: Menu;
  status: "active" | "scheduled" | "inactive";
  statusReason: string;
  nextActiveTime?: Date;
}

/**
 * ✨ MenuSelectionModal - Modal para seleção inteligente de cardápios
 *
 * Exibe:
 * - Cardápio ativo agora com opção de editar configuração
 * - Todas as opções disponíveis com status e motivo
 * - Opções para usar seleção automática ou definir como override
 */
export default function MenuSelectionModal({
  isOpen,
  onClose,
  activeMenu,
  onMenuSelected,
}: MenuSelectionModalProps) {
  const { isMasterAdmin } = useAuth();
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Carregar opções de cardápio ao abrir modal
  useEffect(() => {
    if (!isOpen) return;

    const loadMenuOptions = async () => {
      try {
        setLoading(true);
        const response = await menuService.getMenuOptions();

        // Transformar resposta em MenuOptions
        const options: MenuOption[] = response.data.map((menu: Menu) => {
          let status: "active" | "scheduled" | "inactive" = "inactive";
          let statusReason = "Sem agendamento";

          if (menu.is_manual_override) {
            status = "active";
            statusReason = "Selecionado manualmente";
          } else if (menu.time_range_start && menu.time_range_end) {
            const now = new Date();
            const nowTime = now.getHours() * 60 + now.getMinutes();
            const startTime = new Date(menu.time_range_start).getHours() * 60 +
                             new Date(menu.time_range_start).getMinutes();
            const endTime = new Date(menu.time_range_end).getHours() * 60 +
                           new Date(menu.time_range_end).getMinutes();

            if (nowTime >= startTime && nowTime <= endTime) {
              status = "active";
              statusReason = "Ativo agora";
            } else if (nowTime < startTime) {
              status = "scheduled";
              const hoursLeft = Math.floor((startTime - nowTime) / 60);
              const minutesLeft = (startTime - nowTime) % 60;
              if (hoursLeft > 0) {
                statusReason = `Próximo em ${hoursLeft}h${minutesLeft > 0 ? ` ${minutesLeft}m` : ""}`;
              } else {
                statusReason = `Próximo em ${minutesLeft}m`;
              }
            } else {
              status = "inactive";
              statusReason = `Encerrado (próximo amanhã)`;
            }
          }

          return {
            menu,
            status,
            statusReason,
          };
        });

        setMenuOptions(options);
      } catch (error) {
        console.error("Erro ao carregar opções de cardápio:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuOptions();
  }, [isOpen]);

  const handleSelectMenu = async (menu: Menu) => {
    try {
      // Definir como manual override
      await menuService.setMenuAsManualOverride(menu.id);
      onMenuSelected(menu);
    } catch (error) {
      console.error("Erro ao selecionar cardápio:", error);
    }
  };

  const handleRemoveManualOverride = async () => {
    try {
      await menuService.removeManualOverride();
      // Recarregar opções
      const response = await menuService.getMenuOptions();
      onMenuSelected(response.data[0]);
      onClose();
    } catch (error) {
      console.error("Erro ao remover override manual:", error);
    }
  };

  const handleSaveMenuConfig = (updatedMenu: Menu) => {
    onMenuSelected(updatedMenu);
    setIsConfigModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Zap className="w-4 h-4 text-green-400" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Selecionar Cardápio</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Cardápio Ativo */}
          <div className="bg-slate-800 rounded-lg p-4 border border-green-900/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold text-white">Ativo Agora</h3>
              </div>
            </div>

            <div className="space-y-2 ml-7">
              <p className="font-medium text-slate-100">{activeMenu.name}</p>
              <p className="text-sm text-slate-400">
                {activeMenu.is_manual_override ? "✓ Selecionado manualmente" : "✓ Automático"}
              </p>

              {activeMenu.time_range_start && activeMenu.time_range_end && (
                <p className="text-xs text-slate-500">
                  {new Date(activeMenu.time_range_start).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(activeMenu.time_range_end).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>

            {isMasterAdmin ? (
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="mt-4 w-full px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                title="Editar configuração do cardápio (horários, dias, prioridade)"
              >
                <Settings className="w-4 h-4" />
                Editar Configuração
              </button>
            ) : (
              <div className="mt-4 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs text-center">
                ⚠️ Apenas master-admin pode editar configurações
              </div>
            )}
          </div>

          {/* Opções de Cardápio */}
          <div>
            <h3 className="font-semibold text-white mb-3">Opções Disponíveis</h3>
            <div className="space-y-2">
              {loading ? (
                <div className="text-slate-400 text-sm py-4 text-center">Carregando...</div>
              ) : menuOptions.length === 0 ? (
                <div className="text-slate-400 text-sm py-4 text-center">
                  Nenhum cardápio disponível
                </div>
              ) : (
                menuOptions.map((option) => (
                  <button
                    key={option.menu.id}
                    onClick={() => handleSelectMenu(option.menu)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      option.menu.id === activeMenu.id
                        ? "bg-blue-900/20 border-blue-700 hover:bg-blue-900/30"
                        : "bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-100">{option.menu.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {getStatusIcon(option.status)}
                          <p className="text-xs text-slate-400">{option.statusReason}</p>
                        </div>

                        {option.menu.time_range_start && option.menu.time_range_end && (
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(option.menu.time_range_start).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(option.menu.time_range_end).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                      {option.menu.id === activeMenu.id && (
                        <span className="text-xs font-semibold text-blue-400">Ativo</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Opções de Ação */}
          {activeMenu.is_manual_override && (
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
              <p className="text-xs text-blue-300 mb-3">
                Você configurou uma seleção manual. Para voltar à seleção automática, clique abaixo:
              </p>
              <button
                onClick={handleRemoveManualOverride}
                className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                🔄 Usar Seleção Automática
              </button>
            </div>
          )}
        </div>

        {/* Modal de Configuração */}
        <MenuConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          menu={activeMenu}
          onSave={handleSaveMenuConfig}
        />
      </div>
    </div>
  );
}
