import { useState, useEffect } from "react";
import { X, Clock, Calendar, AlertCircle } from "lucide-react";
import { Menu } from "@/types/menu";
import { menuService } from "@/api/menuService";

interface MenuConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: Menu;
  onSave?: (updatedMenu: Menu) => void;
}

/**
 * ✨ MenuConfigModal - Modal para editar configurações de cardápio
 *
 * Permite configurar:
 * - Intervalo de tempo (time range)
 * - Dias da semana aplicáveis
 * - Datas específicas (comemorativas, eventos)
 * - Prioridade
 * - Definir como padrão
 */
export default function MenuConfigModal({
  isOpen,
  onClose,
  menu,
  onSave,
}: MenuConfigModalProps) {
  const [formData, setFormData] = useState({
    name: menu.name,
    timeRangeStart: "",
    timeRangeEnd: "",
    priority: menu.priority || 999,
    applicableDays: [] as number[],
    specificDates: [] as string[],
    isDefault: false,
  });

  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Inicializar form data quando modal abre
  useEffect(() => {
    if (!isOpen) return;

    // Extrair HH:MM format das datas ISO8601
    const startTime = menu.time_range_start
      ? new Date(menu.time_range_start).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).replace(/(\d{2}):(\d{2}).*/, "$1:$2")
      : "";

    const endTime = menu.time_range_end
      ? new Date(menu.time_range_end).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).replace(/(\d{2}):(\d{2}).*/, "$1:$2")
      : "";

    // Converter applicable_days de string JSON para array
    let applicableDaysArray: number[] = [];
    if (menu.applicable_days) {
      try {
        if (typeof menu.applicable_days === "string") {
          applicableDaysArray = JSON.parse(menu.applicable_days);
        } else if (Array.isArray(menu.applicable_days)) {
          applicableDaysArray = menu.applicable_days;
        }
      } catch (e) {
        console.warn("Erro ao parsear applicable_days:", e);
      }
    }

    // Converter applicable_dates de string JSON para array
    let applicableDatesArray: string[] = [];
    if (menu.applicable_dates) {
      try {
        if (typeof menu.applicable_dates === "string") {
          applicableDatesArray = JSON.parse(menu.applicable_dates);
        } else if (Array.isArray(menu.applicable_dates)) {
          applicableDatesArray = menu.applicable_dates;
        }
      } catch (e) {
        console.warn("Erro ao parsear applicable_dates:", e);
      }
    }

    setFormData({
      name: menu.name,
      timeRangeStart: startTime,
      timeRangeEnd: endTime,
      priority: menu.priority || 999,
      applicableDays: applicableDaysArray,
      specificDates: applicableDatesArray,
      isDefault: menu.priority === 0,
    });

    setNewDate("");
  }, [isOpen, menu]);

  const daysOfWeek = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Segunda" },
    { value: 2, label: "Terça" },
    { value: 3, label: "Quarta" },
    { value: 4, label: "Quinta" },
    { value: 5, label: "Sexta" },
    { value: 6, label: "Sábado" },
  ];

  const handleDayToggle = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      applicableDays: prev.applicableDays.includes(day)
        ? prev.applicableDays.filter((d) => d !== day)
        : [...prev.applicableDays, day],
    }));
  };

  const handleAddDate = () => {
    if (newDate && !formData.specificDates.includes(newDate)) {
      setFormData((prev) => ({
        ...prev,
        specificDates: [...prev.specificDates, newDate],
      }));
      setNewDate("");
    }
  };

  const handleRemoveDate = (date: string) => {
    setFormData((prev) => ({
      ...prev,
      specificDates: prev.specificDates.filter((d) => d !== date),
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Preparar dados para enviar (apenas campos que mudam)
      // Converter HH:MM format para RFC3339 ISO8601 format que Go pode parsear
      const updateData: Record<string, any> = {
        priority: formData.isDefault ? 0 : formData.priority,
      };

      // Adicionar campos opcionais apenas se tiverem valores
      if (formData.timeRangeStart) {
        updateData.time_range_start = `2000-01-01T${formData.timeRangeStart}:00Z`;
      }

      if (formData.timeRangeEnd) {
        updateData.time_range_end = `2000-01-01T${formData.timeRangeEnd}:00Z`;
      }

      if (formData.applicableDays.length > 0) {
        updateData.applicable_days = formData.applicableDays;
      }

      if (formData.specificDates.length > 0) {
        updateData.applicable_dates = formData.specificDates;
      }

      console.log("Enviando dados de configuração:", updateData);

      // Enviar para servidor
      const response = await menuService.update(menu.id, updateData);

      console.log("Resposta do servidor:", response);
      onSave?.(response.data);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      alert(`Erro ao salvar: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Configurar: {formData.name}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Intervalo de Tempo */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Clock className="w-4 h-4" />
              Intervalo de Tempo
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                value={formData.timeRangeStart}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    timeRangeStart: e.target.value,
                  }))
                }
                className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 text-sm"
                placeholder="De"
              />
              <input
                type="time"
                value={formData.timeRangeEnd}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    timeRangeEnd: e.target.value,
                  }))
                }
                className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 text-sm"
                placeholder="Até"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Deixe em branco para não usar horário
            </p>
          </div>

          {/* Dias da Semana */}
          <div>
            <label className="text-sm font-semibold text-white mb-3 block">
              Aplicável em Dias
            </label>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map((day) => (
                <label
                  key={day.value}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.applicableDays.includes(day.value)}
                    onChange={() => handleDayToggle(day.value)}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-sm text-slate-100">{day.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Datas Específicas */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Calendar className="w-4 h-4" />
              Datas Específicas
            </label>

            <div className="flex gap-2 mb-3">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 text-sm"
              />
              <button
                onClick={handleAddDate}
                className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                Adicionar
              </button>
            </div>

            {formData.specificDates.length > 0 && (
              <div className="space-y-2">
                {formData.specificDates.map((date) => (
                  <div
                    key={date}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 border border-slate-600"
                  >
                    <span className="text-sm text-slate-100">
                      {new Date(date).toLocaleDateString("pt-BR")}
                    </span>
                    <button
                      onClick={() => handleRemoveDate(date)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prioridade */}
          <div>
            <label className="text-sm font-semibold text-white mb-3 block">
              Prioridade (0 = maior)
            </label>
            <input
              type="number"
              min="0"
              max="999"
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: parseInt(e.target.value) || 999,
                }))
              }
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 text-sm"
            />
            <p className="text-xs text-slate-400 mt-2">
              Usado para resolver conflitos quando múltiplos cardápios estão ativos
            </p>
          </div>

          {/* Cardápio Padrão */}
          <label className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800 border border-slate-600 cursor-pointer hover:bg-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isDefault: e.target.checked,
                  priority: e.target.checked ? 0 : prev.priority,
                }))
              }
              className="w-4 h-4 rounded cursor-pointer"
            />
            <span className="text-sm text-slate-100">
              Usar como cardápio padrão
              <p className="text-xs text-slate-400 mt-1">
                (mostrado quando nenhum horário se aplica)
              </p>
            </span>
          </label>

          {/* Info Message */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3 flex gap-3">
            <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300">
              As configurações determinam quando este cardápio será automaticamente exibido. Se nenhum
              horário se aplicar, o cardápio com maior prioridade será usado.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white text-sm font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
