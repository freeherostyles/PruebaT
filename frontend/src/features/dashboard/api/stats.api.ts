import { axiosClient } from '../../../shared/api/axios-client';
import type { SupplierStats } from '../types/stats';

export async function getSupplierStatsApi() {
  const response = await axiosClient.get<SupplierStats>('/suppliers/stats');
  return response.data;
}
