import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/themeContext";
import { Palette, Loader2 } from "lucide-react";
import ThemeCustomizationModal from "./ThemeCustomizationModal";

/**
 * 🎨 ThemeCustomizationTab - Aba de customização de tema
 *
 * Permite personalizar as cores do sistema através de um modal
 */
export default function ThemeCustomizationTab() {
  const { theme, loading } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colorFields = [
    { key: "primary_color", label: "Cor Primária" },
    { key: "secondary_color", label: "Cor Secundária" },
    { key: "background_color", label: "Fundo" },
    { key: "card_background_color", label: "Fundo do Card" },
    { key: "text_color", label: "Texto Principal" },
    { key: "text_secondary_color", label: "Texto Secundário" },
    { key: "accent_color", label: "Cor de Destaque" },
  ];

  return (
    <>
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
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cores Atuais */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Cores Atuais</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {colorFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <p className="text-xs text-muted-foreground">{field.label}</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-full rounded border border-gray-300"
                      style={{
                        backgroundColor:
                          String(theme[field.key as keyof typeof theme]) || "#000000",
                      }}
                    />
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">
                    {theme[field.key as keyof typeof theme] || "#000000"}
                  </p>
                </div>
              ))}
            </div>
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
                    backgroundColor: theme.primary_color || "#FF6B35",
                  }}
                >
                  Botão Primário
                </button>
                <button
                  className="px-3 py-2 rounded font-medium text-sm text-white"
                  style={{
                    backgroundColor: theme.secondary_color || "#F4A261",
                  }}
                >
                  Botão Secundário
                </button>
                <button
                  className="px-3 py-2 rounded font-medium text-sm text-white"
                  style={{
                    backgroundColor: theme.accent_color || "#FF9F1C",
                  }}
                >
                  Destaque
                </button>
              </div>
            </div>
          </div>

          {/* Botão de Customização */}
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Palette className="h-4 w-4 mr-2" />
            )}
            Customizar Cores
          </Button>
        </CardContent>
      </Card>

      <ThemeCustomizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
