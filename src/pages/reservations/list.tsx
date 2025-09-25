import { useEffect, useState, useCallback } from "react";
import { reservationService, Reservation, ReservationFilters } from "@/api/bookingService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Calendar, Plus, Edit, Trash2, Clock, Users, CalendarDays } from "lucide-react";
import ReservationForm from "./form";
import ConfirmModal from "@/components/confirmModal";
import { AxiosError } from "axios";

export default function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReservationFilters>({
    date: new Date().toISOString().split('T')[0], // Hoje
    status: "",
    table_id: ""
  });

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await reservationService.getAll(filters);
      setReservations(response.data);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      setError(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao carregar reservas"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleNewReservation = () => {
    setEditingReservation(null);
    setShowForm(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setShowForm(true);
  };

  const handleDeleteClick = (reservationId: string) => {
    setReservationToDelete(reservationId);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reservationToDelete) return;

    try {
      await reservationService.remove(reservationToDelete);
      setReservations(reservations.filter(r => r.id !== reservationToDelete));
      setShowConfirm(false);
      setReservationToDelete(null);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      alert(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao excluir reserva"
      );
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingReservation(null);
    fetchReservations();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingReservation(null);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      date: new Date().toISOString().split('T')[0],
      status: "",
      table_id: ""
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "no_show": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmada";
      case "cancelled": return "Cancelada";
      case "completed": return "Concluída";
      case "no_show": return "Não Compareceu";
      default: return status;
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [filters, fetchReservations]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
              <Calendar className="h-8 w-8" />
              <span>Gerenciar Reservas</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todas as reservas do restaurante
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center space-x-2"
              onClick={() => window.location.href = "/reservations/calendar"}
            >
              <CalendarDays className="h-4 w-4" />
              <span>Calendário</span>
            </Button>

            <Button
              size="lg"
              className="flex items-center space-x-2"
              onClick={handleNewReservation}
            >
              <Plus className="h-4 w-4" />
              <span>Nova Reserva</span>
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Data
                </label>
                <Input
                  type="date"
                  name="date"
                  value={filters.date || ""}
                  onChange={handleFilterChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status || ""}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                >
                  <option value="">Todos os status</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                  <option value="completed">Concluída</option>
                  <option value="no_show">Não Compareceu</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button type="button" onClick={clearFilters} variant="outline">
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchReservations}
                  className="ml-auto"
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reservations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Reserva #{reservation.id?.slice(-6)}
                      </CardTitle>
                      <CardDescription>
                        {new Date(reservation.datetime).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditReservation(reservation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => reservation.id && handleDeleteClick(reservation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={getStatusColor(reservation.status)}>
                      {getStatusText(reservation.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Horário</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(reservation.datetime).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pessoas</span>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{reservation.party_size}</span>
                    </div>
                  </div>

                  {reservation.note && (
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Observações</span>
                      <p className="text-sm bg-muted p-2 rounded text-muted-foreground">
                        {reservation.note}
                      </p>
                    </div>
                  )}

                  {reservation.created_at && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>Criada em</span>
                      <span>
                        {new Date(reservation.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {reservations.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma reserva encontrada
              </h3>
              <p className="text-muted-foreground mb-4">
                {filters.date || filters.status ?
                  "Nenhuma reserva corresponde aos filtros aplicados." :
                  "Comece criando sua primeira reserva."
                }
              </p>
              <Button onClick={handleNewReservation}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Reserva
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <ReservationForm
                initialData={editingReservation || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        <ConfirmModal
          open={showConfirm}
          title="Excluir Reserva"
          message="Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowConfirm(false);
            setReservationToDelete(null);
          }}
        />
      </div>
    </div>
  );
}