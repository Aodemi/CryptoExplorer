import mongoose from 'mongoose';
import { register, login } from '../controllers/auth.controller';
import { Request, Response } from 'express';
import { UserModel } from '../models/User';

describe('Auth Controller', () => {
	beforeAll(async () => {
		await mongoose.connect('mongodb://localhost:27017/testdb');
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	beforeEach(async () => {
		if (mongoose.connection.db) {
			const collections = await mongoose.connection.db.collections();
			for (const collection of collections) {
				await collection.deleteMany({});
			}
		}
	});

	it("inscrit un utilisateur avec succès", async () => {
		const req = {
			body: { email: 'user1@test.com', username: 'user1', password: 'pwd12345' }
		} as unknown as Request;
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		} as any as Response;

		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(201);
		const payload = (res.json as jest.Mock).mock.calls[0][0];
		expect(payload.token).toBeDefined();
		expect(payload.user.email).toBe('user1@test.com');

		const inDb = await UserModel.findOne({ email: 'user1@test.com' });
		expect(inDb).toBeTruthy();
	});

	it("refuse un email déjà utilisé (409)", async () => {
		await UserModel.create({ email: 'dup@test.com', username: 'dup', passwordHash: 'hash' });

		const req = {
			body: { email: 'dup@test.com', username: 'userx', password: 'pwd' }
		} as unknown as Request;
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		} as any as Response;

		await register(req, res);
		expect(res.status).toHaveBeenCalledWith(409);
	});

	it("connecte un utilisateur avec succès", async () => {
		// inscription préalable
		const regReq = { body: { email: 'login@test.com', username: 'loginux', password: 'pwdaaa' } } as any;
		const regRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
		await register(regReq, regRes);

		const req = { body: { email: 'login@test.com', password: 'pwdaaa' } } as unknown as Request;
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;

		await login(req, res);

		expect(res.status).not.toHaveBeenCalledWith(401);
		const payload = (res.json as jest.Mock).mock.calls[0][0];
		expect(payload.token).toBeDefined();
		expect(payload.user.username).toBe('loginux');
	});

	it("refuse une connexion avec mauvais mot de passe", async () => {
		const regReq = { body: { email: 'badpwd@test.com', username: 'xxx', password: 'good' } } as any;
		const regRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
		await register(regReq, regRes);

		const req = { body: { email: 'badpwd@test.com', password: 'wrong' } } as any;
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

		await login(req as Request, res as Response);
		expect(res.status).toHaveBeenCalledWith(401);
	});
});
