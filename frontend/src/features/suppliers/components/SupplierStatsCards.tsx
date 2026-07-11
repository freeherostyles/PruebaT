import { Box, Card, CardContent, Grid, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import type { SupplierStats } from '../types/supplier';

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

function StatCardSkeleton() {
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Skeleton variant="rounded" width={48} height={48} />
          <Stack spacing={0.5}>
            <Skeleton variant="text" width={60} height={32} />
            <Skeleton variant="text" width={100} height={20} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

type StatColor = 'primary' | 'success' | 'error' | 'warning' | 'secondary';

const STATS_CONFIG: {
  key: keyof SupplierStats;
  title: string;
  icon: React.ReactNode;
  colorKey: StatColor;
}[] = [
  { key: 'total', title: 'Total', icon: <PeopleIcon />, colorKey: 'primary' },
  { key: 'active', title: 'Activos', icon: <CheckCircleIcon />, colorKey: 'success' },
  { key: 'inactive', title: 'Inactivos', icon: <CancelIcon />, colorKey: 'error' },
  { key: 'personaFisica', title: 'Personas físicas', icon: <PersonIcon />, colorKey: 'warning' },
  { key: 'personaMoral', title: 'Personas morales', icon: <BusinessIcon />, colorKey: 'secondary' },
];

interface SupplierStatsCardsProps {
  data?: SupplierStats;
  isLoading: boolean;
}

export function SupplierStatsCards({ data, isLoading }: SupplierStatsCardsProps) {
  const theme = useTheme();

  const resolveColor = (colorKey: StatColor): string => {
    return theme.palette[colorKey].main;
  };

  if (isLoading) {
    return (
      <Grid container spacing={2.5}>
        {STATS_CONFIG.map((stat) => (
          <Grid key={stat.key} size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!data) return null;

  return (
    <Grid container spacing={2.5}>
      {STATS_CONFIG.map((stat) => (
        <Grid key={stat.key} size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title={stat.title}
            value={data[stat.key]}
            icon={stat.icon}
            color={resolveColor(stat.colorKey)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
