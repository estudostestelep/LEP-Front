import { useState, useEffect, useMemo } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reservationService, Reservation } from "@/api/bookingService";
import { Loader2, Calendar as CalendarIcon, Plus, Eye, Users, Clock } from "lucide-react";
import ReservationForm from "./form";
import { Modal } from "@/components/ui/modal";

// Configurar localizer do moment
moment.locale('pt-BR');
const localizer = momentLocalizer(moment);

interface CalendarEvent extends Event {
  id: string;
  reservation: Reservation;
}

export default function ReservationCalendar() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");

      // Buscar reservas do mês atual
      const startOfMonth = moment(currentDate).startOf('month').format('YYYY-MM-DD');

      const response = await reservationService.getAll({
        date: startOfMonth // Podemos usar filtro por intervalo no backend
      });
      setReservations(response.data);
    } catch (err) {
      setError("Erro ao carregar reservas");
      console.error("Erro ao buscar reservas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [currentDate, fetchReservations]);

  // Converter reservations para eventos do calendário
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return reservations.map((reservation) => {
      const datetime = moment(reservation.datetime);

      // Definir cor baseada no status
      let backgroundColor = '#10b981'; // verde para confirmada
      let borderColor = '#059669';

      switch (reservation.status) {
        case 'cancelled':
          backgroundColor = '#ef4444'; // vermelho
          borderColor = '#dc2626';
          break;
        case 'completed':
          backgroundColor = '#3b82f6'; // azul
          borderColor = '#2563eb';
          break;
        case 'no_show':
          backgroundColor = '#f59e0b'; // amarelo
          borderColor = '#d97706';
          break;
      }

      return {
        id: reservation.id || '',
        title: `${reservation.party_size} pessoas`,
        start: datetime.toDate(),
        end: datetime.clone().add(1, 'hour').toDate(), // Assumir 1 hora de duração
        resource: {
          backgroundColor,
          borderColor,
          textColor: '#ffffff'
        },
        reservation
      };
    });
  }, [reservations]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedReservation(event.reservation);
    setShowDetails(true);
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    // Criar nova reserva com data/hora selecionada
    const newReservation: Partial<Reservation> = {
      datetime: moment(start).format('YYYY-MM-DDTHH:mm'),
      party_size: 2,
      status: 'confirmed'
    };
    setSelectedReservation(newReservation as Reservation);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedReservation(null);
    fetchReservations();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedReservation(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "no_show": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Personalizar o evento no calendário
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className="text-xs p-1">
      <div className="font-medium">{event.title}</div>
      <div className="opacity-75">
        {moment(event.start).format('HH:mm')}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando calendário...</p>
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
              <CalendarIcon className="h-8 w-8" />
              <span>Calendário de Reservas</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Visualize e gerencie suas reservas em calendário
            </p>
          </div>

          <Button
            size="lg"
            className="flex items-center space-x-2"
            onClick={() => {
              setSelectedReservation({
                datetime: moment().format('YYYY-MM-DDTHH:mm'),
                party_size: 2,
                status: 'confirmed'
              } as Reservation);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Nova Reserva</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Confirmadas", count: reservations.filter(r => r.status === 'confirmed').length, color: "text-green-600" },
            { label: "Canceladas", count: reservations.filter(r => r.status === 'cancelled').length, color: "text-red-600" },
            { label: "Concluídas", count: reservations.filter(r => r.status === 'completed').length, color: "text-blue-600" },
            { label: "Não compareceram", count: reservations.filter(r => r.status === 'no_show').length, color: "text-yellow-600" }
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-destructive">
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

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                views={['month', 'week', 'day']}
                view={currentView}
                onView={(view) => {
                  if (view === 'month' || view === 'week' || view === 'day') {
                    setCurrentView(view);
                  }
                }}
                date={currentDate}
                onNavigate={setCurrentDate}
                components={{
                  event: EventComponent
                }}
                eventPropGetter={(event: CalendarEvent) => ({
                  style: {
                    backgroundColor: event.resource?.backgroundColor || '#10b981',
                    borderColor: event.resource?.borderColor || '#059669',
                    color: event.resource?.textColor || '#ffffff',
                    border: 'none',
                    borderRadius: '4px'
                  }
                })}
                messages={{
                  next: "Próximo",
                  previous: "Anterior",
                  today: "Hoje",
                  month: "Mês",
                  week: "Semana",
                  day: "Dia",
                  agenda: "Agenda",
                  date: "Data",
                  time: "Hora",
                  event: "Evento",
                  noEventsInRange: "Não há reservas neste período.",
                  showMore: (total) => `+ Ver mais (${total})`
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Reservation Details Modal */}
        <Modal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          title="Detalhes da Reserva"
          size="md"
        >
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data</label>
                  <div className="text-lg">{moment(selectedReservation.datetime).format('DD/MM/YYYY')}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Horário</label>
                  <div className="text-lg flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {moment(selectedReservation.datetime).format('HH:mm')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div>
                    <Badge className={getStatusColor(selectedReservation.status)}>
                      {getStatusText(selectedReservation.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pessoas</label>
                  <div className="text-lg flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {selectedReservation.party_size}
                  </div>
                </div>
              </div>

              {selectedReservation.note && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Observações</label>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    {selectedReservation.note}
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetails(false);
                    setShowForm(true);
                  }}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  onClick={() => setShowDetails(false)}
                  className="flex-1"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Reservation Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <ReservationForm
                initialData={selectedReservation || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}