import { ImageOff } from "lucide-react";
import { useState } from "react";

interface CategoryImageProps {
  imageUrl?: string;
  categoryName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  asBackground?: boolean; // Novo prop para usar como background
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-32 h-32",
};

const iconSizes = {
  sm: 20,
  md: 28,
  lg: 48,
};

export function CategoryImage({
  imageUrl,
  categoryName,
  size = "md",
  className = "",
  asBackground = false,
}: CategoryImageProps) {
  const [imageError, setImageError] = useState(false);

  const showFallback = !imageUrl || imageError;

  // Modo background - retorna apenas a classe de estilo
  if (asBackground) {
    if (showFallback) {
      return (
        <div
          className={`${className} rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600`}
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <ImageOff size={12} strokeWidth={2} className="text-white opacity-70" />
        </div>
      );
    }

    return (
      <div
        className={`${className} rounded-lg overflow-hidden`}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img
          src={imageUrl}
          alt={categoryName}
          className="invisible w-0 h-0"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Modo normal (padrão)
  return (
    <div
      className={`${sizeClasses[size]} ${className} rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 shadow-md`}
    >
      {showFallback ? (
        <div className="flex flex-col items-center justify-center text-white p-2">
          <ImageOff size={iconSizes[size]} strokeWidth={1.5} />
          {size === "lg" && (
            <span className="text-xs mt-1 text-center font-medium opacity-90">
              Sem imagem
            </span>
          )}
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={categoryName}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}
