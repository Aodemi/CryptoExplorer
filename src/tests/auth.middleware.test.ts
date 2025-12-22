import { Request, Response, NextFunction } from 'express';
import { authRequired } from '../middlewares/auth';
import { signToken } from '../utils/jwt';

describe('Middleware authRequired', () => {
  it('renvoie 401 sans token', () => {
    const req = { headers: {} } as any as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
    const next = jest.fn() as NextFunction;

    authRequired(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('renvoie 401 pour token invalide', () => {
    const req = { headers: { authorization: 'Bearer invalid.token' } } as any as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
    const next = jest.fn() as NextFunction;

    authRequired(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('accepte un token valide et appelle next', () => {
    const token = signToken({ userId: 'abc', role: 'user' });
    const req = { headers: { authorization: `Bearer ${token}` } } as any as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
    const next = jest.fn() as NextFunction;

    authRequired(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as any).user.userId).toBe('abc');
  });
});
