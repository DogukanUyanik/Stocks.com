import supertest from 'supertest';
import { prisma } from '../../src/data';
import withServer from '../helpers/withServer';

describe('Aandeel REST Layer Tests', () => {
  let request: supertest.Agent;

  withServer((r) => (request = r));

  const url = '/api/aandelen';

  describe('GET /api/aandelen', () => {
    it('should return all aandelen', async () => {
      const response = await request.get(url);
      expect(response.statusCode).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    });

    it('should return 200 when no authorization token is provided', async () => {
      const response = await request.get(url);
      expect(response.statusCode).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    });

    it('should return 200 when invalid authorization token is provided', async () => {
      const response = await request
        .get(url)
        .set('Authorization', 'INVALID TOKEN');
      expect(response.statusCode).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
    });

  });




  describe('GET /api/aandelen/:id', () => {
    it('should return an aandeel by its id', async () => {

      const markt = await prisma.markt.create({
        data: {
          id: 1,
          naam: 'Test Market',
          valuta: 'USD'
        },
      });
      
      const aandeel = await prisma.aandeel.create({
        data: {
          naam: 'Test Aandeel',
          afkorting: 'TA',
          prijs: 100,
          marktId: markt.id,
        },
      });

      const response = await request.get(`${url}/${aandeel.id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.naam).toBe(aandeel.naam);
      expect(response.body.afkorting).toBe(aandeel.afkorting);
    });

    it('should return 404 if aandeel does not exist', async () => {
      const response = await request.get(`${url}/999999`); // Non-existent ID
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('No stock found with this ID: 999999');
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request.get(`${url}/invalid-id`); // Invalid ID
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Validation failed, check details for more information');
    });
  });

  describe('GET /api/aandelen/name/:name', () => {
    it('should return aandelen by name', async () => {
      const aandeel = await prisma.aandeel.create({
        data: {
          naam: 'Test Aandeel',
          afkorting: 'TA',
          prijs: 100,
          marktId: 1,
        },
      });

      const response = await request.get(`${url}/name/${aandeel.naam}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items[0].naam).toBe(aandeel.naam);
    });

    it('should return 404 if no aandelen with the given name exist', async () => {
      const response = await request.get(`${url}/name/NonExistentName`);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('No stocks found with the name: NonExistentName');
    });

    it('should return 400 if name is invalid', async () => {
      const response = await request.get(`${url}/name/`); 
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Validation failed, check details for more information');
    });
  });
});
