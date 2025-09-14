import axios from "axios";


// cria uma instância axios centralizada
const api = axios.create({
  baseURL: "http://localhost:3000/api", // ajuste para sua API real
  headers: { "Content-Type": "application/json" }
});

// intercepta requisições para adicionar orgId/projId se logado
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      config.headers["orgId"] = user.orgId;
      config.headers["projId"] = user.projId;
    }
  } catch (err) {
    // ignora se não tiver user
  }
  return config;
});

export default api;
