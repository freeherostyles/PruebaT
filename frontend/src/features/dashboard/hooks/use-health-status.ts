import { useQuery } from '@tanstack/react-query';
import { getHealthStatus } from '../api/health.api';

export function useHealthStatus() {
  return useQuery({
    queryKey: ['health-status'],
    queryFn: getHealthStatus,
    refetchInterval: 15000,
  });
}
