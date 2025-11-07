import ProductDisplaySettings from "@/components/ProductDisplaySettings";
import ThemeCustomizationTab from "@/components/ThemeCustomizationTab";
import { Settings as SettingsIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="display">Exibição de Produtos</TabsTrigger>
            <TabsTrigger value="theme">Tema e Cores</TabsTrigger>
          </TabsList>

          {/* Display Settings Tab */}
          <TabsContent value="display" className="mt-6">
            <ProductDisplaySettings />
          </TabsContent>

          {/* Theme Customization Tab */}
          <TabsContent value="theme" className="mt-6">
            <ThemeCustomizationTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
