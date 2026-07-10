import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { useHealthStatus } from '../hooks/use-health-status';

export function InfrastructureStatusPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useHealthStatus();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Card elevation={0} sx={{ border: '1px solid #dbe4f0' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Gestion de Proveedores
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Infraestructura inicial funcionando
                </Typography>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <StatusChip
                  label="Backend conectado"
                  success={data?.status === 'ok'}
                  loading={isLoading}
                />
                <StatusChip
                  label="Base de datos conectada"
                  success={data?.database === 'up'}
                  loading={isLoading}
                />
              </Stack>

              {isLoading ? (
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <CircularProgress size={22} />
                  <Typography color="text.secondary">
                    Verificando conexion con el backend...
                  </Typography>
                </Stack>
              ) : null}

              {isError ? (
                <Alert severity="error">
                  No fue posible consultar el backend.{' '}
                  {error instanceof Error ? error.message : 'Error desconocido'}
                </Alert>
              ) : null}

              {data ? (
                <Alert severity="success">
                  API disponible y conexion con PostgreSQL confirmada.
                </Alert>
              ) : null}

              <Stack direction="row" sx={{ justifyContent: 'flex-start' }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshRoundedIcon />}
                  onClick={() => void refetch()}
                  disabled={isFetching}
                >
                  Volver a verificar
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

type StatusChipProps = {
  label: string;
  success: boolean;
  loading: boolean;
};

function StatusChip({ label, success, loading }: StatusChipProps) {
  if (loading) {
    return <Chip label={`${label}: verificando`} variant="outlined" />;
  }

  return (
    <Chip
      color={success ? 'success' : 'default'}
      icon={
        success ? <CheckCircleOutlineRoundedIcon /> : <ErrorOutlineRoundedIcon />
      }
      label={`${label}: ${success ? 'si' : 'no'}`}
      variant={success ? 'filled' : 'outlined'}
    />
  );
}
