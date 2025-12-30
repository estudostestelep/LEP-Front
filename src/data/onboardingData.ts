import {
  Building,
  Users,
  Tag,
  LayoutGrid,
  BookOpen,
  FolderOpen,
  Utensils,
  Settings,
  Bell,
  Eye,
  Sparkles,
  Calendar,
  ShoppingBag,
  UsersRound,
} from 'lucide-react';
import type { OnboardingLevel } from '@/types/onboarding';

export const onboardingLevels: OnboardingLevel[] = [
  {
    level: 1,
    title: "Fundações",
    description: "Estrutura básica já configurada",
    icon: Building,
    steps: [
      {
        id: 'org-project',
        title: 'Organização e Projeto',
        description: 'Estrutura base criada automaticamente no cadastro inicial',
        icon: Building,
        status: 'completed',
        level: 1
      },
      {
        id: 'users',
        title: 'Usuários e Funcionários',
        description: 'Adicione membros da equipe (garçons, gerentes, cozinheiros)',
        icon: Users,
        status: 'recommended',
        route: '/users',
        action: 'Gerenciar Usuários',
        level: 1
      },
      {
        id: 'tags',
        title: 'Tags e Etiquetas',
        description: 'Crie tags reutilizáveis (ex: Vegano, Sem Glúten, Picante, Sem Lactose)',
        icon: Tag,
        status: 'optional',
        route: '/tags',
        action: 'Criar Tags',
        level: 1
      }
    ]
  },
  {
    level: 2,
    title: "Estrutura Física",
    description: "Configure mesas e cadastre clientes",
    icon: LayoutGrid,
    steps: [
      {
        id: 'tables',
        title: 'Mesas do Restaurante',
        description: 'Cadastre todas as mesas disponíveis com capacidade e localização',
        icon: LayoutGrid,
        status: 'recommended',
        route: '/tables',
        action: 'Cadastrar Mesas',
        dependencies: ['org-project'],
        level: 2
      },
      {
        id: 'customers',
        title: 'Clientes',
        description: 'Adicione clientes conhecidos ou aguarde cadastro automático nas reservas',
        icon: Users,
        status: 'optional',
        route: '/customers',
        action: 'Cadastrar Clientes',
        level: 2
      }
    ]
  },
  {
    level: 3,
    title: "Cardápio Digital",
    description: "Configure menus, categorias e produtos",
    icon: Utensils,
    steps: [
      {
        id: 'menu',
        title: 'Menu/Cardápio',
        description: 'Crie cardápios com horários específicos (ex: Almoço, Jantar, Happy Hour, Carta de Vinhos)',
        icon: BookOpen,
        status: 'recommended',
        route: '/menu',
        action: 'Criar Menu',
        dependencies: ['org-project'],
        level: 3
      },
      {
        id: 'categories',
        title: 'Categorias',
        description: 'Adicione categorias ao menu (ex: Entradas, Pratos Principais, Sobremesas, Bebidas)',
        icon: FolderOpen,
        status: 'recommended',
        route: '/categories',
        action: 'Criar Categorias',
        dependencies: ['menu'],
        level: 3
      },
      {
        id: 'products',
        title: 'Produtos',
        description: 'Cadastre pratos, bebidas e vinhos com preços, descrições e imagens',
        icon: Utensils,
        status: 'recommended',
        route: '/products',
        action: 'Cadastrar Produtos',
        dependencies: ['categories'],
        level: 3
      }
    ]
  },
  {
    level: 4,
    title: "Configurações Avançadas",
    description: "Notificações e personalizações",
    icon: Settings,
    steps: [
      {
        id: 'notifications',
        title: 'Notificações Automáticas',
        description: 'Configure envio automático de SMS, WhatsApp e Email para confirmações e lembretes',
        icon: Bell,
        status: 'optional',
        route: '/settings',
        action: 'Configurar',
        level: 4
      },
      {
        id: 'display',
        title: 'Exibição de Produtos',
        description: 'Personalize quais informações aparecem no cardápio público (tempo de preparo, avaliações, etc.)',
        icon: Eye,
        status: 'optional',
        route: '/settings',
        action: 'Personalizar',
        level: 4
      }
    ]
  },
  {
    level: 5,
    title: "Pronto para Operar!",
    description: "Sistema configurado, comece a usar",
    icon: Sparkles,
    steps: [
      {
        id: 'reservations',
        title: 'Aceitar Reservas',
        description: 'Gerencie reservas de mesas com confirmações automáticas',
        icon: Calendar,
        status: 'pending',
        route: '/reservation',
        action: 'Ver Reservas',
        dependencies: ['tables', 'customers'],
        level: 5
      },
      {
        id: 'orders',
        title: 'Gerenciar Pedidos',
        description: 'Controle pedidos da cozinha com status e tempo de preparo',
        icon: ShoppingBag,
        status: 'pending',
        route: '/orders',
        action: 'Ver Pedidos',
        dependencies: ['products'],
        level: 5
      },
      {
        id: 'waitlist',
        title: 'Fila de Espera',
        description: 'Organize clientes aguardando mesa disponível',
        icon: UsersRound,
        status: 'pending',
        route: '/waitlist',
        action: 'Ver Fila',
        dependencies: ['customers'],
        level: 5
      }
    ]
  }
];
