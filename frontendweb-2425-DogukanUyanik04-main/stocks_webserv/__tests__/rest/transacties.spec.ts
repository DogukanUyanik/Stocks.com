import type supertest from 'supertest';
import { prisma } from '../../src/data';
import withServer from '../helpers/withServer';
import { login, loginAdmin } from '../helpers/login';
import testAuthHeader from '../helpers/testAuthHeader';

const data = {
  gebruikerId: 1,
  transacties: [
    {
      id: 1,
      gebruikerId: 1,
      aandeelId: 1,
      hoeveelheid: 10,
      soorttransactie: 'buy',
      prijstransactie: 50,
      datum: new Date(2024, 11, 15, 9, 30),
    },
    {
      id: 2,
      gebruikerId: 2,
      aandeelId: 2,
      hoeveelheid: 5,
      soorttransactie: 'sell',
      prijstransactie: 540,
      datum: new Date(2024, 11, 15, 11, 30),
    },
    {
      id: 3,
      gebruikerId: 1,
      aandeelId: 3,
      hoeveelheid: 15,
      soorttransactie: 'buy',
      prijstransactie: 150,
      datum: new Date(2024, 11, 15, 14, 0),
    },
  ],
  aandelen: [
    { id: 1, naam: 'Stock A', prijs: 50, afkorting: 'A1', marktId: 1 },
    { id: 2, naam: 'Stock B', prijs: 100, afkorting: 'A2', marktId: 1 },
    { id: 3, naam: 'Stock C', prijs: 150, afkorting: 'A3', marktId: 1 },
  ],
  markt: [
    {id: 1, naam: 'Test Market', valuta: "USD"},
  ],
};

const dataToDelete = {
  transacties: [1, 2, 3],
  aandelen: [1, 2, 3],
  markt: [1],
};

describe('Transacties API', () => {
  let request: supertest.Agent;
  let authHeader: string;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/transacties';

  describe('GET /transacties', () => {
    beforeAll(async () => {
      await prisma.markt.createMany({data: data.markt});
      await prisma.aandeel.createMany({ data: data.aandelen });
      await prisma.transactie.createMany({ data: data.transacties });
    });

    afterAll(async () => {
      await prisma.transactie.deleteMany({ where: { id: { in: dataToDelete.transacties } } });
      await prisma.aandeel.deleteMany({ where: { id: { in: dataToDelete.aandelen } } });
      await prisma.markt.deleteMany({where: {id: {in: dataToDelete.markt}}});
    });

    it('should return all transactions for the signed in user', async () => {
      const response = await request.get(url).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);  
    });

    it('should return all transactions for the admin user', async () => {
      const response = await request.get(url).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(3);  
    });

    it('should return 400 for invalid query parameters', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization', authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    testAuthHeader(() => request.get(url));
  });



  describe('GET /transacties/:id', () => {
    beforeAll(async () => {
      await prisma.markt.createMany({data: data.markt});
      await prisma.aandeel.createMany({ data: data.aandelen });
      await prisma.transactie.createMany({ data: data.transacties });
    });

    afterAll(async () => {
      await prisma.transactie.deleteMany({ where: { id: { in: dataToDelete.transacties } } });
      await prisma.aandeel.deleteMany({ where: { id: { in: dataToDelete.aandelen } } });
      await prisma.markt.deleteMany({where: {id: {in: dataToDelete.markt}}});
    });

    it('should return the requested transaction for the signed in user', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(1);
    });

    it('should return 404 when requesting a non-existent transaction', async () => {
      const response = await request.get(`${url}/200`).set('Authorization', authHeader);
      expect(response.statusCode).toBe(404);
      expect(response.body.code).toBe('NOT_FOUND');
    });

    it('should return 404 when requesting a transaction not owned by the user', async () => {
      const response = await request.get(`${url}/2`).set('Authorization', authHeader);
      expect(response.statusCode).toBe(404);
      expect(response.body.code).toBe('NOT_FOUND');
    });

    it('should return 400 for invalid transaction id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });

    testAuthHeader(() => request.get(`${url}/1`));
  });


  describe('POST /transacties/buy', () => {
    const transactionsToDelete: number[] = [];

    beforeAll(async () => {
      await prisma.markt.createMany({data: data.markt});
      await prisma.aandeel.createMany({ data: data.aandelen });
      await prisma.transactie.createMany({ data: data.transacties });
    });

    afterAll(async () => {
      await prisma.transactie.deleteMany({ where: {} });
      await prisma.aandeel.deleteMany({ where: {} });
      await prisma.markt.deleteMany({where: {}});
    });

    it('should create a buy transaction and return it', async () => {
      const response = await request.post(`${url}/buy`).send({
        aandeelId: 1,
        hoeveelheid: 10,
      }).set('Authorization', authHeader);

      expect(response.status).toBe(201);
      expect(response.body.soorttransactie).toBe('buy');
      expect(response.body.gebruiker.id).toBe(1);
      transactionsToDelete.push(response.body.id);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request.post(`${url}/buy`).send({
        hoeveelheid: 10,
      }).set('Authorization', authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
  });

  describe('POST /transacties/sell', () => {
    const transactionsToDelete: number[] = [];
  
    beforeAll(async () => {
      await prisma.markt.createMany({ data: data.markt });
      await prisma.aandeel.createMany({ data: data.aandelen });
      await prisma.transactie.createMany({ data: data.transacties });
    });
  
    afterAll(async () => {
      await prisma.transactie.deleteMany({ where: {} });
      await prisma.aandeel.deleteMany({ where: {} });
      await prisma.markt.deleteMany({where: {}});
    });
  
    it('should create a sell transaction and return it', async () => {
      const response = await request.post(`${url}/sell`).send({
        aandeelId: 1,
        hoeveelheid: 5,
        gebruikerId: 1,
      }).set('Authorization', authHeader);

  
      expect(response.status).toBe(201);
      expect(response.body.soorttransactie).toBe('sell');
      expect(response.body.gebruiker.id).toBe(1);
      expect(response.body.prijstransactie).toBeGreaterThan(0);
      transactionsToDelete.push(response.body.id);
    });
  
    it('should return 400 for attempting to sell more than owned', async () => {
      const response = await request.post(`${url}/sell`).send({
        aandeelId: 1,
        hoeveelheid: 20, // Exceeds the user's holdings
      }).set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.message).toMatch("Validation failed, check details for more information");
    });
  
  
    it('should return 400 for invalid input data', async () => {
      const response = await request.post(`${url}/sell`).send({
        aandeelId: -1, // Invalid stock ID
        hoeveelheid: -5, // Invalid quantity
      }).set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
  
 
  });

});

