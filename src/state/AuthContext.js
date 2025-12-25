import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { apiPost } from '../api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const DEFAULT_LOCAL_USERS = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'customer', password: 'pass1234' },
    { id: 2, name: 'Admin Bob', email: 'admin@example.com', role: 'admin', password: 'admin1234' }
  ];
  const [localUsers, setLocalUsers] = useState(() => {
    const saved = localStorage.getItem('localUsers');
    return saved ? JSON.parse(saved) : DEFAULT_LOCAL_USERS;
  });
  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (saved) {
      const { user, token } = JSON.parse(saved);
      setUser(user); setToken(token);
    }
  }, []);
  const login = useCallback(async ({ email, password, role }) => {
    try {
      const r = await apiPost('/auth/login', { email, password, role });
      if (r && r.token) {
        setUser(r.user); setToken(r.token);
        localStorage.setItem('auth', JSON.stringify({ user: r.user, token: r.token }));
        return r.user;
      }
    } catch (_) {}
    const u = localUsers.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.role === role);
    if (!u || (u.password !== password)) throw new Error('Invalid credentials');
    const localToken = btoa(JSON.stringify({ userId: u.id, role: u.role, email: u.email, ts: Date.now() }));
    const localUser = { id: u.id, name: u.name, email: u.email, role: u.role };
    setUser(localUser); setToken(localToken);
    localStorage.setItem('auth', JSON.stringify({ user: localUser, token: localToken }));
    return localUser;
  }, [localUsers]);
  const register = useCallback(async ({ name, email, password, role }) => {
    try {
      const r = await apiPost('/auth/register', { name, email, password, role });
      if (r && r.token) {
        setUser(r.user); setToken(r.token);
        localStorage.setItem('auth', JSON.stringify({ user: r.user, token: r.token }));
        return r.user;
      }
    } catch (_) {}
    const exists = localUsers.some((x) => x.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error('Email already registered');
    const id = (localUsers[localUsers.length - 1]?.id || 0) + 1;
    const u = { id, name, email: email.toLowerCase(), role, password };
    const localUser = { id, name, email: u.email, role: u.role };
    const localToken = btoa(JSON.stringify({ userId: id, role, email: u.email, ts: Date.now() }));
    const list = [...localUsers, u];
    setLocalUsers(list);
    localStorage.setItem('localUsers', JSON.stringify(list));
    setUser(localUser); setToken(localToken);
    localStorage.setItem('auth', JSON.stringify({ user: localUser, token: localToken }));
    return localUser;
  }, [localUsers]);
  const logout = useCallback(() => { setUser(null); setToken(null); localStorage.removeItem('auth'); }, []);
  const value = useMemo(() => ({ user, token, role: user?.role || null, login, register, logout }), [user, token, login, register, logout]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() { return useContext(AuthCtx); }
