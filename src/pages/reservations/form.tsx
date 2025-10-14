import { useState, useEffect } from "react";
import { reservationService, Reservation, CreateReservationRequest } from "@/api/bookingService";
import { customerService, Customer } from "@/api/customerService";
import { tableService, Table } from "@/api/tableService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrentTenant } from '@/hooks/useCurrentTenant';

interface Props {
  initialData?: Reservation;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  customer_id: string;
  table_id: string;
  datetime: string;
  party_size: number;
  note?: string;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
}

export default function ReservationForm({ initialData, onSuccess, onCancel }: Props) {
  const { organization_id, project_id } = useCurrentTenant();
  const [form, setForm] = useState<FormData>({
    customer_id: initialData?.customer_id || "",
    table_id: initialData?.table_id || "",
    datetime: initialData?.datetime ?
      new Date(initialData.datetime).toISOString().slice(0, 16) :
      "",
    party_size: initialData?.party_size || 2,
    note: initialData?.note || "",
    status: initialData?.status || "confirmed"
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, tablesRes] = await Promise.all([
          customerService.getAll(),
          tableService.getAll()
        ]);
        setCustomers(customersRes.data);
        setTables(tablesRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organization_id || !project_id) {
      alert("Erro: dados de organização não encontrados");
      return;
    }

    if (!form.customer_id || !form.table_id || !form.datetime) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      setIsSubmitting(true);

      if (initialData?.id) {
        // Atualizar reserva existente
        const updateData = {
          ...form,
          datetime: new Date(form.datetime).toISOString()
        };
        await reservationService.update(initialData.id, updateData);
      } else {
        // Criar nova reserva
        const createData: CreateReservationRequest = {
          organization_id: organization_id,
          project_id: project_id,
          customer_id: form.customer_id,
          table_id: form.table_id,
          datetime: new Date(form.datetime).toISOString(),
          party_size: form.party_size,
          note: form.note
        };
        await reservationService.create(createData);
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar reserva:", error);
      alert("Erro ao salvar reserva. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar mesas disponíveis com capacidade suficiente
  const availableTables = tables.filter(table =>
    table.capacity >= form.party_size && table.status === "livre"
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? "Editar Reserva" : "Nova Reserva"}</span>
            <Badge variant={form.status === "confirmed" ? "default" : "secondary"}>
              {form.status === "confirmed" ? "Confirmada" :
               form.status === "cancelled" ? "Cancelada" :
               form.status === "completed" ? "Concluída" : "Não Compareceu"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cliente */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Cliente *
              </label>
              <select
                name="customer_id"
                value={form.customer_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                required
                disabled={isSubmitting}
              >
                <option value="">Selecione um cliente</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Data e Hora */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Data e Hora *
              </label>
              <Input
                type="datetime-local"
                name="datetime"
                value={form.datetime}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            {/* Número de Pessoas */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Número de Pessoas *
              </label>
              <Input
                type="number"
                name="party_size"
                value={form.party_size}
                onChange={handleChange}
                placeholder="Ex: 4"
                min="1"
                max="20"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mínimo: 1 pessoa, Máximo: 20 pessoas
              </p>
            </div>

            {/* Mesa */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Mesa *
              </label>
              <select
                name="table_id"
                value={form.table_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                required
                disabled={isSubmitting}
              >
                <option value="">Selecione uma mesa</option>
                {availableTables.map(table => (
                  <option key={table.id} value={table.id}>
                    Mesa {table.number} - {table.capacity} lugares
                    {table.location && ` (${table.location})`}
                  </option>
                ))}
              </select>

              {form.party_size > 0 && availableTables.length === 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  Nenhuma mesa disponível para {form.party_size} pessoas
                </p>
              )}

              {availableTables.length > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  {availableTables.length} mesa(s) disponível(is)
                </p>
              )}
            </div>

            {/* Status (apenas para edição) */}
            {initialData && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                  disabled={isSubmitting}
                >
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                  <option value="completed">Concluída</option>
                  <option value="no_show">Não Compareceu</option>
                </select>
              </div>
            )}

            {/* Observações */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Observações
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Observações da reserva (alergias, preferências, etc.)"
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none rounded-md"
                disabled={isSubmitting}
              />
            </div>

            {/* Resumo da Reserva */}
            {form.customer_id && form.table_id && form.datetime && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Resumo da Reserva</h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <strong>Cliente:</strong> {
                      customers.find(c => c.id === form.customer_id)?.name
                    }
                  </div>
                  <div>
                    <strong>Mesa:</strong> Mesa {
                      tables.find(t => t.id === form.table_id)?.number
                    } ({tables.find(t => t.id === form.table_id)?.capacity} lugares)
                  </div>
                  <div>
                    <strong>Data/Hora:</strong> {
                      new Date(form.datetime).toLocaleString('pt-BR')
                    }
                  </div>
                  <div>
                    <strong>Pessoas:</strong> {form.party_size}
                  </div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !form.customer_id || !form.table_id || !form.datetime}
                className="flex-1"
              >
                {isSubmitting ? "Salvando..." : (initialData ? "Atualizar" : "Criar Reserva")}
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