import { useState, useEffect } from 'react';
import { displaySettingsService } from '@/api/displaySettingsService';
import { ProductDisplaySettings, DEFAULT_DISPLAY_SETTINGS } from '@/types/settings';
import { useAuth } from '@/context/authContext';

/**
 * 🎨 Hook para gerenciar configurações de exibição de produtos
 *
 * Carrega as configurações de exibição da API e fornece fallback para localStorage
 * Controla quais elementos do produto são visíveis (prep time, rating, description)
 */
export const useDisplaySettings = () => {
  const { currentProject } = useAuth();
  const [settings, setSettings] = useState<ProductDisplaySettings>(DEFAULT_DISPLAY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentProject) {
      setLoading(false);
      return;
    }

    loadSettings();
  }, [currentProject]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tenta carregar da API
      const response = await displaySettingsService.getSettings();
      setSettings(response.data);

      // Salvar no localStorage como backup
      localStorage.setItem(
        `@LEP:productDisplay:${currentProject}`,
        JSON.stringify(response.data)
      );
    } catch (err) {
      console.warn('Erro ao carregar configurações de exibição da API:', err);

      // Fallback para localStorage
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

  return {
    settings,
    loading,
    error,
    reload: loadSettings,
  };
};
