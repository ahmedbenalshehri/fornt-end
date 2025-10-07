// Authentication service for handling login, register, and logout operations
import axios from "axios";

const API_BASE_URL = "http://localhost:3300";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export class AuthService {
  static async login(email, password) {
    try {
      const response = await apiClient.post("/users/login", {
        email,
        password,
      });

      const data = response.data;

      // Store auth token and user data
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Return data in expected format for AuthContext
      return {
        success: true,
        message: data.message,
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(errorMessage);
    }
  }

  static async register(userData) {
    try {
      const response = await apiClient.post("/users/register", userData);
      console.log(response);

      const data = response.data;

      // Store auth token and user data if auto-login is enabled
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Return data in expected format for AuthContext
      return {
        success: true,
        message: data.message,
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      throw new Error(errorMessage);
    }
  }

  static async logout() {
    try {
      const token = this.getToken();

      if (token) {
        // Call logout endpoint if available
        try {
          await apiClient.post("/auth/logout");
        } catch (error) {
          // Ignore logout API errors
          console.warn("Logout API call failed:", error.message);
        }
      }

      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      // Clear local storage even if API call fails
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return true;
    }
  }

  static getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  }

  static getUser() {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static async refreshToken() {
    try {
      const token = this.getToken();
      if (!token) throw new Error("No token to refresh");

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        return data.token;
      }

      throw new Error("No new token received");
    } catch (error) {
      console.error("Token refresh error:", error);
      // Clear invalid token
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      throw error;
    }
  }

  static async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Password reset request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Password reset failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }
}

// Mock implementation for development/testing
export class MockAuthService {
  static async login(email, password) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (email === "test@example.com" && password === "password") {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        phone: "+966501234567",
        preferredLanguage: "en", // Default to English for testing
      };

      const mockToken = "mock-jwt-token-" + Date.now();

      localStorage.setItem("authToken", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      return {
        success: true,
        token: mockToken,
        user: mockUser,
        message: "Login successful",
      };
    } else {
      throw new Error("Invalid email or password");
    }
  }

  static async register(userData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (!userData.email || !userData.password || !userData.fullName) {
      throw new Error("All fields are required");
    }

    const mockUser = {
      id: Date.now(),
      email: userData.email,
      name: userData.fullName,
      phone: userData.phone || "",
      preferredLanguage: userData.preferredLanguage || "ar", // Default to Arabic for new users
    };

    const mockToken = "mock-jwt-token-" + Date.now();

    localStorage.setItem("authToken", mockToken);
    localStorage.setItem("user", JSON.stringify(mockUser));

    return {
      success: true,
      token: mockToken,
      user: mockUser,
      message: "Account created successfully",
    };
  }

  static async logout() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    return { success: true, message: "Logged out successfully" };
  }

  static getToken() {
    return localStorage.getItem("authToken");
  }

  static getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

// Export the appropriate service based on environment
export default AuthService;
