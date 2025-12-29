import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { Building2, AlertCircle, CheckCircle } from "lucide-react";
import { AxiosError } from "axios";
import { organizationService, CreateOrganizationBootstrapResponse } from "@/api/organizationService";

export default function CreateOrganization() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<CreateOrganizationBootstrapResponse | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    if (!name.trim() || !password.trim()) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      const response = await organizationService.createBootstrap({
        name: name.trim(),
        password: password.trim()
      });

      setSuccess(response.data);

      // Redireciona para login após 3 segundos
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Organização criada com sucesso! Você pode fazer login com suas credenciais.",
            email: response.data.user.email,
            password: response.data.user.password
          }
        });
      }, 3000);

    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      setError(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "Erro ao criar organização. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <AnimatedGradientText className="mb-4">
              <span className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>LEP System</span>
              </span>
            </AnimatedGradientText>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              Organização Criada!
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Sucesso!</span>
              </CardTitle>
              <CardDescription>
                Sua organização foi criada com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                <h3 className="font-medium text-success mb-2">Dados da sua organização:</h3>
                <div className="space-y-2 text-sm text-success">
                  <div><strong>Organização:</strong> {success.organization.name}</div>
                  <div><strong>Email da Org:</strong> {success.organization.email}</div>
                  <div><strong>Projeto:</strong> {success.project.name}</div>
                  <div><strong>Usuário Admin:</strong> {success.user.name}</div>
                  <div><strong>Email de Login:</strong> {success.user.email}</div>
                  <div><strong>Senha:</strong> {success.user.password}</div>
                </div>
              </div>

              <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                <p className="text-sm text-primary text-center">
                  Você será redirecionado para a página de login em alguns segundos...
                </p>
              </div>

              <ShimmerButton
                onClick={() => navigate("/login")}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Ir para Login Agora
              </ShimmerButton>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <AnimatedGradientText className="mb-4">
            <span className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>LEP System</span>
            </span>
          </AnimatedGradientText>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Criar Organização
          </h1>
          <p className="text-muted-foreground">
            Crie sua organização para começar a usar o LEP System
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Nova Organização</span>
            </CardTitle>
            <CardDescription>
              Preencha os dados para criar sua organização
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
                  Nome da Organização
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Meu Restaurante"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Este nome será usado para criar o email: {name ? `${name}@lep.com` : 'nome@lep.com'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Senha de Acesso
                </label>
                <Input
                  type="password"
                  placeholder="Digite a senha de acesso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Entre em contato com o suporte para obter a senha
                </p>
              </div>

              <ShimmerButton
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!name.trim() || !password.trim() || loading}
              >
                <Building2 className="h-4 w-4 mr-2" />
                {loading ? "Criando Organização..." : "Criar Organização"}
              </ShimmerButton>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                  disabled={loading}
                >
                  Já tem uma conta? Fazer login
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}