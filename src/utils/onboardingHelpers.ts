import type { OnboardingLevel, OnboardingProgress, DiagramNodeRoute } from '@/types/onboarding';

/**
 * Calcula o progresso do onboarding baseado nos níveis e etapas
 * Considera apenas etapas 'recommended' e 'completed' para o cálculo
 */
export function calculateProgress(levels: OnboardingLevel[]): OnboardingProgress {
  const allSteps = levels.flatMap(level => level.steps);

  // Etapas que devem ser consideradas para o progresso (recomendadas + completadas)
  const recommendedSteps = allSteps.filter(s =>
    s.status === 'recommended' || s.status === 'completed'
  );

  // Etapas que foram completadas
  const completedSteps = allSteps.filter(s => s.status === 'completed');

  const total = recommendedSteps.length;
  const completed = completedSteps.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    percentage
  };
}

/**
 * Converte IDs de dependências em nomes legíveis
 */
export function getDependencyNames(dependencyIds: string[]): string {
  const nameMap: Record<string, string> = {
    'org-project': 'Organização e Projeto',
    'users': 'Usuários',
    'tags': 'Tags',
    'menu': 'Menu/Cardápio',
    'categories': 'Categorias',
    'tables': 'Mesas',
    'customers': 'Clientes',
    'products': 'Produtos',
    'notifications': 'Notificações',
    'display': 'Exibição',
    'reservations': 'Reservas',
    'orders': 'Pedidos',
    'waitlist': 'Fila de Espera',
  };

  return dependencyIds
    .map(id => nameMap[id] || id)
    .join(', ');
}

/**
 * Verifica se uma etapa está bloqueada por dependências não completadas
 */
export function isStepBlocked(
  stepId: string,
  levels: OnboardingLevel[]
): boolean {
  const allSteps = levels.flatMap(level => level.steps);
  const step = allSteps.find(s => s.id === stepId);

  if (!step || !step.dependencies || step.dependencies.length === 0) {
    return false;
  }

  // Verifica se todas as dependências estão completadas
  const dependencies = step.dependencies.map(depId =>
    allSteps.find(s => s.id === depId)
  );

  return dependencies.some(dep => dep && dep.status !== 'completed');
}

/**
 * Retorna a próxima etapa recomendada que o usuário deve completar
 */
export function getNextRecommendedStep(levels: OnboardingLevel[]) {
  const allSteps = levels.flatMap(level => level.steps);

  // Encontra a primeira etapa recomendada que não está completada e não está bloqueada
  return allSteps.find(step =>
    step.status === 'recommended' &&
    !isStepBlocked(step.id, levels)
  );
}

/**
 * Obtém a rota a partir do nodeId do diagrama
 */
export function getRouteFromNodeId(
  nodeId: string,
  routes: DiagramNodeRoute[]
): string | null {
  const mapping = routes.find(r => r.nodeId === nodeId && r.clickable);
  return mapping ? mapping.route : null;
}
