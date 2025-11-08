import { lazy } from "react";
import ProductDisplaySettings from "@/components/ProductDisplaySettings";
import ThemeCustomizationTab from "@/components/ThemeCustomizationTab";
import { Settings as SettingsIcon, Palette, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ColorPalette = lazy(() => import("@/components/ColorPalette"));
const ComponentShowcase = lazy(() => import("@/pages/component-showcase/component-showcase"));

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <SettingsIcon className="h-8 w-8" />
            <span>Configurações</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Personalize o sistema de acordo com suas preferências
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid w-full max-w-4xl grid-cols-4">
            <TabsTrigger value="display">Exibição de Produtos</TabsTrigger>
            <TabsTrigger value="theme">Tema e Cores</TabsTrigger>
            <TabsTrigger value="palette" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Paleta de Cores</span>
              <span className="sm:hidden">Cores</span>
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Componentes</span>
              <span className="sm:hidden">Comps</span>
            </TabsTrigger>
          </TabsList>

          {/* Display Settings Tab */}
          <TabsContent value="display" className="mt-6">
            <ProductDisplaySettings />
          </TabsContent>

          {/* Theme Customization Tab */}
          <TabsContent value="theme" className="mt-6">
            <ThemeCustomizationTab />
          </TabsContent>

          {/* Color Palette Tab */}
          <TabsContent value="palette" className="mt-6">
            <ColorPalette />
          </TabsContent>

          {/* Component Showcase Tab */}
          <TabsContent value="components" className="mt-6">
            <ComponentShowcase />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
