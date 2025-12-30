import { lazy } from "react";
import ProductDisplaySettings from "@/components/ProductDisplaySettings";
import { OnboardingGuide } from "@/components/OnboardingGuide";
import { Settings as SettingsIcon, Package, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/authContext";

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
          <TabsList className={`grid w-full ${isMasterAdmin ? 'max-w-3xl grid-cols-3' : 'max-w-2xl grid-cols-2'}`}>
            {/* Informações Tab - Visível para todos */}
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Informações</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>

            <TabsTrigger value="display">
              <span className="hidden sm:inline">Exibição de Produtos</span>
              <span className="sm:hidden">Exibição</span>
            </TabsTrigger>

            {/* Master Admin Only Tabs */}
            {isMasterAdmin && (
              <TabsTrigger value="components" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Componentes</span>
                <span className="sm:hidden">Comps</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Informações Tab - Visível para todos */}
          <TabsContent value="info" className="mt-6">
            <OnboardingGuide />
          </TabsContent>

          {/* Display Settings Tab */}
          <TabsContent value="display" className="mt-6">
            <ProductDisplaySettings />
          </TabsContent>

          {/* Component Showcase Tab - Master Admin Only */}
          {isMasterAdmin && (
            <TabsContent value="components" className="mt-6">
              <ComponentShowcase />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
