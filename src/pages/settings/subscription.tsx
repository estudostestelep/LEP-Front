import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Crown,
  Check,
  X,
  Calendar,
  Users,
  Table,
  Package,
  FileText,
  Bell,
  Zap,
  Palette,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { subscriptionService, SubscriptionPlan, Subscription } from '@/api/subscriptionService';
import { usePermissions } from '@/hooks/usePermissions';

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const permissions = usePermissions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [plansResponse, subscriptionResponse] = await Promise.all([
          subscriptionService.getPlans(),
          subscriptionService.getCurrentSubscription()
        ]);

        setPlans(plansResponse.data);
        setCurrentSubscription(subscriptionResponse.data);
        setBillingCycle(subscriptionResponse.data.billing_cycle);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpgrade = async (planId: string) => {
    try {
      const response = await subscriptionService.createCheckoutSession(planId, billingCycle);
      window.open(response.data.checkout_url, '_blank');
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      alert('Erro ao processar upgrade. Tente novamente.');
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura?')) return;

    try {
      await subscriptionService.cancelSubscription();
      // Recarregar dados
      window.location.reload();
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      alert('Erro ao cancelar assinatura. Tente novamente.');
    }
  };

  const getUsageComponent = (type: 'tables' | 'users' | 'products' | 'reservations', icon: React.ReactNode, label: string) => {
    if (!permissions.usage || !permissions.limits) return null;

    const percentage = permissions.getUsagePercentage(type);
    const isNearLimit = permissions.isNearLimit(type);
    const current = {
      tables: permissions.usage.tables_count,
      users: permissions.usage.users_count,
      products: permissions.usage.products_count,
      reservations: permissions.usage.reservations_today
    }[type];

    const limit = {
      tables: permissions.limits.max_tables,
      users: permissions.limits.max_users,
      products: permissions.limits.max_products,
      reservations: permissions.limits.max_reservations_per_day
    }[type];

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {current} / {limit}
          </span>
        </div>
        <Progress
          value={percentage}
          className={`h-2 ${isNearLimit ? 'text-orange-500' : 'text-primary'}`}
        />
        {isNearLimit && (
          <div className="flex items-center space-x-1 text-orange-600">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-xs">Próximo ao limite</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Assinatura</h1>
        <p className="text-muted-foreground">Gerencie seu plano e configurações de cobrança</p>
      </div>

      {/* Current Usage */}
      {currentSubscription && permissions.usage && permissions.limits && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Uso Atual</span>
              <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
                {currentSubscription.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              Seu uso atual dos recursos do plano
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {getUsageComponent('tables', <Table className="w-4 h-4" />, 'Mesas')}
            {getUsageComponent('users', <Users className="w-4 h-4" />, 'Usuários')}
            {getUsageComponent('products', <Package className="w-4 h-4" />, 'Produtos')}
            {getUsageComponent('reservations', <Calendar className="w-4 h-4" />, 'Reservas hoje')}
          </CardContent>
        </Card>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billingCycle === 'monthly'
                ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                : 'text-foreground hover:bg-muted/50'
              }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billingCycle === 'yearly'
                ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                : 'text-foreground hover:bg-muted/50'
              }`}
          >
            Anual <Badge variant="secondary" className="ml-1">-20%</Badge>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.plan_id === plan.id;
          const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
          const savings = billingCycle === 'yearly' ? ((plan.price_monthly * 12 - plan.price_yearly) / (plan.price_monthly * 12)) * 100 : 0;

          return (
            <Card key={plan.id} className={`relative ${isCurrentPlan ? 'border-primary shadow-lg' : ''}`}>
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Plano Atual</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    R$ {price.toFixed(2)}
                    <span className="text-lg font-normal text-muted-foreground">
                      /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && savings > 0 && (
                    <div className="text-sm text-green-600">
                      Economize {savings.toFixed(0)}%
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Limits */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <Table className="w-4 h-4" />
                      <span>Mesas</span>
                    </span>
                    <span className="font-medium">{plan.limits.max_tables}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Usuários</span>
                    </span>
                    <span className="font-medium">{plan.limits.max_users}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <Package className="w-4 h-4" />
                      <span>Produtos</span>
                    </span>
                    <span className="font-medium">{plan.limits.max_products}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Reservas/dia</span>
                    </span>
                    <span className="font-medium">{plan.limits.max_reservations_per_day}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {plan.limits.notifications_enabled ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <Bell className="w-4 h-4" />
                    <span className="text-sm">Notificações</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {plan.limits.reports_enabled ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Relatórios</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {plan.limits.api_access ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Acesso à API</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {plan.limits.custom_branding ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <Palette className="w-4 h-4" />
                    <span className="text-sm">Marca personalizada</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  {isCurrentPlan ? (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full" disabled>
                        Plano Atual
                      </Button>
                      {currentSubscription?.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-destructive hover:text-destructive"
                          onClick={handleCancelSubscription}
                        >
                          Cancelar Assinatura
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {currentSubscription ? 'Mudar Plano' : 'Assinar'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Subscription Details */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Assinatura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="capitalize">{currentSubscription.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ciclo de Cobrança</label>
                <p className="capitalize">{currentSubscription.billing_cycle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Período Atual</label>
                <p>
                  {new Date(currentSubscription.current_period_start).toLocaleDateString('pt-BR')} -{' '}
                  {new Date(currentSubscription.current_period_end).toLocaleDateString('pt-BR')}
                </p>
              </div>
              {currentSubscription.cancelled_at && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cancelada em</label>
                  <p>{new Date(currentSubscription.cancelled_at).toLocaleDateString('pt-BR')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}