import type { OnboardingLevel, OnboardingProgress, DiagramNodeRoute } from '@/types/onboarding';

export function calculateProgress(levels: OnboardingLevel[]): OnboardingProgress {
  const allSteps = levels.flatMap(level => level.steps);
  const recommendedSteps = allSteps.filter(s =>
    s.status === 'recommended' || s.status === 'completed'
  );
  const completedSteps = allSteps.filter(s => s.status === 'completed');

  return {
    total: recommendedSteps.length,
    completed: completedSteps.length,
    percentage: recommendedSteps.length > 0
      ? Math.round((completedSteps.length / recommendedSteps.length) * 100)
      : 0
  };
}

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
  };

  return dependencyIds.map(id => nameMap[id] || id).join(', ');
}

// Nova função: obter rota a partir do nodeId do diagrama
export function getRouteFromNodeId(
  nodeId: string,
  routes: DiagramNodeRoute[]
): string | null {
  const mapping = routes.find(r => r.nodeId === nodeId && r.clickable);
  return mapping ? mapping.route : null;
}
