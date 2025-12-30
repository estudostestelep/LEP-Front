import { useState } from 'react';
import { Network } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OnboardingStepCard } from '@/components/OnboardingStepCard';
import { MermaidDiagram } from '@/components/MermaidDiagram';
import { onboardingLevels } from '@/data/onboardingData';
import { calculateProgress } from '@/utils/onboardingHelpers';

export function OnboardingGuide() {
  const [expandedLevel, setExpandedLevel] = useState<string>("1");
  const [showDiagram, setShowDiagram] = useState(false);

  // Calcular progresso
  const { completed, total, percentage } = calculateProgress(onboardingLevels);

  return (
    <div className="space-y-6">
      {/* Header com Progresso */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Guia de Configuração Inicial</CardTitle>
              <CardDescription className="mt-1.5">
                Siga esta ordem para configurar seu restaurante sem problemas
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setShowDiagram(true)}>
              <Network className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Ver Diagrama de Dependências</span>
              <span className="sm:hidden">Diagrama</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso da Configuração</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {completed} de {total} etapas recomendadas concluídas
          </p>
        </CardContent>
      </Card>

      {/* Mensagem Motivacional */}
      {percentage === 100 ? (
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              🎉 Parabéns! Você completou todas as configurações recomendadas.
              Seu restaurante está pronto para operar!
            </p>
          </CardContent>
        </Card>
      ) : percentage > 0 ? (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              💡 Você está no caminho certo! Continue seguindo as etapas abaixo para
              configurar completamente seu sistema.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              👋 Bem-vindo! Siga as etapas abaixo na ordem recomendada para configurar
              seu restaurante do zero.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Accordion com Níveis */}
      <Accordion
        type="single"
        value={expandedLevel}
        onValueChange={setExpandedLevel}
        className="space-y-4"
      >
        {onboardingLevels.map((level) => (
          <AccordionItem
            key={level.level}
            value={String(level.level)}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <level.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">
                    Nível {level.level}: {level.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {level.description}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="grid gap-3 pb-2">
                {level.steps.map((step) => (
                  <OnboardingStepCard key={step.id} step={step} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Dialog com Diagrama */}
      <Dialog open={showDiagram} onOpenChange={setShowDiagram}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Diagrama de Dependências do Sistema</DialogTitle>
          </DialogHeader>
          <MermaidDiagram />
        </DialogContent>
      </Dialog>
    </div>
  );
}
