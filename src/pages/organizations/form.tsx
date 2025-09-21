import { useState } from "react";
import { organizationService, Organization, CreateOrganizationRequest } from "@/api/organizationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface Props {
  initialData?: Organization;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}

export default function OrganizationForm({ initialData, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<FormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    active: initialData?.active ?? true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setForm(prev => ({ ...prev, active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Nome da organização é obrigatório");
      return;
    }

    try {
      setIsSubmitting(true);

      if (initialData?.id) {
        // Atualizar organização existente
        await organizationService.update(initialData.id, form);
      } else {
        // Criar nova organização
        const createData: CreateOrganizationRequest = {
          name: form.name,
          description: form.description || undefined,
          email: form.email || undefined,
          phone: form.phone || undefined,
          address: form.address || undefined,
          active: form.active
        };
        await organizationService.create(createData);
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar organização:", error);
      alert("Erro ao salvar organização. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? "Editar Organização" : "Nova Organização"}</span>
            <Badge variant={form.active ? "default" : "secondary"}>
              {form.active ? "Ativa" : "Inativa"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Nome da Organização *
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Restaurante Bom Sabor"
                required
                disabled={isSubmitting}
              />
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
                placeholder="Descreva a organização..."
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-md"
                disabled={isSubmitting}
              />
            </div>

            {/* Email e Telefone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contato@organizacao.com"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Telefone
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Endereço */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Endereço
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Endereço completo da organização..."
                className="w-full min-h-[60px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-md"
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
                Organização ativa
              </label>
            </div>

            {/* Resumo */}
            {form.name && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Resumo</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Nome:</strong> {form.name}</div>
                  {form.description && (
                    <div><strong>Descrição:</strong> {form.description}</div>
                  )}
                  {form.email && (
                    <div><strong>Email:</strong> {form.email}</div>
                  )}
                  {form.phone && (
                    <div><strong>Telefone:</strong> {form.phone}</div>
                  )}
                  {form.address && (
                    <div><strong>Endereço:</strong> {form.address}</div>
                  )}
                  <div><strong>Status:</strong> {form.active ? "Ativa" : "Inativa"}</div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !form.name.trim()}
                className="flex-1"
              >
                {isSubmitting ? "Salvando..." : (initialData ? "Atualizar" : "Criar Organização")}
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