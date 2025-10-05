import { useEffect, useState } from "react";
import { Tag, tagService } from "../api/tagService";
import { productService } from "../api/productService";
import { TagBadge } from "./TagBadge";
import { Plus, Loader2 } from "lucide-react";

interface ProductTagManagerProps {
  productId: string;
  onTagsChange?: () => void;
}

export function ProductTagManager({ productId, onTagsChange }: ProductTagManagerProps) {
  const [productTags, setProductTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadProductTags();
    loadAvailableTags();
  }, [productId]);

  const loadProductTags = async () => {
    setIsLoading(true);
    try {
      const response = await productService.getProductTags(productId);
      setProductTags(response.data);
    } catch (error) {
      console.error("Erro ao carregar tags do produto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableTags = async () => {
    try {
      const response = await tagService.getTagsByEntityType("product");
      setAvailableTags(response.data.filter((tag) => tag.active));
    } catch (error) {
      console.error("Erro ao carregar tags disponíveis:", error);
    }
  };

  const handleAddTag = async (tagId: string) => {
    try {
      await productService.addTagToProduct(productId, tagId);
      await loadProductTags();
      setShowDropdown(false);
      onTagsChange?.();
    } catch (error) {
      console.error("Erro ao adicionar tag:", error);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      await productService.removeTagFromProduct(productId, tagId);
      await loadProductTags();
      onTagsChange?.();
    } catch (error) {
      console.error("Erro ao remover tag:", error);
    }
  };

  const unselectedTags = availableTags.filter(
    (tag) => !productTags.find((pt) => pt.id === tag.id)
  );

  if (isLoading && productTags.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Carregando tags...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Tags do Produto</label>
      </div>

      {/* Tags Aplicadas */}
      <div className="flex flex-wrap gap-2">
        {productTags.length === 0 ? (
          <span className="text-sm text-gray-500">Nenhuma tag aplicada</span>
        ) : (
          productTags.map((tag) => (
            <TagBadge
              key={tag.id}
              name={tag.name}
              color={tag.color}
              onRemove={() => handleRemoveTag(tag.id)}
            />
          ))
        )}
      </div>

      {/* Adicionar Tag */}
      {unselectedTags.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar Tag
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute z-20 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="p-2">
                  {unselectedTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleAddTag(tag.id)}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 transition-colors"
                    >
                      <TagBadge name={tag.name} color={tag.color} />
                      {tag.description && (
                        <p className="text-xs text-gray-500 mt-1 ml-1">
                          {tag.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
