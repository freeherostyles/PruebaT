import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  Alert,
  Divider,
} from '@mui/material';
import { useLogin } from '../hooks/use-login';
import type { LoginRequest } from '../types/auth';

export function LoginPage() {
  const loginMutation = useLogin();
  const [showDevInfo, setShowDevInfo] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginRequest>({
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Iniciar sesión
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingresa tus credenciales para acceder al sistema
                </Typography>
              </Stack>

              <form onSubmit={onSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Correo electrónico"
                    type="email"
                    fullWidth
                    autoComplete="email"
                    autoFocus
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register('email', {
                      required: 'El correo es obligatorio',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Formato de correo inválido',
                      },
                    })}
                  />

                  <TextField
                    label="Contraseña"
                    type="password"
                    fullWidth
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register('password', {
                      required: 'La contraseña es obligatoria',
                      minLength: {
                        value: 8,
                        message: 'Mínimo 8 caracteres',
                      },
                    })}
                  />

                  {loginMutation.isError && (
                    <Alert severity="error">
                      Credenciales inválidas. Verifica tu correo y contraseña.
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={!isValid || loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Iniciando sesión…' : 'Iniciar sesión'}
                  </Button>
                </Stack>
              </form>

              {import.meta.env.DEV && (
                <>
                  <Divider />
                  <Stack spacing={1}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        textDecorationStyle: 'dotted',
                      }}
                      onClick={() => setShowDevInfo(!showDevInfo)}
                    >
                      {showDevInfo ? 'Ocultar' : 'Mostrar'} credenciales de desarrollo
                    </Typography>
                    {showDevInfo && (
                      <Stack spacing={0.5}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          ADMIN → admin@providers.local
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          EXECUTIVE → executive@providers.local
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
