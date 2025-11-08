/**
 * Color Impact Map
 * Describes where each theme color is applied in the UI
 */
export const colorImpactMap: Record<string, string> = {
  // Cores Principais
  primary_color: "Botões primários, links ativos, destaques principais, ícones de ação e elementos críticos da interface",
  secondary_color: "Botões secundários, bordas, elementos de suporte e ações alternativas",
  background_color: "Fundo geral da aplicação, páginas e main containers",
  card_background_color: "Fundos de cards, modais, dropdowns, popovers e sub-containers",
  text_color: "Texto principal em toda a interface, headings e conteúdo prioritário",
  text_secondary_color: "Texto secundário, descriptions, labels desabilitados e hints",
  accent_color: "Destaques especiais, badges, elementos de ênfase e ícones decorativos",

  // Cores Semânticas
  destructive_color: "Botões de delete, avisos de erro, ações perigosas e estados críticos",
  success_color: "Mensagens de sucesso, checkmarks, confirmações e feedbacks positivos",
  warning_color: "Avisos, mensagens de atenção, notificações amarelas e estados de cautela",
  border_color: "Bordas padrão, divisores, separadores e linhas de demarcação",
  price_color: "Preço dos produtos no cardápio público e modal de detalhes",

  // Configurações do Sistema
  focus_ring_color: "Outline de foco para acessibilidade (keyboard navigation e focus visible)",
  input_background_color: "Fundo específico de campos de entrada, textareas e inputs de formulário",
};
