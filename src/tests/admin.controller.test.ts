import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/User';
import {
    createAdminUser,
    usersList,
    deleteUser,
    modifyUserRole
} from '../controllers/admin.controller';


const mongoose = require('mongoose');
describe('Gestion des utilisateurs ', () => {


    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb');
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });
    beforeEach(async () => {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    });

    it('Créer un utilisateur admin', async () => {
        const req = {
            body: { email: 'admin@test.com', username: 'admin', password: 'admin123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createAdminUser(req as unknown as Request, res as unknown as Response);
        expect(res.status).toHaveBeenCalledWith(201);

        const User = UserModel;
        const adminUser = await User.findOne({ email: 'admin@test.com' });

        expect(adminUser!.username).toBe('admin');
        expect(adminUser).toBeTruthy();
    });

    it('Lister les utilisateurs', async () => {
        const User = UserModel;
        await User.create({ email: 'user@test.com', username: 'user', passwordHash: 'hashed', role: 'user' });
        const req = {};
        const res = {
            json: jest.fn()
        };
        await usersList(req as unknown as Request, res as unknown as Response);
        const users = res.json.mock.calls[0][0];
        expect(users.length).toBeGreaterThan(0);
        expect(users[0].email).toBe('user@test.com');
    });

    it('Supprimer un utilisateur', async () => {
        const User = UserModel;
        const user = await User.create({ email: 'deleting@test.com', username: 'delete', passwordHash: 'hashed', role: 'user' });
        const req = { params: { id: user._id.toString() } };
        const res = {
            json: jest.fn()
        };
        await deleteUser(req as unknown as Request, res as unknown as Response);
        expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur supprimé avec succès' });
        const deletedUser = await User.findById(user._id);
        expect(deletedUser).toBeNull();
    });

    it('Modifier le rôle dun utilisateur', async () => {
        const User = UserModel;
        const user = await User.create({ email: 'modifying@test.com', username: 'modify', passwordHash: 'hashed', role: 'user' });
        const req = { params: { id: user._id.toString() }, body: { role: 'admin' } };
        const res = {
            json: jest.fn()
        };
        await modifyUserRole(req as unknown as Request, res as unknown as Response);
        const modifiedUser = await User.findById(user._id);
        expect(modifiedUser!.role).toBe('admin');
    });
    
});


