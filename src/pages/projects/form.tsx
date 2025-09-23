import { useState, useEffect } from "react";
import { projectService, Project, CreateProjectRequest } from "@/api/projectService";
import { organizationService, Organization } from "@/api/organizationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface Props {
  initialData?: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description: string;
  organization_id: string;
  active: boolean;
}

export default function ProjectForm({ initialData, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<FormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    organization_id: initialData?.organization_id || "",
    active: initialData?.active ?? true
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await organizationService.getAll();
        setOrganizations(response.data);
      } catch (error) {
        console.error("Erro ao carregar organizações:", error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setForm(prev => ({ ...prev, active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Nome do projeto é obrigatório");
      return;
    }

    if (!form.organization_id) {
      alert("Organização é obrigatória");
      return;
    }

    try {
      setIsSubmitting(true);

      if (initialData?.id) {
        // Atualizar projeto existente
        await projectService.update(initialData.id, form);
      } else {
        // Criar novo projeto
        const createData: CreateProjectRequest = {
          name: form.name,
          description: form.description || undefined,
          organization_id: form.organization_id,
          active: form.active
        };
        await projectService.create(createData);
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      alert("Erro ao salvar projeto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOrganizationName = (organizationId: string) => {
    return organizations.find(org => org.id === organizationId)?.name || "Organização não encontrada";
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? "Editar Projeto" : "Novo Projeto"}</span>
            <Badge variant={form.active ? "default" : "secondary"}>
              {form.active ? "Ativo" : "Inativo"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Nome do Projeto *
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Sistema de Reservas V2"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Organização */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Organização *
              </label>
              <select
                name="organization_id"
                value={form.organization_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                required
                disabled={isSubmitting}
              >
                <option value="">Selecione uma organização</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Descrição */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Descrição
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descreva o projeto..."
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-md"
                disabled={isSubmitting}
              />
            </div>

            {/* Status Ativo */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={form.active}
                onCheckedChange={handleSwitchChange}
                disabled={isSubmitting}
              />
              <label className="text-sm font-medium text-foreground">
                Projeto ativo
              </label>
            </div>

            {/* Resumo */}
            {form.name && form.organization_id && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Resumo</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Nome:</strong> {form.name}</div>
                  <div><strong>Organização:</strong> {getOrganizationName(form.organization_id)}</div>
                  {form.description && (
                    <div><strong>Descrição:</strong> {form.description}</div>
                  )}
                  <div><strong>Status:</strong> {form.active ? "Ativo" : "Inativo"}</div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !form.name.trim() || !form.organization_id}
                className="flex-1"
              >
                {isSubmitting ? "Salvando..." : (initialData ? "Atualizar" : "Criar Projeto")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}