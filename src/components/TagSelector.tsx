import { useEffect, useState } from "react";
import { Tag, tagService } from "../api/tagService";
import { TagBadge } from "./TagBadge";
import { Plus, Loader2 } from "lucide-react";

interface TagSelectorProps {
  entityType?: string;
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
}

export function TagSelector({ entityType, selectedTags, onChange }: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadTags();
  }, [entityType]);

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const response = entityType
        ? await tagService.getTagsByEntityType(entityType)
        : await tagService.listActiveTags();
      setAvailableTags(response.data);
    } catch (error) {
      console.error("Erro ao carregar tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      onChange([...selectedTags, tag]);
    }
    setShowDropdown(false);
  };

  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTags.filter((t) => t.id !== tagId));
  };

  const unselectedTags = availableTags.filter(
    (tag) => !selectedTags.find((t) => t.id === tag.id)
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <TagBadge
            key={tag.id}
            name={tag.name}
            color={tag.color}
            onRemove={() => handleRemoveTag(tag.id)}
          />
        ))}
      </div>

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
          <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : unselectedTags.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                Nenhuma tag disponível
              </div>
            ) : (
              <div className="p-2">
                {unselectedTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 transition-colors"
                  >
                    <TagBadge name={tag.name} color={tag.color} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
