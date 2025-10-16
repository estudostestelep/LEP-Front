import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { Home, Utensils, AlertTriangle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona automaticamente após 5 segundos
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <AnimatedGradientText className="mb-4">
            <span className="flex items-center space-x-2">
              <Utensils className="h-5 w-5" />
              <span>LEP System</span>
            </span>
          </AnimatedGradientText>

          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-yellow-500" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Página Não Encontrada
          </h1>
          <p className="text-muted-foreground">
            A página que você está procurando não existe
          </p>
        </div>

        {/* Redirect Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-center justify-center">
              <Home className="h-5 w-5" />
              <span>Redirecionamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Você será redirecionado automaticamente em 5 segundos para a página inicial.
            </p>

            <div className="pt-4">
              <ShimmerButton
                onClick={handleRedirect}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Home className="h-4 w-4 mr-2" />
                Ir Agora
              </ShimmerButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}