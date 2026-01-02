import { lazy } from "react";
import ProductDisplaySettings from "@/components/ProductDisplaySettings";
import ThemeCustomizationTab from "@/components/ThemeCustomizationTab";
import { OnboardingGuide } from "@/components/OnboardingGuide";
import { Settings as SettingsIcon, Palette, Package, Lock, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/authContext";

const ColorPalette = lazy(() => import("@/components/ColorPalette"));
const ComponentShowcase = lazy(() => import("@/pages/component-showcase/component-showcase"));

export default function Settings() {
  const { isMasterAdmin } = useAuth();

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
        <Tabs defaultValue="info" className="w-full">
          <TabsList className={`grid w-full ${isMasterAdmin ? 'max-w-5xl grid-cols-5' : 'max-w-3xl grid-cols-3'}`}>
            {/* Informações Tab - Primeira aba, visível para todos */}
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Informações</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>

            <TabsTrigger value="display">Exibição de Produtos</TabsTrigger>
            <TabsTrigger value="theme">Tema e Cores</TabsTrigger>

            {/* Master Admin Only Tabs */}
            {isMasterAdmin && (
              <>
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
              </>
            )}
          </TabsList>

          {/* Informações Tab */}
          <TabsContent value="info" className="mt-6">
            <OnboardingGuide />
          </TabsContent>

          {/* Display Settings Tab */}
          <TabsContent value="display" className="mt-6">
            <ProductDisplaySettings />
          </TabsContent>

          {/* Theme Customization Tab */}
          <TabsContent value="theme" className="mt-6">
            <ThemeCustomizationTab />
          </TabsContent>

          {/* Color Palette Tab - Master Admin Only */}
          {isMasterAdmin && (
            <TabsContent value="palette" className="mt-6">
              <ColorPalette />
            </TabsContent>
          )}

          {/* Component Showcase Tab - Master Admin Only */}
          {isMasterAdmin && (
            <TabsContent value="components" className="mt-6">
              <ComponentShowcase />
            </TabsContent>
          )}
        </Tabs>

        {/* Master Admin Notice */}
        {!isMasterAdmin && (
          <div className="mt-8 p-4 bg-muted rounded-lg border border-border flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              As abas "Paleta de Cores" e "Componentes" estão disponíveis apenas para Master Admin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
