import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { LogIn, Utensils, Users, Building, Folder } from "lucide-react";
import { mockUsers } from "@/lib/mock-data";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      login({
        id: "dev-user",
        name: "Usuário Teste",
        email: email,
        role: "admin",
        orgId: "org-123",
        projectId: "proj-456"
      });
    }
  };

  const handleQuickLogin = (user: typeof mockUsers[0]) => {
    login({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      orgId: "org-123",
      projectId: "proj-456"
    });
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="seu.email@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  required
                />
              </div>

              <ShimmerButton
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!email || !password}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Entrar no Sistema
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