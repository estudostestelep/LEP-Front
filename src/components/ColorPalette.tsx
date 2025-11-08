/**
 * Color Palette & Design Tokens Visualizer
 *
 * Página para visualizar e debugar todos os tokens de design do sistema
 * em tempo real. Inclui:
 * - Cores semânticas (light/dark mode)
 * - Espaçamento scale
 * - Shadows e transitions
 * - Border radius
 * - Tipografia
 */

import React, { useState } from 'react';
import { COLORS, SPACING_VALUES, SHADOWS_VALUES, BORDER_RADIUS_VALUES, TRANSITIONS_VALUES, FONT_SIZE, FONT_WEIGHT } from '@/tokens/design-tokens';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';

export default function ColorPalette() {
  const [copied, setCopied] = useState<string | null>(null);

  const colorItems = [
    { name: 'background', variable: '--background' },
    { name: 'foreground', variable: '--foreground' },
    { name: 'card', variable: '--card' },
    { name: 'card-foreground', variable: '--card-foreground' },
    { name: 'primary', variable: '--primary' },
    { name: 'primary-foreground', variable: '--primary-foreground' },
    { name: 'secondary', variable: '--secondary' },
    { name: 'secondary-foreground', variable: '--secondary-foreground' },
    { name: 'muted', variable: '--muted' },
    { name: 'muted-foreground', variable: '--muted-foreground' },
    { name: 'accent', variable: '--accent' },
    { name: 'accent-foreground', variable: '--accent-foreground' },
    { name: 'destructive', variable: '--destructive' },
    { name: 'destructive-foreground', variable: '--destructive-foreground' },
    { name: 'border', variable: '--border' },
    { name: 'input', variable: '--input' },
    { name: 'ring', variable: '--ring' },
  ];

  const getColorValue = (variable: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">🎨 Design Tokens & Colors</h1>
        <p className="text-muted-foreground text-lg">
          Visualizer completo para todos os design tokens do LEP System
        </p>
      </div>

      {/* Semantic Colors */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Cores Semânticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorItems.map((color) => {
            const hslValue = getColorValue(color.variable);
            const bgColor = `hsl(${hslValue})`;

            return (
              <Card key={color.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div
                    className="h-24 w-full rounded-md mb-4 border border-border"
                    style={{ backgroundColor: bgColor }}
                  />
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">{color.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{color.variable}</p>
                    <p className="text-xs font-mono text-foreground break-all">{hslValue}</p>
                    <button
                      onClick={() => copyToClipboard(color.variable, color.name)}
                      className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 mt-2"
                    >
                      {copied === color.name ? (
                        <>
                          <Check className="h-3 w-3" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copiar
                        </>
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Spacing Scale */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Escala de Espaçamento</h2>
        <Card>
          <CardHeader>
            <CardTitle>Spacing Tokens</CardTitle>
            <CardDescription>Base unit: 4px (0.25rem)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(SPACING_VALUES).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <p className="w-16 font-mono font-medium text-sm text-foreground">--spacing-{key}</p>
                <div className="flex-1 flex items-center gap-2">
                  <div
                    className="bg-primary rounded"
                    style={{ height: value, minWidth: value }}
                  />
                  <span className="text-xs text-muted-foreground font-mono">{value}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`--spacing-${key}`, `spacing-${key}`)}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Shadows */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Shadows</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(SHADOWS_VALUES).map(([key, value]) => (
            <Card key={key} style={{ boxShadow: value }}>
              <CardContent className="p-8">
                <p className="font-mono font-medium text-foreground mb-2">shadow-{key}</p>
                <p className="text-xs text-muted-foreground font-mono break-all">{value}</p>
                <button
                  onClick={() => copyToClipboard(`--shadow-${key}`, `shadow-${key}`)}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 mt-3"
                >
                  <Copy className="h-3 w-3" /> Copiar
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Border Radius</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(BORDER_RADIUS_VALUES).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-8 flex flex-col items-center">
                <div
                  className="w-20 h-20 bg-primary mb-4"
                  style={{ borderRadius: value }}
                />
                <p className="font-mono font-medium text-foreground">{key}</p>
                <p className="text-xs text-muted-foreground font-mono">{value}</p>
                <button
                  onClick={() => copyToClipboard(`--border-radius-${key}`, `radius-${key}`)}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 mt-3"
                >
                  <Copy className="h-3 w-3" /> Copiar
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Transitions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Transitions</h2>
        <Card>
          <CardHeader>
            <CardTitle>Timing Functions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(TRANSITIONS_VALUES).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-muted rounded">
                <div>
                  <p className="font-mono font-medium text-foreground">transition-{key}</p>
                  <p className="text-xs text-muted-foreground font-mono">{value}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(`--transition-${key}`, `transition-${key}`)}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Tipografia</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Font Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Font Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(FONT_SIZE).map(([key, value]) => (
                <div key={key}>
                  <p className="font-mono text-xs text-muted-foreground mb-1">{key} ({value})</p>
                  <p style={{ fontSize: value }} className="text-foreground">
                    The quick brown fox jumps
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Font Weights */}
          <Card>
            <CardHeader>
              <CardTitle>Font Weights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(FONT_WEIGHT).map(([key, value]) => (
                <div key={key}>
                  <p className="font-mono text-xs text-muted-foreground mb-1">
                    {key} ({value})
                  </p>
                  <p style={{ fontWeight: value }} className="text-foreground">
                    The quick brown fox jumps
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CSS Variables Reference */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">CSS Variables Reference</h2>
        <Card>
          <CardHeader>
            <CardTitle>Light Mode Variables</CardTitle>
            <CardDescription>Copie essas variáveis para usar em CSS</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-card p-6 rounded-lg overflow-auto text-card-foreground text-xs border border-border">
              {`:root {
  /* Colors */
  --background: ${getColorValue('--background')};
  --foreground: ${getColorValue('--foreground')};
  --card: ${getColorValue('--card')};
  --card-foreground: ${getColorValue('--card-foreground')};
  --primary: ${getColorValue('--primary')};
  --primary-foreground: ${getColorValue('--primary-foreground')};

  /* Spacing */
  --spacing-xs: ${SPACING_VALUES.xs};
  --spacing-sm: ${SPACING_VALUES.sm};
  --spacing-md: ${SPACING_VALUES.md};

  /* Shadows */
  --shadow-sm: ${SHADOWS_VALUES.sm};
  --shadow-md: ${SHADOWS_VALUES.md};

  /* Transitions */
  --transition-base: ${TRANSITIONS_VALUES.base};
}`}
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <div className="text-center p-6 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 Clique em qualquer token para copiar a variável CSS
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Para mais detalhes, consulte: DESIGN_TOKENS.md
        </p>
      </div>
    </div>
  );
}
