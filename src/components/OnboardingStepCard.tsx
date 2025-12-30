import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Info, Clock, Lock, ArrowRight } from 'lucide-react';
import type { OnboardingStep } from '@/types/onboarding';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDependencyNames } from '@/utils/onboardingHelpers';

interface OnboardingStepCardProps {
  step: OnboardingStep;
}

export function OnboardingStepCard({ step }: OnboardingStepCardProps) {
  const navigate = useNavigate();

  const statusConfig = {
    completed: {
      color: 'bg-green-500',
      icon: CheckCircle2,
      label: 'Concluído',
      badgeVariant: 'default' as const
    },
    recommended: {
      color: 'bg-blue-500',
      icon: AlertCircle,
      label: 'Recomendado',
      badgeVariant: 'default' as const
    },
    optional: {
      color: 'bg-gray-400',
      icon: Info,
      label: 'Opcional',
      badgeVariant: 'secondary' as const
    },
    pending: {
      color: 'bg-yellow-500',
      icon: Clock,
      label: 'Pendente',
      badgeVariant: 'secondary' as const
    },
  };

  const config = statusConfig[step.status];

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Ícone + Conteúdo */}
          <div className="flex items-start gap-3 flex-1">
            {/* Ícone com cor de fundo */}
            <div className={`p-2 rounded-lg ${config.color} bg-opacity-10 flex-shrink-0`}>
              <step.icon className={`h-5 w-5 ${config.color.replace('bg-', 'text-')}`} />
            </div>

            {/* Texto e informações */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-base">{step.title}</h4>
                <Badge variant={config.badgeVariant} className="text-xs">
                  {config.label}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mt-1">
                {step.description}
              </p>

              {/* Dependências (se houver) */}
              {step.dependencies && step.dependencies.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Requer: {getDependencyNames(step.dependencies)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botão CTA */}
          {step.route && step.action && (
            <Button
              variant={step.status === 'recommended' ? 'default' : 'outline'}
              size="sm"
              onClick={() => navigate(step.route!)}
              className="flex-shrink-0"
            >
              <span className="hidden sm:inline">{step.action}</span>
              <span className="sm:hidden">Ir</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
