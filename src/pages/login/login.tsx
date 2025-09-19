import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { LogIn, Utensils, Users, Building, Folder, AlertCircle } from "lucide-react";
import { mockUsers } from "@/lib/mock-data";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email && password) {
      try {
        await login({ email, password });
        // Login bem-sucedido - o redirect será tratado pelo contexto/router
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Erro ao fazer login. Verifique suas credenciais."
        );
      }
    }
  };

  const handleQuickLogin = async (user: typeof mockUsers[0]) => {
    setError("");
    try {
      await login({
        email: user.email,
        password: "123456" // Senha padrão para desenvolvimento
      });
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erro ao fazer login rápido."
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* TEST: This should show as a bright red box if Tailwind is working */}
      <div className="fixed top-4 right-4 w-20 h-20 bg-red-500 text-white flex items-center justify-center rounded-lg z-50">
        CSS TEST
      </div>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <AnimatedGradientText className="mb-4">
            <span className="flex items-center space-x-2">
              <Utensils className="h-5 w-5" />
              <span>LEP System</span>
            </span>
          </AnimatedGradientText>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Área Administrativa
          </h1>
          <p className="text-muted-foreground">
            Faça login para acessar o sistema de gestão
          </p>
        </div>

        {/* Quick Login Cards */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-muted-foreground text-center">
            Login Rápido (Desenvolvimento)
          </h3>

          <div className="grid gap-3">
            {mockUsers.map((user) => (
              <Card
                key={user.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                onClick={() => handleQuickLogin(user)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                      </div>
                    </div>
                    <LogIn className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Traditional Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LogIn className="h-5 w-5" />
              <span>Login Tradicional</span>
            </CardTitle>
            <CardDescription>
              Entre com suas credenciais de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="seu.email@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <ShimmerButton
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!email || !password || loading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Entrando..." : "Entrar no Sistema"}
              </ShimmerButton>
            </form>
          </CardContent>
        </Card>

        {/* Development Info */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Ambiente de Desenvolvimento</p>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <Folder className="h-3 w-3" />
                    <span>Org ID: org-123</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Folder className="h-3 w-3" />
                    <span>Project ID: proj-456</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}