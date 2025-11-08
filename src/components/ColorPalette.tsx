import React from 'react';

export default function ColorPalette() {
  const colors = [
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

  return (
    <div className="p-8 bg-background">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Color Palette</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colors.map((color) => {
          const hslValue = getColorValue(color.variable);
          const bgColor = `hsl(${hslValue})`;

          // Para cores de texto, usar background-foreground como contrastante
          const isTextColor = color.name.includes('foreground');

          return (
            <div
              key={color.name}
              className="p-4 rounded-lg border border-border"
            >
              <div
                className="h-20 w-full rounded-md mb-3"
                style={{ backgroundColor: bgColor }}
              />
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{color.name}</p>
                <p className="text-xs text-muted-foreground">var({color.variable})</p>
                <p className="text-xs font-mono text-foreground">hsl({hslValue})</p>
                <p className="text-xs font-mono text-foreground">{bgColor}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Light Mode Values</h2>
        <pre className="bg-card p-4 rounded-lg overflow-auto text-card-foreground text-xs">
{`:root {
  --background: 0 0% 100%;           /* Branco puro */
  --foreground: 222.2 84% 4.9%;      /* Azul muito escuro */
  --card: 0 0% 100%;                 /* Branco puro */
  --card-foreground: 222.2 84% 4.9%; /* Azul muito escuro */
  --primary: 222.2 47.4% 11.2%;      /* Azul escuro */
  --primary-foreground: 210 40% 98%; /* Branco quase puro */
  --secondary: 210 40% 96%;          /* Cinza muito claro */
  --secondary-foreground: 222.2 47.4% 11.2%; /* Azul escuro */
  --muted: 210 40% 96%;              /* Cinza muito claro */
  --muted-foreground: 215.4 16.3% 46.9%; /* Cinza médio */
  --accent: 210 40% 96%;             /* Cinza muito claro */
  --accent-foreground: 222.2 47.4% 11.2%; /* Azul escuro */
  --destructive: 0 84.2% 60.2%;      /* Vermelho */
  --destructive-foreground: 210 40% 98%; /* Branco quase puro */
  --border: 214.3 31.8% 91.4%;       /* Cinza claro */
  --input: 214.3 31.8% 91.4%;        /* Cinza claro */
  --ring: 222.2 84% 4.9%;            /* Azul muito escuro */
}`}
        </pre>
      </div>
    </div>
  );
}
