import api from "./api";

export interface CleanupResponse {
  success: boolean;
  files_deleted: number;
  disk_freed: number; // em bytes
  disk_freed_mb: number;
  error_count: number;
  message: string;
}

export interface ImageStatsResponse {
  total_files: number;
  unique_files: number;
  total_references: number;
  duplicated_references: number;
  total_disk_usage: number; // em bytes
  total_disk_usage_mb: number;
  estimated_savings: number; // em bytes
  estimated_savings_mb: number;
}

export const imageManagementService = {
  // Executar cleanup de imagens órfãs
  cleanupOrphanedFiles: (days: number = 0) =>
    api.post<CleanupResponse>(`/admin/images/cleanup?days=${days}`),

  // Obter estatísticas de imagens
  getImageStats: () =>
    api.get<ImageStatsResponse>("/admin/images/stats"),
};
