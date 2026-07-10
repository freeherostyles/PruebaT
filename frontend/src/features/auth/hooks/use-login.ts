import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.accessToken, data.user);
      navigate('/dashboard', { replace: true });
    },
  });
}
