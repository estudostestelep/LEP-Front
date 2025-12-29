import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { displaySettingsService } from "@/api/displaySettingsService";
import type { ProductDisplaySettings } from "@/types/settings";
import { DEFAULT_DISPLAY_SETTINGS } from "@/types/settings";
import {
  Clock,
  Star,
  Eye,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";

/**
 * ✨ ProductDisplaySettings - Aba de configuração de exibição de produtos
 *
 * Permite controlar se deve exibir:
 * - ⏱️ Tempo de preparo (prep_time)
 * - ⭐ Estrelas de avaliação (rating)
 * - 📝 Descrição do produto (description)
 */
export default function ProductDisplaySettings() {
  const { currentProject } = useAuth();
  const [settings, setSettings] = useState<ProductDisplaySettings>(DEFAULT_DISPLAY_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar configurações ao montar
  useEffect(() => {
    loadSettings();
  }, [currentProject]);

  const loadSettings = async () => {
    if (!currentProject) return;

    try {
      setLoading(true);
      setError(null);

      // Tenta carregar da API
      const response = await displaySettingsService.getSettings();
      setSettings(response.data);
    } catch (err) {
      console.error("Erro ao carregar configurações de exibição:", err);
      // Fallback para localStorage se API falhar
      const saved = localStorage.getItem(`@LEP:productDisplay:${currentProject}`);
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch {
          setSettings(DEFAULT_DISPLAY_SETTINGS);
        }
      } else {
        setSettings(DEFAULT_DISPLAY_SETTINGS);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof ProductDisplaySettings) => {
    if (key === 'show_prep_time' || key === 'show_rating' || key === 'show_description') {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
      setSaved(false);
    }
  };

  const handleSave = async () => {
    if (!currentProject) return;

    try {
      setLoading(true);
      setError(null);

      // Chamar API para salvar configurações
      await displaySettingsService.updateSettings(settings);

      // Salvar também no localStorage como backup
      localStorage.setItem(`@LEP:productDisplay:${currentProject}`, JSON.stringify(settings));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Erro ao salvar configurações:", err);
      setError("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      setError(null);

      // Chamar API para resetar
      const response = await displaySettingsService.resetToDefaults();
      setSettings(response.data);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Erro ao resetar configurações:", err);
      setError("Erro ao resetar configurações");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Exibição de Produtos</span>
            </CardTitle>
            <CardDescription>
              Controle quais informações são exibidas nos produtos
            </CardDescription>
          </div>
          <Settings className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Messages */}
        {error && (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {saved && (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">Configurações salvas com sucesso!</span>
          </div>
        )}

        {/* Tempo de Preparo */}
        <div className="space-y-3 pb-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Tempo de Preparo</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Exibir tempo estimado de preparo (ex: 15 min)
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("show_prep_time")}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors ${
                settings.show_prep_time ? "bg-green-500" : "bg-slate-300"
              }`}
              title={settings.show_prep_time ? "Desabilitar" : "Habilitar"}
            >
              <span
                className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
                  settings.show_prep_time ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          {settings.show_prep_time && (
            <div className="ml-13 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30">
              <p className="text-xs text-muted-foreground">
                ✅ Campo <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">prep_time</code> será exibido
              </p>
            </div>
          )}
        </div>

        {/* Estrelas/Rating */}
        <div className="space-y-3 pb-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Avaliações (Estrelas)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Exibir nota/avaliação do produto (ex: ⭐⭐⭐⭐⭐)
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("show_rating")}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors ${
                settings.show_rating ? "bg-green-500" : "bg-slate-300"
              }`}
              title={settings.show_rating ? "Desabilitar" : "Habilitar"}
            >
              <span
                className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
                  settings.show_rating ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          {settings.show_rating && (
            <div className="ml-13 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30">
              <p className="text-xs text-muted-foreground">
                ✅ Campo <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">rating</code> será exibido
              </p>
            </div>
          )}
        </div>

        {/* Descrição */}
        <div className="space-y-3 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Descrição do Produto</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Exibir descrição detalhada do produto
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle("show_description")}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors ${
                settings.show_description ? "bg-green-500" : "bg-slate-300"
              }`}
              title={settings.show_description ? "Desabilitar" : "Habilitar"}
            >
              <span
                className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
                  settings.show_description ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          {settings.show_description && (
            <div className="ml-13 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30">
              <p className="text-xs text-muted-foreground">
                ✅ Campo <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">description</code> será exibido
              </p>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-semibold mb-3">Preview: Como será exibido</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <p className="font-medium text-foreground">Exemplo de Produto</p>
              {settings.show_description && (
                <p className="text-xs mt-1 text-muted-foreground">
                  Descrição do produto será mostrada aqui
                </p>
              )}
              {settings.show_prep_time && (
                <p className="text-xs mt-1 flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>15 min</span>
                </p>
              )}
              {settings.show_rating && (
                <p className="text-xs mt-1 flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span>4.5 ★</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            Restaurar Padrões
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{loading ? "Salvando..." : "Salvar Configurações"}</span>
          </Button>
        </div>

        {/* Info */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
          <p className="text-xs leading-relaxed">
            💡 <strong>Dica:</strong> Essas configurações afetam como os produtos aparecem em:
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Página pública de cardápio (/menu)</li>
              <li>Admin menu (ao editar produtos)</li>
              <li>APIs de produtos</li>
            </ul>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
