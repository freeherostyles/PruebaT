import { useQuery } from '@tanstack/react-query';
import { getProfileApi } from '../api/auth.api';

export function useProfile(enabled: boolean) {
  return useQuery({
    queryKey: ['auth-profile'],
    queryFn: getProfileApi,
    enabled,
    retry: false,
  });
}
