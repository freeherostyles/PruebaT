import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Avatar,
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
  Chip,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useLogin } from '../hooks/use-login';
import type { LoginRequest } from '../types/auth';

export function LoginPage() {
  const loginMutation = useLogin();
  const [showDevInfo, setShowDevInfo] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
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
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: { xs: 3, md: 4 },
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: { xs: 3, md: 5 },
              pt: { xs: 3, md: 4 },
              pb: 2,
              background:
                'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.08) 100%)',
            }}
          >
            <Stack spacing={1.5} sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, textAlign: { sm: 'center' } }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <LockOutlinedIcon />
              </Avatar>
              <Stack spacing={0.75}>
                <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.8rem', md: '2.125rem' } }}>
                  Iniciar sesión
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accede al panel de gestión de proveedores con tu perfil asignado.
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={3}>
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
                      <Stack spacing={1}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                          <Chip
                            label="Entrar como ADMIN"
                            clickable
                            onClick={() => {
                              setValue('email', 'admin@providers.local', { shouldValidate: true });
                              setValue('password', 'change_admin_password', { shouldValidate: true });
                            }}
                            sx={{ justifyContent: 'flex-start' }}
                          />
                          <Chip
                            label="Entrar como EXECUTIVE"
                            clickable
                            onClick={() => {
                              setValue('email', 'executive@providers.local', { shouldValidate: true });
                              setValue('password', 'change_executive_password', { shouldValidate: true });
                            }}
                            sx={{ justifyContent: 'flex-start' }}
                          />
                        </Stack>
                        <Stack spacing={0.5}>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            ADMIN → admin@providers.local
                          </Typography>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            EXECUTIVE → executive@providers.local
                          </Typography>
                        </Stack>
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
