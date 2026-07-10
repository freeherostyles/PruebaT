import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
  Alert,
  Button,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { useSupplierStats } from '../hooks/use-stats';
import { useAuthStore } from '../../auth/store/auth.store';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
            }}
          >
            {icon}
          </Box>
          <Stack spacing={0}>
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useSupplierStats();
  const user = useAuthStore((s) => s.user);

  return (
    <Container maxWidth="lg" disableGutters>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.role === 'ADMIN'
                ? 'Resumen general de proveedores'
                : 'Panel de consulta de proveedores'}
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={isFetching}
            sx={{ textTransform: 'none' }}
          >
            Actualizar
          </Button>
        </Stack>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => refetch()}
              >
                Reintentar
              </Button>
            }
          >
            No se pudieron cargar las estadísticas.{' '}
            {error instanceof Error ? error.message : 'Error del servidor'}
          </Alert>
        )}

        {data && data.total === 0 && (
          <Alert severity="info">
            No hay proveedores registrados todavía.
          </Alert>
        )}

        {data && data.total > 0 && (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                title="Total"
                value={data.total}
                icon={<PeopleIcon />}
                color="#1d4ed8"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                title="Activos"
                value={data.active}
                icon={<CheckCircleIcon />}
                color="#16a34a"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                title="Inactivos"
                value={data.inactive}
                icon={<CancelIcon />}
                color="#dc2626"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                title="Personas físicas"
                value={data.personaFisica}
                icon={<PersonIcon />}
                color="#ca8a04"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                title="Personas morales"
                value={data.personaMoral}
                icon={<BusinessIcon />}
                color="#7c3aed"
              />
            </Grid>
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
