import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../modules/users/user-role.enum';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let reflector: jest.Mocked<Reflector>;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    guard = new RolesGuard(reflector);
  });

  function createContext(role?: UserRole): ExecutionContext {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: role ? { role } : undefined,
        }),
      }),
    } as unknown as ExecutionContext;
  }

  it('allows access when no roles are declared', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('allows ADMIN on an ADMIN route', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);

    expect(guard.canActivate(createContext(UserRole.ADMIN))).toBe(true);
  });

  it('rejects EXECUTIVE on an ADMIN route', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);

    expect(guard.canActivate(createContext(UserRole.EXECUTIVE))).toBe(false);
  });

  it('allows EXECUTIVE on a route that accepts ADMIN or EXECUTIVE', () => {
    reflector.getAllAndOverride.mockReturnValue([
      UserRole.ADMIN,
      UserRole.EXECUTIVE,
    ]);

    expect(guard.canActivate(createContext(UserRole.EXECUTIVE))).toBe(true);
  });

  it('returns false when the role is not authorized', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.EXECUTIVE]);

    expect(guard.canActivate(createContext(UserRole.ADMIN))).toBe(false);
  });
});
