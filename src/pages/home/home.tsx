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
  DollarSign
} from "lucide-react";
import { mockReservations, mockOrders, mockWaitlist, mockCustomers } from "@/lib/mock-data";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();

  const stats = {
    totalCustomers: mockCustomers.length,
    activeOrders: mockOrders.filter(o => o.status === 'preparing' || o.status === 'ready').length,
    todayReservations: mockReservations.filter(r => r.status === 'confirmed').length,
    waitingCustomers: mockWaitlist.filter(w => w.status === 'waiting').length,
    todayRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0)
  };

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
        ) : (
          /* Public Home */
          <div className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Coffee className="h-5 w-5" />
                    <span>Cardápio Digital</span>
                  </CardTitle>
                  <CardDescription>
                    Explore nosso delicioso cardápio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link to="/menu">
                      Ver Cardápio
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
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
            </div>

            <div className="space-y-4">
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