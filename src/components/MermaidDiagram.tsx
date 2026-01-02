import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mermaid from 'mermaid';
import { diagramNodeRoutes } from '@/data/onboardingData';
import { getRouteFromNodeId } from '@/utils/onboardingHelpers';

export function MermaidDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Configurar Mermaid com securityLevel loose para permitir callbacks
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose', // CRÍTICO: permite callbacks
      fontFamily: 'inherit',
    });

    // Definir callback global para navegação
    (window as any).navigateToEntity = (nodeId: string) => {
      const route = getRouteFromNodeId(nodeId, diagramNodeRoutes);
      if (route) {
        navigate(route);
      } else {
        console.warn(`No route defined for node: ${nodeId}`);
      }
    };

    // Renderizar diagrama
    if (containerRef.current) {
      mermaid.contentLoaded();
    }

    // Cleanup: remover callback global ao desmontar
    return () => {
      delete (window as any).navigateToEntity;
    };
  }, [navigate]);

  const diagram = `
    graph TD
      A[Organization & Project ✓]
      B[Usuários]
      C[Mesas]
      D[Clientes]
      E[Menu/Cardápio]
      F[Categorias]
      G[Produtos]
      H[Reservas]
      I[Pedidos]
      J[Fila de Espera]

      A -->|Configurado| B
      A --> C
      A --> D
      A --> E

      E --> F
      F --> G

      D --> H
      C --> H

      G --> I
      C --> I
      D --> I

      D --> J

      %% Adicionar click handlers (apenas para nodes clicáveis)
      click B callback "navigateToEntity('B')"
      click C callback "navigateToEntity('C')"
      click D callback "navigateToEntity('D')"
      click E callback "navigateToEntity('E')"
      click F callback "navigateToEntity('F')"
      click G callback "navigateToEntity('G')"
      click H callback "navigateToEntity('H')"
      click I callback "navigateToEntity('I')"

      %% Estilos (mantém cores originais)
      style A fill:#10b981,stroke:#059669,color:#fff,stroke-width:2px
      style B fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width:2px
      style C fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width:2px
      style D fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width:2px
      style E fill:#3b82f6,stroke:#2563eb,color:#fff,stroke-width:2px
      style F fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width:2px
      style G fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width:2px
      style H fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width:2px
      style I fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width:2px
      style J fill:#8b5cf6,stroke:#7c3aed,color:#fff,stroke-width:2px

      %% Hover effect via CSS (aplicado após renderização)
      classDef clickable cursor:pointer
      class B,C,D,E,F,G,H,I clickable
  `;

  return (
    <div className="space-y-4">
      {/* Diagrama */}
      <div ref={containerRef} className="p-4 bg-muted rounded-lg overflow-x-auto">
        <div className="mermaid min-w-max hover:brightness-110 transition-all">
          {diagram}
        </div>
        <style>{`
          /* Hover effect para nodes clicáveis */
          .clickable rect,
          .clickable circle,
          .clickable polygon {
            cursor: pointer !important;
            transition: filter 0.2s ease, transform 0.1s ease;
          }
          .clickable:hover rect,
          .clickable:hover circle,
          .clickable:hover polygon {
            filter: brightness(1.2);
            transform: scale(1.02);
          }
        `}</style>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 text-sm justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-muted-foreground">Concluído</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <span className="text-muted-foreground">Estrutura Base</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500"></div>
          <span className="text-muted-foreground">Cardápio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-500"></div>
          <span className="text-muted-foreground">Operações</span>
        </div>
      </div>

      {/* Descrição */}
      <div className="text-center text-sm text-muted-foreground px-4 space-y-2">
        <p>
          Este diagrama mostra as dependências entre as principais entidades do sistema.
          As setas indicam "depende de" - por exemplo, Produtos dependem de Categorias.
        </p>
        <p className="font-semibold text-primary">
          💡 Clique em qualquer entidade para navegar para a página de gerenciamento!
        </p>
      </div>
    </div>
  );
}
