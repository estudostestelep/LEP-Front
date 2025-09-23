import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, TrendingUp, AlertTriangle } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface ProtectedFeatureProps {
  children: ReactNode;
  feature: 'notifications' | 'reports' | 'api' | 'branding';
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

interface ProtectedActionProps {
  children: ReactNode;
  action: 'createTable' | 'createUser' | 'createProduct' | 'createReservation';
  fallback?: ReactNode;
  showLimitWarning?: boolean;
  onUpgrade?: () => void;
}

export function ProtectedFeature({
  children,
  feature,
  fallback,
  showUpgrade = true
}: ProtectedFeatureProps) {
  const permissions = usePermissions();

  if (permissions.loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
    );
  }

  const featureChecks = {
    notifications: permissions.canUseNotifications,
    reports: permissions.canAccessReports,
    api: permissions.canUseAPI,
    branding: permissions.canUseCustomBranding
  };

  const check = featureChecks[feature]();

  if (check.allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  const featureNames = {
    notifications: 'Notificações',
    reports: 'Relatórios',
    api: 'Acesso à API',
    branding: 'Marca Personalizada'
  };

  const featureDescriptions = {
    notifications: 'Envie SMS, WhatsApp e emails automáticos para seus clientes',
    reports: 'Acesse relatórios detalhados e análises do seu negócio',
    api: 'Integre com sistemas externos através da nossa API',
    branding: 'Personalize a aparência com sua marca'
  };

  return (
    <Card className="border-dashed border-2 border-muted">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Crown className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" />
          {featureNames[feature]}
          <Badge variant="secondary">Premium</Badge>
        </CardTitle>
        <CardDescription>
          {featureDescriptions[feature]}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {check.reason}
        </p>
        <Button className="w-full">
          <TrendingUp className="w-4 h-4 mr-2" />
          Fazer Upgrade do Plano
        </Button>
      </CardContent>
    </Card>
  );
}

export function ProtectedAction({
  children,
  action,
  fallback,
  showLimitWarning = true,
  onUpgrade
}: ProtectedActionProps) {
  const permissions = usePermissions();

  if (permissions.loading) {
    return <>{children}</>;
  }

  const actionChecks = {
    createTable: permissions.canCreateTable,
    createUser: permissions.canCreateUser,
    createProduct: permissions.canCreateProduct,
    createReservation: permissions.canCreateReservation
  };

  const check = actionChecks[action]();

  if (check.allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showLimitWarning) {
    return null;
  }

  const actionNames = {
    createTable: 'criar mesa',
    createUser: 'criar usuário',
    createProduct: 'criar produto',
    createReservation: 'criar reserva'
  };

  return (
    <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-orange-800">
            Limite atingido
          </h4>
          <p className="text-sm text-orange-700 mt-1">
            Não é possível {actionNames[action]}: {check.reason}
          </p>
          {check.current !== undefined && check.limit !== undefined && (
            <p className="text-xs text-orange-600 mt-2">
              Uso atual: {check.current} de {check.limit}
            </p>
          )}
          {onUpgrade && (
            <Button
              size="sm"
              variant="outline"
              className="mt-3 border-orange-300 text-orange-700 hover:bg-orange-100"
              onClick={onUpgrade}
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Fazer Upgrade
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export { ProtectedFeature as default };