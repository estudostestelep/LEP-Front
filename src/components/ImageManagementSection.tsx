import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2, HardDrive, Loader2 } from "lucide-react";
import { imageManagementService, CleanupResponse } from "@/api/imageManagementService";
import { toast } from "sonner";

export function ImageManagementSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<CleanupResponse | null>(null);

  const handleCleanupOrphanedFiles = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja limpar imagens órfãs? Arquivos duplicados e não utilizados serão removidos permanentemente."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await imageManagementService.cleanupOrphanedFiles(0);

      setCleanupResult(response.data);

      if (response.data.success) {
        toast.success(
          `✅ ${response.data.files_deleted} arquivos deletados, ${response.data.disk_freed_mb.toFixed(2)}MB liberados`
        );
      } else {
        toast.error("❌ Erro ao limpar imagens órfãs");
      }
    } catch (error) {
      console.error("Erro ao limpar imagens:", error);
      toast.error("❌ Erro ao limpar imagens órfãs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await imageManagementService.getImageStats();

      toast.info(
        `📊 Total: ${response.data.total_files} arquivos, ${response.data.unique_files} únicos. Economia estimada: ${response.data.estimated_savings_mb.toFixed(2)}MB`
      );
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);
      toast.error("❌ Erro ao obter estatísticas de imagens");
    } finally {
      setIsLoadingStats(false);
    }
  };

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)}MB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trash2 className="h-5 w-5" />
          <span>Gerenciamento de Imagens</span>
        </CardTitle>
        <CardDescription>
          Limpar imagens órfãs e gerenciar armazenamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações sobre deduplicação */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <HardDrive className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Deduplicação de Imagens Ativada
              </p>
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                Sistema detecta imagens duplicadas automaticamente e economiza espaço em armazenamento.
                Múltiplas entidades podem compartilhar a mesma imagem sem duplicação.
              </p>
            </div>
          </div>
        </div>

        {/* Resultado da última limpeza */}
        {cleanupResult && (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="space-y-2">
              <p className="font-medium text-green-900 dark:text-green-100">
                ✅ Limpeza Concluída
              </p>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>
                  📁 Arquivos deletados:{" "}
                  <span className="font-semibold">{cleanupResult.files_deleted}</span>
                </li>
                <li>
                  💾 Espaço liberado:{" "}
                  <span className="font-semibold">
                    {formatBytes(cleanupResult.disk_freed)}
                  </span>
                </li>
                {cleanupResult.error_count > 0 && (
                  <li className="text-amber-600 dark:text-amber-400">
                    ⚠️ Erros durante limpeza:{" "}
                    <span className="font-semibold">{cleanupResult.error_count}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Aviso sobre soft delete */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                Como Funciona a Limpeza
              </p>
              <ul className="text-amber-700 dark:text-amber-300 text-xs space-y-1">
                <li>• Imagens com referências ativas são mantidas</li>
                <li>• Apenas imagens órfãs (sem uso) são deletadas</li>
                <li>• O processo é seguro e não afeta dados de entidades</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleCleanupOrphanedFiles}
            disabled={isLoading}
            variant="default"
            className="flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Limpando...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Limpar Imagens Órfãs</span>
              </>
            )}
          </Button>

          <Button
            onClick={handleGetStats}
            disabled={isLoadingStats}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {isLoadingStats ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Carregando...</span>
              </>
            ) : (
              <>
                <HardDrive className="h-4 w-4" />
                <span>Ver Estatísticas</span>
              </>
            )}
          </Button>
        </div>

        {/* Nota importante */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p>
            💡 <strong>Dica:</strong> Execute este processo regularmente para manter o armazenamento
            otimizado. A limpeza é segura e não afeta imagens em uso.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
