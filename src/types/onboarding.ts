import { LucideIcon } from 'lucide-react';

export type OnboardingStatus = 'completed' | 'pending' | 'recommended' | 'optional';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status: OnboardingStatus;
  dependencies?: string[]; // IDs de steps bloqueadores
  route?: string; // Rota para navegar
  action?: string; // Texto do botão CTA
  level: 1 | 2 | 3 | 4 | 5; // Nível de hierarquia
}

export interface OnboardingLevel {
  level: number;
  title: string;
  description: string;
  steps: OnboardingStep[];
  icon: LucideIcon;
}

export interface OnboardingProgress {
  total: number;
  completed: number;
  percentage: number;
}

// Mapeamento de IDs de nodes do diagrama para rotas
export interface DiagramNodeRoute {
  nodeId: string;       // ID no diagrama Mermaid
  route: string;        // Rota do React Router
  requiresParams?: boolean; // Se precisa de parâmetros dinâmicos
  clickable: boolean;   // Se deve ser clicável
}
