import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { LogIn, Utensils, AlertCircle } from "lucide-react";
import { AxiosError } from "axios";

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
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
        setError(
          axiosErr.response?.data?.error ||
          axiosErr.response?.data?.message ||
          "Erro ao fazer login. Verifique suas credenciais."
        );
      }
    }
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

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Área Administrativa
          </h1>
          <p className="text-muted-foreground">
            Faça login para acessar o sistema de gestão
          </p>
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

      </div>
    </div>
  );
}