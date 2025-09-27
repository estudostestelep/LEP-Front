import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Image as ImageIcon, Loader2, Link, Camera } from "lucide-react";
import { productService } from "@/api/productService";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved: () => void;
  onFileSelected?: (file: File | null) => void;
  disabled?: boolean;
}

export interface ImageUploadRef {
  uploadSelectedFile: () => Promise<string | null>;
  getSelectedFile: () => File | null;
}

const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  onFileSelected,
  disabled = false
}, ref) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validações
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      alert('Arquivo muito grande. Tamanho máximo: 5MB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP');
      return;
    }

    // Limpar preview anterior se existir
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Criar preview imediatamente
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setSelectedFile(file);

    // Notificar o componente pai sobre o arquivo selecionado
    onFileSelected?.(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isUploading) return;

    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    if (disabled || isUploading) return;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
    setSelectedFile(null);
    onFileSelected?.(null);
    onImageRemoved();
  };

  const validateImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      setUrlError("Por favor, insira uma URL");
      return;
    }

    if (!validateImageUrl(urlInput)) {
      setUrlError("URL inválida. Use uma URL começando com http:// ou https://");
      return;
    }

    try {
      setIsUploading(true);
      setUrlError("");

      // Testar se a URL é uma imagem válida
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = urlInput;
      });

      onImageUploaded(urlInput);
      setUrlInput("");
      setShowUrlInput(false);
    } catch {
      setUrlError("Não foi possível carregar a imagem desta URL");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleUrlInput = () => {
    setShowUrlInput(!showUrlInput);
    setUrlInput("");
    setUrlError("");
  };

  // Função para fazer upload do arquivo selecionado
  const uploadSelectedFile = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    try {
      setIsUploading(true);
      const response = await productService.uploadImage(selectedFile);
      return response.data.image_url;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Expor funções via ref
  useImperativeHandle(ref, () => ({
    uploadSelectedFile,
    getSelectedFile: () => selectedFile
  }));

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {(currentImageUrl || previewUrl) ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative group">
              <img
                src={previewUrl || currentImageUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />

              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={openFileDialog}
                    disabled={disabled || isUploading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={toggleUrlInput}
                    disabled={disabled || isUploading}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    URL
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    disabled={disabled || isUploading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card
            className={`border-2 border-dashed transition-colors cursor-pointer ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <CardContent className="p-8">
              <div className="text-center">
                {isUploading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Processando...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Arraste e solte uma imagem ou clique para selecionar
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WebP até 5MB
                      </p>
                    </div>
                    <div className="text-muted-foreground text-sm">ou</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUrlInput();
                      }}
                      disabled={disabled}
                      className="flex items-center space-x-2"
                    >
                      <Link className="h-4 w-4" />
                      <span>Usar URL da imagem</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* URL Input Section */}
          {showUrlInput && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Link className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">URL da imagem</h4>
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={urlInput}
                      onChange={(e) => {
                        setUrlInput(e.target.value);
                        setUrlError("");
                      }}
                      disabled={disabled || isUploading}
                      className={urlError ? "border-destructive" : ""}
                    />
                    <Button
                      onClick={handleUrlSubmit}
                      disabled={disabled || isUploading || !urlInput.trim()}
                      size="sm"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Adicionar"
                      )}
                    </Button>
                  </div>

                  {urlError && (
                    <p className="text-xs text-destructive">{urlError}</p>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleUrlInput}
                    disabled={isUploading}
                    className="w-full"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;