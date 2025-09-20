import axios from "axios";

// cria uma instância axios centralizada
const api = axios.create({
  baseURL: "http://localhost:8080", // Backend LEP-Back na porta 8080
  headers: { "Content-Type": "application/json" }
});

// intercepta requisições para adicionar headers de autenticação e multi-tenant
api.interceptors.request.use((config) => {
  try {
    // Adiciona token de autenticação
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Adiciona headers multi-tenant
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.orgId && user.projectId) {
      config.headers["X-Lpe-Organization-Id"] = user.orgId;
      config.headers["X-Lpe-Project-Id"] = user.projectId;
    }
  } catch (err) {
    // ignora se não tiver user válido ou dados corrompidos
    console.warn("Erro ao adicionar headers de autenticação:", err);
  }
  return config;
});

// intercepta respostas para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - limpa dados de autenticação
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redireciona para login se não estiver já na página de login
      if (window.location.pathname !== "/login") {
        console.warn("Token inválido, redirecionando para login");
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      // Sem permissão - pode mostrar mensagem ao usuário
      console.warn("Acesso negado para esta operação");
    } else if (error.response?.status >= 500) {
      // Erro do servidor
      console.error("Erro interno do servidor:", error.response?.data);
    }
    return Promise.reject(error);
  }
);

export default api;
