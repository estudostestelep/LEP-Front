import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { Loader2, AlertCircle, CheckCircle, RotateCcw, AlertTriangle, Eye, HelpCircle, Moon, Sun } from "lucide-react";
import { validateThemeColors } from "@/api/themeCustomizationService";
import { ThemeCustomization } from "@/types/theme";
import { validateContrast, isValidHex } from "@/lib/color-utils";
import { colorImpactMap } from "@/lib/color-impact";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface ThemeCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeCustomizationModal({ isOpen, onClose }: ThemeCustomizationModalProps) {
  const { currentProject } = useAuth();
  const { theme, updateTheme, resetTheme, loading: themeLoading } = useTheme();

  const [colors, setColors] = useState<Partial<ThemeCustomization>>(theme || {});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contrastWarnings, setContrastWarnings] = useState<string[]>([]);
  const [showDarkMode, setShowDarkMode] = useState(false);

  useEffect(() => {
    setColors(theme || {});
    // Sincronizar showDarkMode com o tema atual do sistema
    const isDarkMode = document.documentElement.classList.contains("dark");
    setShowDarkMode(isDarkMode);
  }, [theme, isOpen]);

  // Validar contraste em tempo real
  useEffect(() => {
    const warnings: string[] = [];

    // Validar se as cores são válidas
    const validColors = {
      primary_color: colors.primary_color,
      text_color: colors.text_color,
      background_color: colors.background_color,
    };

    // Verificar contraste primary_color vs background_color
    if (
      validColors.primary_color &&
      validColors.background_color &&
      isValidHex(validColors.primary_color) &&
      isValidHex(validColors.background_color)
    ) {
      const result = validateContrast(
        validColors.primary_color,
        validColors.background_color
      );
      if (result.level === 'FAIL') {
        warnings.push(
          `⚠️ Contraste baixo: cor primária vs fundo (${result.ratio.toFixed(2)}:1)`
        );
      } else if (result.level === 'AA') {
        warnings.push(
          `ℹ️ Contraste AA: cor primária vs fundo (${result.ratio.toFixed(2)}:1) - Recomenda-se AAA`
        );
      }
    }

    // Verificar contraste text_color vs background_color
    if (
      validColors.text_color &&
      validColors.background_color &&
      isValidHex(validColors.text_color) &&
      isValidHex(validColors.background_color)
    ) {
      const result = validateContrast(
        validColors.text_color,
        validColors.background_color
      );
      if (result.level === 'FAIL') {
        warnings.push(
          `⚠️ Contraste baixo: texto vs fundo (${result.ratio.toFixed(2)}:1)`
        );
      }
    }

    setContrastWarnings(warnings);
  }, [colors]);

  const colorFieldsByCategory = {
    "Cores Principais": [
      { baseKey: "primary_color", label: "Cor Primária", description: "Cor principal do sistema", required: true },
      { baseKey: "secondary_color", label: "Cor Secundária", description: "Cor secundária para destaques", required: true },
      { baseKey: "background_color", label: "Fundo", description: "Cor de fundo principal", required: true },
      { baseKey: "card_background_color", label: "Fundo do Card", description: "Fundo dos cards e modais", required: true },
      { baseKey: "text_color", label: "Texto Principal", description: "Cor do texto principal", required: true },
      { baseKey: "text_secondary_color", label: "Texto Secundário", description: "Cor do texto secundário", required: true },
      { baseKey: "accent_color", label: "Cor de Destaque", description: "Cor para elementos de destaque", required: true },
    ],
    "Cores Semânticas": [
      { baseKey: "destructive_color", label: "Cor de Erro", description: "Cor para erros e ações destrutivas", required: false },
      { baseKey: "success_color", label: "Cor de Sucesso", description: "Cor para ações bem-sucedidas", required: false },
      { baseKey: "warning_color", label: "Cor de Aviso", description: "Cor para avisos e atenção", required: false },
      { baseKey: "border_color", label: "Cor de Bordas", description: "Cor padrão para bordas e divisores", required: false },
      { baseKey: "price_color", label: "Cor do Preço", description: "Cor customizável para preços no cardápio", required: false },
    ],
    "Configurações do Sistema": [
      { baseKey: "focus_ring_color", label: "Cor de Focus Ring", description: "Cor para outline de foco", required: false },
      { baseKey: "input_background_color", label: "Fundo de Inputs", description: "Fundo específico para campos de entrada", required: false },
    ],
  };

  const numericFieldsByCategory = {
    "Configurações Numéricas": [
      { key: "disabled_opacity", label: "Opacidade Desabilitada", description: "Opacidade para estados desabilitados (0.0-1.0)", min: 0, max: 1, step: 0.05 },
      { key: "shadow_intensity", label: "Intensidade de Sombras", description: "Intensidade de sombras e profundidade (0.0-2.0)", min: 0, max: 2, step: 0.1 },
    ],
  };

  const getFieldKey = (baseKey: string): string => {
    if (showDarkMode) {
      return `${baseKey}_dark`;
    }
    return `${baseKey}_light`;
  };

  const getFieldLabel = (label: string): string => {
    if (showDarkMode) {
      return `${label} (Modo Escuro)`;
    }
    return `${label} (Modo Claro)`;
  };

  // Default colors for light and dark modes
  const defaultColors = {
    light: {
      primary_color: "#1E293B",
      background_color: "#FFFFFF",
      text_color: "#0F172A",
      secondary_color: "#8B5CF6",
      accent_color: "#EC4899",
    },
    dark: {
      primary_color: "#F8FAFC",
      background_color: "#0F172A",
      text_color: "#F8FAFC",
      secondary_color: "#A78BFA",
      accent_color: "#F472B6",
    },
  };

  const getColorValue = (baseKey: string): string => {
    const fieldKey = getFieldKey(baseKey);
    const value = colors[fieldKey as keyof typeof colors];
    if (value && typeof value === "string" && value.trim()) {
      return value;
    }
    // Use default based on mode
    const mode = showDarkMode ? "dark" : "light";
    return (
      defaultColors[mode][baseKey as keyof (typeof defaultColors)[typeof mode]] ||
      (mode === "dark" ? "#09090b" : "#ffffff")
    );
  };

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

        {/* Avisos de Contraste */}
        {contrastWarnings.length > 0 && (
          <div className="space-y-2">
            {contrastWarnings.map((warning, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                  warning.includes('⚠️')
                    ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-700'
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-700'
                }`}
              >
                {warning.includes('⚠️') ? (
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <Eye className="h-4 w-4 mt-0.5 flex-shrink-0" />
                )}
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}

        {/* Toggle Light/Dark Mode */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg mb-4">
          <span className="text-sm font-medium">Modo de Customização</span>
          <div className="flex items-center gap-2 bg-background rounded-lg p-1 border">
            <button
              type="button"
              onClick={() => setShowDarkMode(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-sm font-medium ${
                !showDarkMode
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sun className="h-4 w-4" />
              Claro
            </button>
            <button
              type="button"
              onClick={() => setShowDarkMode(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-sm font-medium ${
                showDarkMode
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Moon className="h-4 w-4" />
              Escuro
            </button>
          </div>
        </div>

        {/* Campos de cores organizados por categoria */}
        {Object.entries(colorFieldsByCategory).map(([category, fields]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold mb-3 text-foreground">{category}</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {fields.map((field) => {
                const fieldKey = getFieldKey(field.baseKey);
                return (
                  <Card key={fieldKey} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">{getFieldLabel(field.label)}</label>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="h-5 w-5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                                title="Clique para ver onde essa cor é aplicada"
                              >
                                <HelpCircle className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs text-xs">
                              {colorImpactMap[field.baseKey] || "Cor customizável para o sistema"}
                            </TooltipContent>
                          </Tooltip>
                          {field.required && <span className="text-xs text-red-500">*</span>}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{field.description}</p>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={String(colors[fieldKey as keyof typeof colors]) || "#000000"}
                          onChange={(e) =>
                            handleColorChange(fieldKey, e.target.value)
                          }
                          className="h-10 w-20 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={String(colors[fieldKey as keyof typeof colors]) || "#000000"}
                          onChange={(e) =>
                            handleColorChange(fieldKey, e.target.value)
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
                            String(colors[fieldKey as keyof typeof colors]) || "#000000",
                        }}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {/* Campos Numéricos */}
        {Object.entries(numericFieldsByCategory).map(([category, fields]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold mb-3 text-foreground">{category}</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {fields.map((field) => {
                const fieldValue = colors[field.key as keyof typeof colors] as number | undefined;
                return (
                  <Card key={field.key} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">{field.label}</label>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="h-5 w-5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                                title="Informações sobre este campo"
                              >
                                <HelpCircle className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs text-xs">
                              {colorImpactMap[field.key] || field.description}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{field.description}</p>
                      <div className="space-y-1">
                        <Input
                          type="range"
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          value={fieldValue !== undefined ? fieldValue : field.min}
                          onChange={(e) =>
                            handleColorChange(field.key, e.target.value)
                          }
                          className="w-full"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            value={fieldValue !== undefined ? fieldValue.toFixed(2) : field.min}
                            onChange={(e) =>
                              handleColorChange(field.key, e.target.value)
                            }
                            className="flex-1 text-sm"
                          />
                          <span className="text-xs text-muted-foreground w-8 text-center">
                            {fieldValue !== undefined ? fieldValue.toFixed(2) : field.min}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {/* Preview do tema */}
        <Card className="p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Pré-visualização - Modo {showDarkMode ? "Escuro" : "Claro"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: getColorValue("background_color"),
                color: getColorValue("text_color"),
              }}
            >
              <h3 className="font-semibold mb-2">Texto Principal</h3>
              <p className="text-sm opacity-75">Texto secundário apareceria aqui</p>
              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 rounded text-sm font-medium text-white"
                  style={{
                    backgroundColor: getColorValue("primary_color"),
                  }}
                >
                  Primário
                </button>
                <button
                  className="px-3 py-1 rounded text-sm font-medium text-white"
                  style={{
                    backgroundColor: getColorValue("secondary_color"),
                  }}
                >
                  Secundário
                </button>
                <button
                  className="px-3 py-1 rounded text-sm font-medium text-white"
                  style={{
                    backgroundColor: getColorValue("accent_color"),
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
