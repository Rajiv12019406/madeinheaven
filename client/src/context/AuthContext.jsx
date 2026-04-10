import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../api/client';

const STORAGE_KEY = 'legal_consult_jwt';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      api
        .get('/api/auth/me')
        .then((r) => setUser(r.data))
        .catch(() => {
          localStorage.removeItem(STORAGE_KEY);
          setToken(null);
          setAuthToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setAuthToken(null);
      setLoading(false);
    }
  }, [token]);

  const login = useCallback(async (email, password, options = {}) => {
    setError(null);
    const { rememberMe } = options;
    const { data } = await api.post('/api/auth/login', {
      email,
      password,
      rememberMe: Boolean(rememberMe),
    });
    localStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError(null);
    const { data } = await api.post('/api/auth/register', {
      name,
      email,
      password,
    });
    localStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setAuthToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const { data } = await api.get('/api/auth/me');
    setUser(data);
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      register,
      logout,
      clearError: () => setError(null),
      refreshUser,
    }),
    [user, token, loading, error, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
