import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import NumberTicker from "@/components/magicui/number-ticker";
import {
  Users,
  ShoppingCart,
  Calendar,
  Clock,
  TrendingUp,
  ArrowRight,
  Coffee,
  DollarSign,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { customerService } from "@/api/customerService";
import { orderService } from "@/api/ordersService";
import { reservationService } from "@/api/bookingService";
import { waitlistService } from "@/api/waitingLineService";

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeOrders: 0,
    todayReservations: 0,
    waitingCustomers: 0,
    todayRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");

      // Buscar dados de forma paralela
      const [customers, orders, reservations, waitlist] = await Promise.all([
        customerService.getAll().catch(() => ({ data: [] })),
        orderService.getAll().catch(() => ({ data: [] })),
        reservationService.getAll().catch(() => ({ data: [] })),
        waitlistService.getAll().catch(() => ({ data: [] }))
      ]);

      // Calcular estatísticas
      const today = new Date().toISOString().split('T')[0];

      setStats({
        totalCustomers: customers.data.length,
        activeOrders: orders.data.filter(o =>
          o.status === 'preparing' || o.status === 'ready'
        ).length,
        todayReservations: reservations.data.filter(r =>
          r.status === 'confirmed' && r.datetime?.startsWith(today)
        ).length,
        waitingCustomers: waitlist.data.filter(w =>
          w.status === 'waiting'
        ).length,
        todayRevenue: orders.data
          .filter(o => o.created_at?.startsWith(today))
          .reduce((sum, order) => sum + (order.total_amount || 0), 0)
      });
    } catch (err: unknown) {
      setError("Erro ao carregar estatísticas");
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <AnimatedGradientText className="mb-6">
            <span className="text-lg font-medium">🍽️ Sistema de Gestão LEP</span>
          </AnimatedGradientText>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Bem-vindo ao LEP System
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gerencie reservas, fila de espera e cardápio digital do seu restaurante de forma simples e eficiente
          </p>
        </div>

        {user ? (
          <>
            {/* User Welcome */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Coffee className="h-5 w-5" />
                    <span>Olá, {user.name}!</span>
                  </CardTitle>
                  <CardDescription>
                    Aqui está um resumo das atividades do restaurante hoje
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

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
                      onClick={fetchStats}
                      className="ml-auto"
                    >
                      Tentar Novamente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Carregando estatísticas...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        <NumberTicker value={stats.totalCustomers} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Clientes cadastrados
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pedidos Ativos</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        <NumberTicker value={stats.activeOrders} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Em preparo ou prontos
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Reservas Hoje</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        <NumberTicker value={stats.todayReservations} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Reservas confirmadas
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Fila de Espera</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        <NumberTicker value={stats.waitingCustomers} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Aguardando mesa
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Revenue Card */}
                <div className="mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5" />
                        <span>Faturamento do Dia</span>
                      </CardTitle>
                      <CardDescription>
                        Total de vendas registradas hoje
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        R$ <NumberTicker value={stats.todayRevenue} decimalPlaces={2} />
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">
                          +12% em relação a ontem
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                    <CardDescription>
                      Acesse rapidamente as funcionalidades principais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button asChild variant="outline" className="h-auto p-4">
                        <Link to="/users" className="flex flex-col items-center space-y-2">
                          <Users className="h-6 w-6" />
                          <span>Gerenciar Usuários</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button asChild variant="outline" className="h-auto p-4">
                        <Link to="/products" className="flex flex-col items-center space-y-2">
                          <Coffee className="h-6 w-6" />
                          <span>Gerenciar Produtos</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button asChild variant="outline" className="h-auto p-4">
                        <Link to="/menu" className="flex flex-col items-center space-y-2">
                          <ShoppingCart className="h-6 w-6" />
                          <span>Ver Cardápio</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        ) : (
          /* Public Home */
          <div className="text-center flex flex-col items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Área Administrativa</span>
                </CardTitle>
                <CardDescription>
                  Acesso para funcionários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">
                    Fazer Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4 mt-12">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Sistema LEP - Gestão Completa para Restaurantes
              </Badge>

              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">Reservas</Badge>
                <Badge variant="outline">Fila de Espera</Badge>
                <Badge variant="outline">Cardápio Digital</Badge>
                <Badge variant="outline">Gestão de Pedidos</Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}