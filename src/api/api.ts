import axios from "axios";

// cria uma instância axios centralizada
const baseURL = import.meta.env.VITE_API_BASE_URL || "https://lep-system-341885235510.us-central1.run.app";

console.log('API Configuration:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  baseURL,
  env: import.meta.env
});

const api = axios.create({
  baseURL, // Backend LEP-Back
  headers: { "Content-Type": "application/json" }
});

// intercepta requisições para adicionar headers de autenticação e multi-tenant
api.interceptors.request.use((config) => {
  try {
    // Adiciona token de autenticação
    const token = localStorage.getItem("@LEP:token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Adiciona headers multi-tenant usando currentOrganization e currentProject
    const currentOrganization = localStorage.getItem("@LEP:currentOrganization");
    const currentProject = localStorage.getItem("@LEP:currentProject");

    if (currentOrganization && currentProject) {
      config.headers["X-Lpe-Organization-Id"] = currentOrganization;
      config.headers["X-Lpe-Project-Id"] = currentProject;
      console.log('Adding multi-tenant headers:', {
        organization_id: currentOrganization,
        project_id: currentProject,
        url: config.url
      });
    } else {
      console.warn('Missing organization_id or project_id for request:', {
        url: config.url,
        hasOrganization: !!currentOrganization,
        hasProject: !!currentProject
      });
    }
  } catch (err) {
    // ignora se não tiver dados válidos ou dados corrompidos
    console.warn("Erro ao adicionar headers de autenticação:", err);
  }
  return config;
});

// intercepta respostas para tratar erros de autenticação
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });

    if (error.response?.status === 401) {
      // Token expirado ou inválido - limpa dados de autenticação
      localStorage.removeItem("@LEP:token");
      localStorage.removeItem("@LEP:user");
      localStorage.removeItem("@LEP:organizations");
      localStorage.removeItem("@LEP:projects");
      localStorage.removeItem("@LEP:currentOrganization");
      localStorage.removeItem("@LEP:currentProject");
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
