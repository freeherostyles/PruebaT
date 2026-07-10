import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthStore } from '../features/auth/store/auth.store';
import { useProfile } from '../features/auth/hooks/use-profile';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setRestoring = useAuthStore((s) => s.setRestoring);
  const isRestoring = useAuthStore((s) => s.isRestoring);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const shouldFetch = !!token && !isAuthenticated;

  const { isError } = useProfile(shouldFetch);

  useEffect(() => {
    if (!token) {
      setRestoring(false);
    }
  }, [token, setRestoring]);

  useEffect(() => {
    if (isError) {
      logout();
      setRestoring(false);
    }
  }, [isError, logout, setRestoring]);

  const profileQuery = useProfile(shouldFetch);

  useEffect(() => {
    if (profileQuery.data && token) {
      login(token, profileQuery.data);
    }
  }, [profileQuery.data, token, login]);

  if (isRestoring) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Verificando sesión…
        </Typography>
      </Box>
    );
  }

  return children;
}
