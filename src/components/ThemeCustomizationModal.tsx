import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { Loader2, AlertCircle, CheckCircle, RotateCcw } from "lucide-react";
import { validateThemeColors } from "@/api/themeCustomizationService";
import { ThemeCustomization } from "@/types/theme";

interface ThemeCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeCustomizationModal({ isOpen, onClose }: ThemeCustomizationModalProps) {
  const { currentProject } = useAuth();
  const { theme, updateTheme, resetTheme, loading: themeLoading } = useTheme();

  const [colors, setColors] = useState<Partial<ThemeCustomization>>(theme);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setColors(theme);
  }, [theme, isOpen]);

  const colorFields = [
    { key: "primary_color", label: "Cor Primária", description: "Cor principal do sistema" },
    { key: "secondary_color", label: "Cor Secundária", description: "Cor secundária para destaques" },
    { key: "background_color", label: "Fundo", description: "Cor de fundo principal" },
    { key: "card_background_color", label: "Fundo do Card", description: "Fundo dos cards e modais" },
    { key: "text_color", label: "Texto Principal", description: "Cor do texto principal" },
    { key: "text_secondary_color", label: "Texto Secundário", description: "Cor do texto secundário" },
    { key: "accent_color", label: "Cor de Destaque", description: "Cor para elementos de destaque" },
  ];

  const handleColorChange = (key: string, value: string) => {
    setColors((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaved(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!currentProject) return;

    try {
      setLoading(true);
      setError(null);

      // Validar cores
      const errors = validateThemeColors(colors);
      if (errors.length > 0) {
        setError(errors.join(", "));
        return;
      }

      // Atualizar tema
      await updateTheme(colors);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Erro ao atualizar tema:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao atualizar tema. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      setError(null);
      await resetTheme();
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Erro ao resetar tema:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao resetar tema. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎨 Customização de Tema" size="lg">
      <div className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Tema salvo com sucesso!
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {colorFields.map((field) => (
            <Card key={field.key} className="p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{field.label}</label>
                <p className="text-xs text-gray-500">{field.description}</p>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={String(colors[field.key as keyof typeof colors]) || "#000000"}
                    onChange={(e) =>
                      handleColorChange(field.key, e.target.value)
                    }
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={String(colors[field.key as keyof typeof colors]) || "#000000"}
                    onChange={(e) =>
                      handleColorChange(field.key, e.target.value)
                    }
                    placeholder="#RRGGBB"
                    className="flex-1 text-sm font-mono"
                  />
                </div>
                {/* Preview da cor */}
                <div
                  className="h-8 w-full rounded border border-gray-300"
                  style={{
                    backgroundColor:
                      String(colors[field.key as keyof typeof colors]) || "#000000",
                  }}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Preview do tema */}
        <Card className="p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pré-visualização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.background_color || "#09090b",
                color: colors.text_color || "#fafafa",
              }}
            >
              <h3 className="font-semibold mb-2">Texto Principal</h3>
              <p className="text-sm opacity-75">Texto secundário apareceria aqui</p>
              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 rounded text-sm font-medium text-white"
                  style={{
                    backgroundColor: colors.primary_color || "#FF6B35",
                  }}
                >
                  Primário
                </button>
                <button
                  className="px-3 py-1 rounded text-sm font-medium text-white"
                  style={{
                    backgroundColor: colors.secondary_color || "#F4A261",
                  }}
                >
                  Secundário
                </button>
                <button
                  className="px-3 py-1 rounded text-sm font-medium text-white"
                  style={{
                    backgroundColor: colors.accent_color || "#FF9F1C",
                  }}
                >
                  Destaque
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 justify-end mt-6 pt-4 border-t">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={loading || themeLoading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4 mr-2" />
          )}
          Restaurar Padrão
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading || themeLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading || themeLoading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          Salvar Alterações
        </Button>
      </div>
    </Modal>
  );
}
