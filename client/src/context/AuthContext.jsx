import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/me')
      .then((res) => setAdmin(res.data.data))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/admin/login', { email, password });
    setAdmin(res.data.data);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    await api.post('/admin/logout');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
