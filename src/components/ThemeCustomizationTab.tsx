import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/themeContext";
import { Palette, Loader2, RotateCcw, Sun, Moon } from "lucide-react";
import ThemeCustomizationModal from "./ThemeCustomizationModal";

/**
 * 🎨 ThemeCustomizationTab - Aba de customização de tema
 *
 * Permite personalizar as cores do sistema através de campos de entrada
 */
export default function ThemeCustomizationTab() {
  const { theme, loading } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDarkMode, setShowDarkMode] = useState(false);

  const colorFieldsByCategory = {
    "Cores Principais": [
      { key: "primary_color", label: "Cor Primária", description: "Cor principal do sistema" },
      { key: "secondary_color", label: "Cor Secundária", description: "Cor secundária para destaques" },
      { key: "background_color", label: "Fundo", description: "Cor de fundo principal" },
      { key: "card_background_color", label: "Fundo do Card", description: "Fundo dos cards e modais" },
      { key: "text_color", label: "Texto Principal", description: "Cor do texto principal" },
      { key: "text_secondary_color", label: "Texto Secundário", description: "Cor do texto secundário" },
      { key: "accent_color", label: "Cor de Destaque", description: "Cor para elementos de destaque" },
    ],
    "Cores Semânticas": [
      { key: "destructive_color", label: "Cor de Erro", description: "Cor para erros e ações destrutivas" },
      { key: "success_color", label: "Cor de Sucesso", description: "Cor para ações bem-sucedidas" },
      { key: "warning_color", label: "Cor de Aviso", description: "Cor para avisos e atenção" },
      { key: "border_color", label: "Cor de Bordas", description: "Cor padrão para bordas e divisores" },
      { key: "price_color", label: "Cor do Preço", description: "Cor customizável para preços no cardápio" },
    ],
    "Configurações do Sistema": [
      { key: "focus_ring_color", label: "Cor de Focus Ring", description: "Cor para outline de foco" },
      { key: "input_background_color", label: "Fundo de Inputs", description: "Fundo específico para campos de entrada" },
    ],
  };

  return (
    <>
      <div className="space-y-6">
        {/* Customização de Cores */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Customização de Tema
                </CardTitle>
                <CardDescription>
                  Personalize as cores do sistema de acordo com a identidade da sua marca
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <button
                  onClick={() => setShowDarkMode(!showDarkMode)}
                  className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors ${
                    showDarkMode ? "bg-slate-600" : "bg-amber-100"
                  }`}
                  title={showDarkMode ? "Mostrar tema claro" : "Mostrar tema escuro"}
                >
                  <span
                    className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
                      showDarkMode ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
                <Moon className="h-4 w-4 text-slate-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Tema Visual Wrapper */}
            <div
              className={`p-6 rounded-lg border transition-colors ${
                showDarkMode
                  ? "dark bg-slate-900 border-slate-700"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              {/* Cores Organizadas por Categoria */}
              {Object.entries(colorFieldsByCategory).map(([category, fields]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold mb-4 text-foreground">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field) => (
                    <Card key={field.key} className="p-4 bg-muted/50">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">{field.label}</label>
                          <p className="text-xs text-muted-foreground">{field.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={String(theme[field.key as keyof typeof theme]) || "#000000"}
                            disabled
                            className="h-10 w-20 cursor-default"
                          />
                          <Input
                            type="text"
                            value={String(theme[field.key as keyof typeof theme]) || "#000000"}
                            disabled
                            className="flex-1 text-sm font-mono cursor-default"
                          />
                        </div>
                        <div
                          className="h-8 w-full rounded border border-border"
                          style={{
                            backgroundColor: String(theme[field.key as keyof typeof theme]) || "#000000",
                          }}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            </div>

            {/* Preview do Tema */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Pré-visualização</h3>
              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: theme.background_color || "#09090b",
                  color: theme.text_color || "#fafafa",
                }}
              >
                <h4 className="font-semibold mb-2">Texto Principal</h4>
                <p className="text-sm mb-4" style={{ color: theme.text_secondary_color }}>
                  Texto secundário apareceria aqui
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    className="px-3 py-2 rounded font-medium text-sm text-white"
                    style={{
                      backgroundColor: theme.primary_color || "#0F172A",
                    }}
                  >
                    Botão Primário
                  </button>
                  <button
                    className="px-3 py-2 rounded font-medium text-sm text-white"
                    style={{
                      backgroundColor: theme.secondary_color || "#1E293B",
                    }}
                  >
                    Botão Secundário
                  </button>
                  <button
                    className="px-3 py-2 rounded font-medium text-sm text-white"
                    style={{
                      backgroundColor: theme.accent_color || "#ec4899",
                    }}
                  >
                    Destaque
                  </button>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Palette className="h-4 w-4 mr-2" />
                )}
                Editar Cores
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ThemeCustomizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
