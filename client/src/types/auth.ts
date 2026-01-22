export interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "inspector" | "viewer";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  role?: "admin" | "inspector" | "viewer";
}
