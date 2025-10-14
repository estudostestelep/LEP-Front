import { X } from "lucide-react";

interface TagBadgeProps {
  name: string;
  color?: string;
  onRemove?: () => void;
  className?: string;
}

export function TagBadge({ name, color = "#6B7280", onRemove, className = "" }: TagBadgeProps) {
  // Calcula se a cor é escura para ajustar o texto
  const isColorDark = (hexColor: string): boolean => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  const textColor = isColorDark(color) ? "#FFFFFF" : "#000000";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: color,
        color: textColor,
      }}
    >
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-70 transition-opacity"
          aria-label="Remover tag"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
