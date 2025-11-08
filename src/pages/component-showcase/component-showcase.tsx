/**
 * Component Showcase / States Reference
 *
 * Esta página mostra todos os componentes do sistema em diferentes estados.
 * Útil para:
 * - Verificar consistência de design
 * - Validar contrast em light/dark mode
 * - Testar diferentes tamanhos e variantes
 * - Documentar design system
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { COLORS, SPACING, SHADOWS, TRANSITIONS, FONT_SIZE, BORDER_RADIUS } from '@/tokens/design-tokens';
import { Eye, Moon, Sun } from 'lucide-react';

export default function ComponentShowcase() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Component Showcase</h1>
          <p className="text-muted-foreground mt-2">
            Referência visual de todos os componentes e states do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Buttons Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Botões</h2>

        <Card>
          <CardHeader>
            <CardTitle>Estados de Botão</CardTitle>
            <CardDescription>Visualize botões em diferentes estados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Default */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Default State</p>
              <div className="flex flex-wrap gap-2">
                <Button>Default Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="destructive">Delete Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Diferentes Tamanhos</p>
              <div className="flex flex-wrap gap-2 items-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🎨</Button>
              </div>
            </div>

            {/* Disabled */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Disabled State</p>
              <div className="flex flex-wrap gap-2">
                <Button disabled>Disabled Primary</Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
                <Button variant="destructive" disabled>
                  Disabled Delete
                </Button>
              </div>
            </div>

            {/* With Loading */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Loading State</p>
              <div className="flex flex-wrap gap-2">
                <Button>
                  <span className="animate-spin mr-2">⏳</span>
                  Loading...
                </Button>
                <Button variant="outline">
                  <span className="animate-spin mr-2">⏳</span>
                  Processing...
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Inputs Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Inputs & Forms</h2>

        <Card>
          <CardHeader>
            <CardTitle>Estados de Input</CardTitle>
            <CardDescription>Visualize inputs em diferentes estados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Normal State */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Input Normal</label>
              <Input placeholder="Digite algo..." />
            </div>

            {/* With Value */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Input Preenchido</label>
              <Input value="Texto preenchido" readOnly />
            </div>

            {/* Disabled */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Input Desabilitado</label>
              <Input placeholder="Desabilitado..." disabled />
            </div>

            {/* Error */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-destructive">Input com Erro</label>
              <Input
                placeholder="Campo com erro..."
                className="border-destructive focus:ring-destructive"
              />
              <p className="text-sm text-destructive">Este campo contém um erro</p>
            </div>

            {/* With Validation */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="seu@email.com" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Cards</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Default Card */}
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Descrição do card</CardDescription>
            </CardHeader>
            <CardContent>Conteúdo do card com padding padrão</CardContent>
          </Card>

          {/* Card com Shadow */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Com sombra elevada</CardDescription>
            </CardHeader>
            <CardContent>Este card tem shadow-lg aplicado</CardContent>
          </Card>

          {/* Card Interativo */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Hover para ver o efeito</CardDescription>
            </CardHeader>
            <CardContent>Esse card tem hover interativo</CardContent>
          </Card>
        </div>
      </section>

      {/* Typography Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Tipografia</h2>

        <Card>
          <CardHeader>
            <CardTitle>Escala de Tipografia</CardTitle>
            <CardDescription>Todos os tamanhos de fonte disponíveis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Extra Small (xs)</p>
              <p style={{ fontSize: FONT_SIZE.xs }} className="text-foreground font-medium">
                This is extra small text (12px)
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Small (sm)</p>
              <p style={{ fontSize: FONT_SIZE.sm }} className="text-foreground font-medium">
                This is small text (14px)
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Base / Normal</p>
              <p style={{ fontSize: FONT_SIZE.base }} className="text-foreground font-medium">
                This is base text (16px)
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Large (lg)</p>
              <p style={{ fontSize: FONT_SIZE.lg }} className="text-foreground font-medium">
                This is large text (18px)
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Extra Large (xl)</p>
              <p style={{ fontSize: FONT_SIZE.xl }} className="text-foreground font-medium">
                This is extra large text (20px)
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">2XL</p>
              <p style={{ fontSize: FONT_SIZE['2xl'] }} className="text-foreground font-bold">
                This is 2xl text (24px)
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Spacing Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Espaçamento</h2>

        <Card>
          <CardHeader>
            <CardTitle>Escala de Espaçamento</CardTitle>
            <CardDescription>Visualize a escala de espaçamento (base: 4px)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
                <div key={size} className="flex items-center gap-3">
                  <p className="w-12 text-sm font-medium text-muted-foreground">{size}</p>
                  <div className="flex-1 bg-primary rounded" style={{ height: SPACING[size as keyof typeof SPACING] }} />
                  <p className="text-sm text-muted-foreground w-20">
                    {size === 'xs' && '8px'}
                    {size === 'sm' && '16px'}
                    {size === 'md' && '24px'}
                    {size === 'lg' && '32px'}
                    {size === 'xl' && '48px'}
                    {size === '2xl' && '64px'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Colors Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Cores</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div
                className="h-20 rounded-lg mb-3"
                style={{ backgroundColor: COLORS.primary }}
              />
              <p className="font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">#1E293B / #F8FAFC</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div
                className="h-20 rounded-lg mb-3"
                style={{ backgroundColor: COLORS.secondary }}
              />
              <p className="font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">#F0F4F8 / #334155</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div
                className="h-20 rounded-lg mb-3"
                style={{ backgroundColor: COLORS.destructive }}
              />
              <p className="font-medium">Destructive</p>
              <p className="text-xs text-muted-foreground">#EF4444 / #DC2626</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div
                className="h-20 rounded-lg mb-3"
                style={{ backgroundColor: COLORS.muted }}
              />
              <p className="font-medium">Muted</p>
              <p className="text-xs text-muted-foreground">#F0F4F8 / #334155</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div
                className="h-20 rounded-lg mb-3"
                style={{ backgroundColor: COLORS.accent }}
              />
              <p className="font-medium">Accent</p>
              <p className="text-xs text-muted-foreground">#F0F4F8 / #475569</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div
                className="h-20 rounded-lg mb-3"
                style={{ backgroundColor: COLORS.border }}
              />
              <p className="font-medium">Border</p>
              <p className="text-xs text-muted-foreground">#E2E8F0 / #475569</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer Info */}
      <div className="p-6 bg-muted rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          💡 Use o toggle no topo para alternar entre light/dark mode e ver como os componentes
          se adaptam
        </p>
      </div>
    </div>
  );
}
