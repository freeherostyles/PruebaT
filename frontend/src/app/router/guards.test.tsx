import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PublicRoute, PrivateRoute } from './guards';
import { useAuthStore } from '../../features/auth/store/auth.store';

describe('PublicRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isRestoring: false,
    });
  });

  it('renders children when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<div>login page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('redirects to dashboard when authenticated', () => {
    useAuthStore.setState({
      token: 'x',
      user: { id: '1', fullName: 'A', email: 'a@a.com', role: 'ADMIN' },
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<div>login page</div>} />
          </Route>
          <Route path="/dashboard" element={<div>dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('dashboard')).toBeInTheDocument();
  });
});

describe('PrivateRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isRestoring: false,
    });
  });

  it('renders children when authenticated', () => {
    useAuthStore.setState({
      token: 'x',
      user: { id: '1', fullName: 'A', email: 'a@a.com', role: 'ADMIN' },
      isAuthenticated: true,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<div>dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('dashboard')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<div>dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>login page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('login page')).toBeInTheDocument();
  });
});
