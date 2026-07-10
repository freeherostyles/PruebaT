import { axiosClient } from '../../../shared/api/axios-client';
import type {
  SupplierListResponse,
  SupplierStats,
  Supplier,
  CreateSupplierPayload,
  UpdateSupplierPayload,
  SupplierStatus,
} from '../types/supplier';

export async function getSuppliersApi(
  params: Record<string, string | number | undefined>,
): Promise<SupplierListResponse> {
  const cleanParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      cleanParams[key] = String(value);
    }
  }
  const { data } = await axiosClient.get<SupplierListResponse>('/suppliers', {
    params: cleanParams,
  });
  return data;
}

export async function getSupplierStatsApi(): Promise<SupplierStats> {
  const { data } = await axiosClient.get<SupplierStats>('/suppliers/stats');
  return data;
}

export async function getSupplierByIdApi(id: string): Promise<Supplier> {
  const { data } = await axiosClient.get<Supplier>(`/suppliers/${id}`);
  return data;
}

export async function createSupplierApi(
  payload: CreateSupplierPayload,
): Promise<Supplier> {
  const { data } = await axiosClient.post<Supplier>('/suppliers', payload);
  return data;
}

export async function updateSupplierApi(
  id: string,
  payload: UpdateSupplierPayload,
): Promise<Supplier> {
  const { data } = await axiosClient.patch<Supplier>(
    `/suppliers/${id}`,
    payload,
  );
  return data;
}

export async function deleteSupplierApi(id: string): Promise<void> {
  await axiosClient.delete(`/suppliers/${id}`);
}

export async function changeSupplierStatusApi(
  id: string,
  status: SupplierStatus,
): Promise<Supplier> {
  const { data } = await axiosClient.patch<Supplier>(
    `/suppliers/${id}/status`,
    { status },
  );
  return data;
}
