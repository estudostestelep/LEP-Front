/**
 * Script para visualizar cores do Tailwind no VSCode
 *
 * Copie e cole este código no Console do DevTools para ver as cores:
 *
 * Cores Light Mode:
 * --background: #FFFFFF (Branco puro)
 * --foreground: #0F172A (Azul muito escuro)
 * --primary: #1E293B (Azul escuro)
 * --primary-foreground: #F8FAFC (Branco quase puro)
 * --secondary: #F0F4F8 (Cinza muito claro)
 * --muted: #F0F4F8 (Cinza muito claro)
 * --muted-foreground: #64748B (Cinza médio)
 * --accent: #F0F4F8 (Cinza muito claro)
 * --destructive: #EF4444 (Vermelho)
 * --border: #E2E8F0 (Cinza claro)
 * --input: #E2E8F0 (Cinza claro)
 * --ring: #0F172A (Azul muito escuro)
 *
 * Cores Dark Mode:
 * --background: #0F172A (Azul muito escuro)
 * --foreground: #F8FAFC (Branco quase puro)
 * --card: #1E293B (Azul escuro)
 * --primary: #F8FAFC (Branco quase puro)
 * --secondary: #334155 (Cinza azulado escuro)
 * --muted: #334155 (Cinza azulado escuro)
 * --muted-foreground: #94A3B8 (Cinza azulado médio)
 * --accent: #475569 (Cinza azulado)
 * --destructive: #DC2626 (Vermelho escuro)
 */

const TailwindColors = {
  light: {
    'bg-background': '#FFFFFF',
    'text-foreground': '#0F172A',
    'bg-card': '#FFFFFF',
    'text-card-foreground': '#0F172A',
    'bg-primary': '#1E293B',
    'text-primary-foreground': '#F8FAFC',
    'bg-secondary': '#F0F4F8',
    'text-secondary-foreground': '#1E293B',
    'bg-muted': '#F0F4F8',
    'text-muted-foreground': '#64748B',
    'bg-accent': '#F0F4F8',
    'text-accent-foreground': '#1E293B',
    'bg-destructive': '#EF4444',
    'text-destructive-foreground': '#F8FAFC',
    'border-border': '#E2E8F0',
    'border-input': '#E2E8F0',
  },
  dark: {
    'bg-background': '#0F172A',
    'text-foreground': '#F8FAFC',
    'bg-card': '#1E293B',
    'text-card-foreground': '#F8FAFC',
    'bg-primary': '#F8FAFC',
    'text-primary-foreground': '#1E293B',
    'bg-secondary': '#334155',
    'text-secondary-foreground': '#F8FAFC',
    'bg-muted': '#334155',
    'text-muted-foreground': '#94A3B8',
    'bg-accent': '#475569',
    'text-accent-foreground': '#F8FAFC',
    'bg-destructive': '#DC2626',
    'text-destructive-foreground': '#F8FAFC',
    'border-border': '#475569',
    'border-input': '#334155',
  }
};

// Para usar: console.log(TailwindColors.light['bg-primary']);
// Resultado: #1E293B
