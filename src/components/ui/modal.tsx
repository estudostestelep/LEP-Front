import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md"
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full ${sizeClasses[size]} bg-background rounded-lg shadow-xl border`}>
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Close button when no title */}
          {!title && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4 h-8 w-8 p-0 z-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Body */}
          <div className={title ? "p-6" : "p-6 pt-12"}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}