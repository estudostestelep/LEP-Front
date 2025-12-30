import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export function MermaidDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Configurar o Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });

    // Renderizar o diagrama
    if (containerRef.current) {
      mermaid.contentLoaded();
    }
  }, []);

  const diagram = `
    graph TD
      A[Organization & Project ✓] -->|Configurado| B[Usuários]
      A --> C[Mesas]
      A --> D[Clientes]
      A --> E[Menu/Cardápio]

      E --> F[Categorias]
      F --> G[Produtos]

      D --> H[Reservas]
      C --> H

      G --> I[Pedidos]
      C --> I
      D --> I

      D --> J[Fila de Espera]

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
  `;

  return (
    <div className="space-y-4">
      {/* Diagrama */}
      <div ref={containerRef} className="p-4 bg-muted rounded-lg overflow-x-auto">
        <div className="mermaid min-w-max">
          {diagram}
        </div>
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
      <div className="text-center text-sm text-muted-foreground px-4">
        <p>
          Este diagrama mostra as dependências entre as principais entidades do sistema.
          As setas indicam "depende de" - por exemplo, Produtos dependem de Categorias.
        </p>
      </div>
    </div>
  );
}
