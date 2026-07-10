import { axiosClient } from '../../../shared/api/axios-client';
import type { LoginRequest, LoginResponse, AuthProfileResponse } from '../types/auth';

export async function loginApi(data: LoginRequest) {
  const response = await axiosClient.post<LoginResponse>('/auth/login', data);
  return response.data;
}

export async function getProfileApi() {
  const response = await axiosClient.get<AuthProfileResponse>('/auth/profile');
  return response.data;
}
