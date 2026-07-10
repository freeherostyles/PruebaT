import { axiosClient } from '../../../shared/api/axios-client';
import type { HealthResponse } from '../types/health';

export async function getHealthStatus() {
  const response = await axiosClient.get<HealthResponse>('/health');
  return response.data;
}
