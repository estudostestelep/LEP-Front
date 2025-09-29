import api from "./api";

export interface ImageUploadResponse {
  success: boolean;
  image_url: string;
  filename: string;
  size: number;
  organization_id: string;
  project_id: string;
}

export interface ImageValidationError {
  code: 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'NO_FILE';
  message: string;
}

/**
 * Serviço genérico para upload de imagens
 * Suporta diferentes categorias e validações
 */
export const imageService = {
  /**
   * Valida um arquivo antes do upload
   */
  validateFile: (file: File): ImageValidationError | null => {
    if (!file) {
      return {
        code: 'NO_FILE',
        message: 'Nenhum arquivo selecionado'
      };
    }

    // Verificar tamanho (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        code: 'FILE_TOO_LARGE',
        message: 'Arquivo muito grande. Tamanho máximo: 5MB'
      };
    }

    // Verificar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        code: 'INVALID_TYPE',
        message: 'Tipo de arquivo inválido. Use: JPEG, PNG ou WebP'
      };
    }

    return null;
  },

  /**
   * Cria uma URL de preview para um arquivo
   */
  createPreviewUrl: (file: File): string => {
    return URL.createObjectURL(file);
  },

  /**
   * Libera uma URL de preview da memória
   */
  revokePreviewUrl: (url: string): void => {
    URL.revokeObjectURL(url);
  },

  /**
   * Upload genérico de imagem por categoria
   */
  uploadImage: async (file: File, category: string): Promise<ImageUploadResponse> => {
    // Validar arquivo antes do upload
    const validation = imageService.validateFile(file);
    if (validation) {
      throw new Error(validation.message);
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post<ImageUploadResponse>(
        `/upload/${category}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      // Tratar erros específicos do backend
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; code?: string };

      if (axiosError.response?.status === 413) {
        throw new Error('Arquivo muito grande. Reduza o tamanho e tente novamente.');
      } else if (axiosError.response?.status === 400) {
        const message = axiosError.response?.data?.message || 'Formato de arquivo inválido ou dados corrompidos.';
        throw new Error(message);
      } else if (axiosError.response?.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      } else if (axiosError.response?.status === 403) {
        throw new Error('Você não tem permissão para fazer upload de imagens.');
      } else if (axiosError.response?.status === 500) {
        throw new Error('Erro no servidor. Tente novamente mais tarde.');
      } else if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        const message = axiosError.response?.data?.message || 'Erro ao fazer upload da imagem. Tente novamente.';
        throw new Error(message);
      }
    }
  },

  /**
   * Métodos específicos para cada categoria
   */

  // Upload de imagem de produto
  uploadProductImage: (file: File) => {
    return imageService.uploadImage(file, 'product');
  },

  // Upload de avatar de usuário
  uploadUserAvatar: (file: File) => {
    return imageService.uploadImage(file, 'user');
  },

  // Upload de logo do restaurante
  uploadRestaurantLogo: (file: File) => {
    return imageService.uploadImage(file, 'restaurant');
  },

  // Upload de imagem de ambiente/projeto
  uploadProjectImage: (file: File) => {
    return imageService.uploadImage(file, 'project');
  },

  /**
   * Utilitários para formatação
   */

  // Formatar tamanho de arquivo para exibição
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Verificar se uma URL é válida para imagem
  isValidImageUrl: (url: string): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null;
    } catch {
      return false;
    }
  },
};

export default imageService;