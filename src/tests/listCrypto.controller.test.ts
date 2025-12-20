import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CryptoModel } from '../models/Crypto';
import { listCryptos } from '../controllers/crypto.controller';
import { describe } from 'node:test';


describe('Liste des cryptomonnaies', () => {

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb');
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });
    beforeEach(async () => {
        if (mongoose.connection.db) {
            await mongoose.connection.db.collection('cryptos').deleteMany({});
        }
    });

    it('Lister les cryptomonnaies', async () => {
        const Crypto = CryptoModel;
        await Crypto.create([
            { coingeckoId: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', marketCap: 800000000000 },
            { coingeckoId: 'ethereum', name: 'Ethereum', symbol: 'ETH', marketCap: 300000000000 }
        ]);

        const req = {};
        const res = {
            json: jest.fn()
        };
        await listCryptos(req as unknown as Request, res as unknown as Response);
        const response = res.json.mock.calls[0][0];
        expect(response.count).toBe(2);
        expect(response.data[0].name).toBe('Bitcoin');
        expect(response.data[1].name).toBe('Ethereum');
    });
});