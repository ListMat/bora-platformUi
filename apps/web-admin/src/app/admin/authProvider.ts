import { AuthProvider } from "@/components/admin";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    // Simulação de login - em produção, usar NextAuth
    if (email === "admin@bora.com" && password === "admin") {
      localStorage.setItem("user", JSON.stringify({ email, role: "admin" }));
      return Promise.resolve();
    }
    return Promise.reject(new Error("Credenciais inválidas"));
  },

  logout: async () => {
    localStorage.removeItem("user");
    return Promise.resolve();
  },

  checkAuth: async () => {
    const user = localStorage.getItem("user");
    return user ? Promise.resolve() : Promise.reject();
  },

  checkError: async (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("user");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getIdentity: async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      return Promise.reject();
    }
    const user = JSON.parse(userStr);
    return Promise.resolve({
      id: user.email,
      fullName: user.email,
      avatar: undefined,
    });
  },

  getPermissions: async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      return Promise.reject();
    }
    const user = JSON.parse(userStr);
    return Promise.resolve(user.role);
  },
};

