import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin
} from "lucide-react";
import { publicService, AvailableTime } from "@/api/publicService";
import { ThemeToggle } from "@/components/theme-toggle";

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

interface ReservationData {
  date: string;
  time: string;
  party_size: number;
  note: string;
  source: "internal" | "public";
}

export default function PublicReservation() {
  const { orgId, projId } = useParams<{ orgId: string; projId: string }>();

  // States
  const [step, setStep] = useState<"datetime" | "details" | "success" | "error">("datetime");
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [projectInfo, setProjectInfo] = useState<{
    name: string;
    description?: string;
    image_url?: string;
    contact_info?: {
      phone?: string;
      email?: string;
      address?: string;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [reservationData, setReservationData] = useState<ReservationData>({
    date: new Date().toISOString().split('T')[0],
    time: "",
    party_size: 2,
    note: "",
    source: "public"
  });

  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: ""
  });

  // Load project info on mount
  useEffect(() => {
    const fetchProjectInfo = async () => {
      if (!orgId || !projId) return;

      try {
        setLoading(true);
        const response = await publicService.getProjectInfo(orgId, projId);
        setProjectInfo(response.data);
        setError(null);
      } catch (err: unknown) {
        console.error("Erro ao carregar informações do projeto:", err);

        // Safely extract a message from unknown error
        let errorMessage = "Unknown error";
        if (typeof err === "string") {
          errorMessage = err;
        } else if (err && typeof err === "object") {
          const maybeErr = err as { response?: { data?: { message?: string } }; message?: string };
          errorMessage = maybeErr.response?.data?.message ?? maybeErr.message ?? "Unknown error";
        }

        // Handle specific error cases
        if (errorMessage.includes("conn busy")) {
          setError("Sistema temporariamente sobrecarregado. Tentando novamente...");
          // Retry after a delay
          setTimeout(() => {
            fetchProjectInfo();
          }, 3000);
        } else {
          setError("Erro ao carregar informações do restaurante");
          setProjectInfo({ name: "Restaurante" });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectInfo();
  }, [orgId, projId]);

  // Load available times when date or party_size changes
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!orgId || !projId || !reservationData.date) return;

      try {
        setLoading(true);
        const response = await publicService.getAvailableTimes({
          orgId,
          projId,
          date: reservationData.date,
          party_size: reservationData.party_size
        });
        setAvailableTimes(response.data);
      } catch (err) {
        console.error("Erro ao carregar horários:", err);
        setAvailableTimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [orgId, projId, reservationData.date, reservationData.party_size]);

  const handleDateTimeNext = () => {
    if (!reservationData.date || !reservationData.time) {
      setError("Por favor, selecione data e horário.");
      return;
    }
    setError(null);
    setStep("details");
  };

  const handleSubmitReservation = async () => {
    if (!orgId || !projId) return;

    // Validação
    if (!customerData.name || !customerData.phone) {
      setError("Nome e telefone são obrigatórios.");
      return;
    }

    if (!reservationData.date || !reservationData.time) {
      setError("Data e horário são obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const datetime = `${reservationData.date}T${reservationData.time}:00Z`;

      await publicService.createPublicReservation({
        orgId,
        projId,
        customer: customerData,
        reservation: {
          datetime,
          party_size: reservationData.party_size,
          note: reservationData.note,
          source: reservationData.source
        }
      });

      setStep("success");
    } catch (err) {
      console.error("Erro ao criar reserva:", err);
      setError("Erro ao criar reserva. Tente novamente.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep("datetime");
    setError(null);
    setReservationData({
      date: new Date().toISOString().split('T')[0],
      time: "",
      party_size: 2,
      note: "",
      source: "public"
    });
    setCustomerData({
      name: "",
      email: "",
      phone: ""
    });
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Reserva Confirmada!</h2>
              <p className="text-muted-foreground mb-6">
                Sua reserva foi criada com sucesso. Você receberá uma confirmação em breve.
              </p>

              <div className="space-y-2 text-sm bg-muted p-4 rounded-lg mb-6">
                <div><strong>Data:</strong> {new Date(reservationData.date).toLocaleDateString('pt-BR')}</div>
                <div><strong>Horário:</strong> {reservationData.time}</div>
                <div><strong>Pessoas:</strong> {reservationData.party_size}</div>
                <div><strong>Nome:</strong> {customerData.name}</div>
              </div>

              <Button onClick={resetForm} className="w-full">
                Fazer Nova Reserva
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center">
            <CardContent className="p-8">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Erro na Reserva</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="space-x-2">
                <Button onClick={() => setStep("details")} variant="outline">
                  Voltar
                </Button>
                <Button onClick={resetForm}>
                  Recomeçar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4 relative">
            <Calendar className="h-8 w-8 text-foreground" />
            <h1 className="text-4xl font-bold">Faça sua Reserva</h1>
            <div className="absolute right-0 top-0">
              <ThemeToggle />
            </div>
          </div>

          {projectInfo && (
            <div>
              <h2 className="text-xl text-muted-foreground">{projectInfo.name}</h2>
              {projectInfo.contact_info && (
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mt-2">
                  {projectInfo.contact_info.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{projectInfo.contact_info.phone}</span>
                    </div>
                  )}
                  {projectInfo.contact_info.address && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{projectInfo.contact_info.address}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className={`flex items-center space-x-2 ${step === "datetime" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === "datetime" ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>
              1
            </div>
            <span>Data e Horário</span>
          </div>

          <div className="w-12 h-px bg-muted-foreground/30" />

          <div className={`flex items-center space-x-2 ${step === "details" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === "details" ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>
              2
            </div>
            <span>Seus Dados</span>
          </div>
        </div>

        {/* Step 1: Date & Time */}
        {step === "datetime" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-foreground" />
                  <span>Selecione Data e Horário</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Data
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={reservationData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setReservationData(prev => ({ ...prev, date: e.target.value, time: "" }))}
                      className="[&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </div>
                </div>

                {/* Party Size */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <Users className="h-4 w-4 inline mr-1 text-foreground" />
                    Número de pessoas
                  </label>
                  <select
                    value={reservationData.party_size}
                    onChange={(e) => setReservationData(prev => ({ ...prev, party_size: Number(e.target.value), time: "" }))}
                    className="w-full px-3 py-2 border border-input bg-card text-card-foreground text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? "pessoa" : "pessoas"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Available Times */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <Clock className="h-4 w-4 inline mr-1 text-foreground" />
                    Horários disponíveis
                  </label>

                  {loading ? (
                    <div className="text-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Carregando horários...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableTimes.map((timeSlot) => (
                        <Button
                          key={timeSlot.time}
                          variant={reservationData.time === timeSlot.time ? "default" : "outline"}
                          disabled={!timeSlot.available}
                          onClick={() => setReservationData(prev => ({ ...prev, time: timeSlot.time }))}
                          className="text-sm"
                        >
                          {timeSlot.time}
                        </Button>
                      ))}
                    </div>
                  )}

                  {!loading && availableTimes.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhum horário disponível para esta data.
                    </p>
                  )}
                </div>

                {/* Source Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Tipo de reserva
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      variant={reservationData.source === "public" ? "default" : "outline"}
                      onClick={() => setReservationData(prev => ({ ...prev, source: "public" }))}
                    >
                      Externa
                    </Button>
                    <Button
                      variant={reservationData.source === "internal" ? "default" : "outline"}
                      onClick={() => setReservationData(prev => ({ ...prev, source: "internal" }))}
                    >
                      Interna
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  onClick={handleDateTimeNext}
                  disabled={!reservationData.date || !reservationData.time}
                  className="w-full"
                  size="lg"
                >
                  Continuar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Customer Details */}
        {step === "details" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-foreground" />
                  <span>Seus Dados</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Reservation Summary */}
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Resumo da Reserva</h4>
                  <div className="text-sm space-y-1">
                    <div><strong>Data:</strong> {new Date(reservationData.date).toLocaleDateString('pt-BR')}</div>
                    <div><strong>Horário:</strong> {reservationData.time}</div>
                    <div><strong>Pessoas:</strong> {reservationData.party_size}</div>
                    <div><strong>Tipo:</strong> {reservationData.source === "public" ? "Externa" : "Interna"}</div>
                  </div>
                </div>

                {/* Customer Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      <User className="h-4 w-4 inline mr-1 text-foreground" />
                      Nome completo *
                    </label>
                    <Input
                      value={customerData.name}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      <Phone className="h-4 w-4 inline mr-1 text-foreground" />
                      Telefone *
                    </label>
                    <Input
                      value={customerData.phone}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      <Mail className="h-4 w-4 inline mr-1 text-foreground" />
                      E-mail
                    </label>
                    <Input
                      type="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Observações
                    </label>
                    <textarea
                      value={reservationData.note}
                      onChange={(e) => setReservationData(prev => ({ ...prev, note: e.target.value }))}
                      placeholder="Alguma observação especial? (opcional)"
                      className="w-full px-3 py-2 border border-input bg-card text-card-foreground text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                      rows={3}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep("datetime")}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleSubmitReservation}
                    disabled={loading || !customerData.name || !customerData.phone}
                    className="flex-1"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Criando...
                      </>
                    ) : (
                      "Confirmar Reserva"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}