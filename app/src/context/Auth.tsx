import axios from "axios";
import { createContext, ReactNode, useState } from "react";

interface User {
  id?: number;
  username: string;
}

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
  login: (email: string, password: string) => Promise<User | null>;
  findMe: () => Promise<User | null>;
  logout: () => Promise<boolean>;
}

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
  isAuth: false,
  setIsAuth: () => {},
  login: async () => {
    return null;
  },
  findMe: async () => {
    return null;
  },
  logout: async () => {
    return false;
  },
});

type LoginRes = {
  id: number;
  name: string;
};

export const AuthProvider = ({ children }: Props) => {
  // ページがリロードされたりするたびに実行される初期化処理
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const findMe = async (): Promise<User | null> => {
    try {
      const res = await axios.get<LoginRes>("http://localhost:9999/me", {
        withCredentials: true,
      });
      const user: User = {
        id: res.data.id,
        username: res.data.name,
      };
      return user;
    } catch (e) {
      return null;
    }
  };
  const login = async (
    mail: string,
    password: string
  ): Promise<User | null> => {
    try {
      const res = await axios.post<LoginRes>(
        "http://localhost:9999/login",
        {
          mail: mail,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 400 || res.status === 401 || res.status === 500) {
        return null;
      }
      const user: User = {
        id: res.data.id,
        username: res.data.name,
      };
      return user;
    } catch (error) {
      return null;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      await axios.post("http://localhost:9999/logout" , {} , {
        withCredentials: true,
      });
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  };

  const contextValue: AuthContextValue = {
    user,
    setUser,
    isAuth,
    login,
    setIsAuth,
    findMe,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
