import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { CryptoModel } from '../../models/Crypto';

process.env.NODE_CONFIG_STRICT_MODE = 'false';

describe('Tests d\'intégration API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    const db = mongoose.connection.db;
    if (db) {
      await db.collection('users').deleteMany({});
      await db.collection('cryptos').deleteMany({});
      await db.collection('marketsnapshots').deleteMany({});
    }
  });

  it('GET / renvoie le message de base', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.base).toBe('/api');
  });

  it('POST /api/auth/register puis /api/auth/login', async () => {
    const reg = await request(app).post('/api/auth/register').send({ email: 'it@test.com', username: 'userit', password: 'pass1234' });
    expect(reg.status).toBe(201);

    const login = await request(app).post('/api/auth/login').send({ email: 'it@test.com', password: 'pass1234' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });

  it('GET /api/cryptos/api liste les cryptos insérées', async () => {
    await CryptoModel.create([
      { coingeckoId: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
      { coingeckoId: 'ethereum', name: 'Ethereum', symbol: 'ETH' }
    ]);

    const res = await request(app).get('/api/cryptos/api');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });
});
