import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './auth.store';

describe('auth.store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isRestoring: false,
    });
  });

  it('stores session on login', () => {
    const store = useAuthStore.getState();
    store.login('test-token', {
      id: '1',
      fullName: 'Test',
      email: 'test@test.com',
      role: 'ADMIN',
    });

    const state = useAuthStore.getState();
    expect(state.token).toBe('test-token');
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.fullName).toBe('Test');
  });

  it('clears session on logout', () => {
    const store = useAuthStore.getState();
    store.login('test-token', {
      id: '1',
      fullName: 'Test',
      email: 'test@test.com',
      role: 'ADMIN',
    });
    store.logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
