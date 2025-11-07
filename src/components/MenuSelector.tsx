import { useEffect, useState } from "react";
import { Menu as MenuIcon, ChevronDown } from "lucide-react";
import { Menu } from "@/types/menu";
import { menuService } from "@/api/menuService";
import { useAuth } from "@/context/authContext";
import MenuSelectionModal from "./MenuSelectionModal";

interface MenuSelectorProps {
  onMenuChange?: (menu: Menu) => void;
  className?: string;
}

/**
 * ✨ MenuSelector - Dropdown discreto para seleção de cardápio
 *
 * Exibe o cardápio ativo atual e permite abrir modal de seleção
 * com todas as opções disponíveis
 */
export default function MenuSelector({ onMenuChange, className = "" }: MenuSelectorProps) {
  const { currentOrganization, currentProject } = useAuth();
  const [activeMenu, setActiveMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carregar cardápio ativo ao montar ou quando org/project muda
  useEffect(() => {
    if (!currentOrganization || !currentProject) return;

    const loadActiveMenu = async () => {
      try {
        setLoading(true);
        const response = await menuService.getActiveMenu();
        setActiveMenu(response.data);
      } catch (error) {
        console.error("Erro ao carregar cardápio ativo:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActiveMenu();
  }, [currentOrganization, currentProject]);

  const handleMenuSelected = (menu: Menu) => {
    setActiveMenu(menu);
    setIsModalOpen(false);
    onMenuChange?.(menu);
  };

  if (loading || !activeMenu) {
    return (
      <div className={`h-10 bg-slate-700 rounded-lg animate-pulse ${className}`} />
    );
  }

  return (
    <>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 transition-colors text-sm font-medium text-slate-100 ${className}`}
        title={`Cardápio: ${activeMenu.name}`}
      >
        <MenuIcon className="w-4 h-4" />
        <span className="truncate max-w-[200px]">{activeMenu.name}</span>
        {activeMenu.is_manual_override && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200 whitespace-nowrap">
            Manual
          </span>
        )}
        <ChevronDown className="w-4 h-4 ml-auto flex-shrink-0" />
      </button>

      {/* Modal de Seleção */}
      <MenuSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeMenu={activeMenu}
        onMenuSelected={handleMenuSelected}
      />
    </>
  );
}
