import api from "./api";

export interface UploadImageResponse {
  success: boolean;
  image_url: string;
  filename: string;
  size: number;
}

export interface UpdateProductImageRequest {
  image_url: string;
}

export const uploadService = {
  // Upload de imagem de produto
  uploadProductImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    return api.post<UploadImageResponse>('/upload/product/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Atualizar URL da imagem de um produto específico
  updateProductImage: (productId: string, data: UpdateProductImageRequest) =>
    api.put<{ message: string; data: unknown }>(`/product/${productId}/image`, data),

  // Obter URL completa para visualização de imagem
  getImageUrl: (imageUrl: string): string => {
    // Se já é uma URL completa, retorna como está
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // Se é um caminho relativo do servidor, constrói URL completa
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://lep-system-341885235510.us-central1.run.app';

    // Se já começa com /uploads, usa diretamente
    if (imageUrl.startsWith('/uploads/')) {
      return `${baseUrl}${imageUrl}`;
    }

    // Se não tem /uploads, assume que é um path de produtos
    return `${baseUrl}/uploads/products/${imageUrl}`;
  },

  // Validar se o arquivo é uma imagem válida
  validateImageFile: (file: File): { isValid: boolean; error?: string } => {
    // Verificar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de arquivo inválido. Apenas JPEG, PNG, WebP e GIF são permitidos.'
      };
    }

    // Verificar tamanho (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Arquivo muito grande. Tamanho máximo é 5MB.'
      };
    }

    return { isValid: true };
  },

  // Redimensionar imagem (opcional, para otimização)
  resizeImage: (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calcular dimensões mantendo proporção
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para blob
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }
};