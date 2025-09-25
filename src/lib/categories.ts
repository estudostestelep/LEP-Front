// Mapeamento de categorias para nomes em português
export const categoryMap: Record<string, string> = {
  // Categorias básicas
  "appetizer": "Entradas",
  "main_course": "Pratos Principais",
  "dessert": "Sobremesas",
  "beverage": "Bebidas",
  "side_dish": "Acompanhamentos",

  // Categorias específicas
  "pizza": "Pizzas",
  "wine": "Carta de Vinhos",
  "beer": "Cervejas",
  "cocktail": "Coquetéis",
  "coffee": "Cafés",

  // Categorias adicionais
  "pasta": "Massas",
  "salad": "Saladas",
  "sandwich": "Sanduíches",
  "soup": "Sopas",
  "seafood": "Frutos do Mar",
  "meat": "Carnes",
  "vegetarian": "Vegetarianos",
  "vegan": "Veganos"
};

// Função para obter nome da categoria em português
export const getCategoryDisplayName = (category: string): string => {
  return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
};

// Função para obter filtros de categoria organizados
export const getOrganizedCategories = (productCategories: string[]) => {
  // Categorias prioritárias que sempre aparecem primeiro
  const priorityCategories = ["pizza", "wine", "beverage", "main_course"];

  // Filtrar categorias que existem nos produtos
  const availableCategories = productCategories.filter(cat => cat);

  // Ordenar: prioritárias primeiro, depois alfabética
  const orderedCategories = [
    ...priorityCategories.filter(cat => availableCategories.includes(cat)),
    ...availableCategories
      .filter(cat => !priorityCategories.includes(cat))
      .sort((a, b) => getCategoryDisplayName(a).localeCompare(getCategoryDisplayName(b)))
  ];

  // Remover duplicatas
  return Array.from(new Set(orderedCategories));
};

// Filtros fixos para facilitar a navegação
export const fixedCategoryFilters = [
  { key: "pizza", label: "Pizzas", description: "Todas as pizzas do cardápio" },
  { key: "wine", label: "Carta de Vinhos", description: "Vinhos selecionados" },
  { key: "beverage", label: "Bebidas", description: "Todas as bebidas" },
  { key: "main_course", label: "Pratos Principais", description: "Pratos principais" }
];