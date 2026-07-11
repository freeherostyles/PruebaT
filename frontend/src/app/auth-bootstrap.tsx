import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthStore } from '../features/auth/store/auth.store';
import { getProfileApi } from '../features/auth/api/auth.api';
import type { AxiosError } from 'axios';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setRestoring = useAuthStore((s) => s.setRestoring);
  const isRestoring = useAuthStore((s) => s.isRestoring);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const shouldFetch = !!token && !isAuthenticated;

  const { data, isError, error } = useQuery({
    queryKey: ['auth-profile'],
    queryFn: getProfileApi,
    enabled: shouldFetch,
    retry: false,
  });

  useEffect(() => {
    if (!token) {
      setRestoring(false);
    }
  }, [token, setRestoring]);

  useEffect(() => {
    if (isError && error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        logout();
      }
      setRestoring(false);
    }
  }, [isError, error, logout, setRestoring]);

  useEffect(() => {
    if (data && token) {
      login(token, data);
    }
  }, [data, token, login]);

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
