import type supertest from 'supertest';
import { prisma } from '../../src/data';
import withServer from '../helpers/withServer';
import { login, loginAdmin } from '../helpers/login';
import testAuthHeader from '../helpers/testAuthHeader';


describe('Testgebruiker', () => {
  let request: supertest.Agent;
  let authHeader: string;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/gebruikers';

  describe('GET /api/gebruikers', () => {
    it('should 200 and return all users for an admin', async () => {
      const response = await request
        .get(url)
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBeGreaterThan(0); 
    });

    it('should 403 when not an admin', async () => {
      const response = await request
        .get(url)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this part of the application',
      });
    });

    testAuthHeader(() => request.get(url));
  });


  describe('GET /api/gebruikers/:id', () => {

    it('should 200 and return the requested user', async () => {

      const response = await request
        .get(`${url}/1`)
        .set('Authorization', authHeader);


  
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        naam: 'Test User',
      });
    });
  
    it('should 200 and return my user info when passing "me" as id', async () => {
      const response = await request
        .get(`${url}/me`)
        .set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        naam: 'Test User',
      });
    });
  
    it('should 403 when not an admin and not own user id', async () => {
      const response = await request
        .get(`${url}/2`)
        .set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this user\'s information',
      });
    });
  
    it('should 200 when admin accesses another user\'s data', async () => {
      const response = await request
        .get(`${url}/2`)
        .set('Authorization', adminAuthHeader);

  
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(2); 
    });
  

    it('should return 404 if user does not exist', async () => {
      const response = await request
        .get(`${url}/9999`) 
        .set('Authorization', adminAuthHeader);
  
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No user with this id exists.',
      });
    });
  
  
    testAuthHeader(() => request.get(`${url}/1`)); 
  
  });

  describe('GET /api/gebruikers/user/stocks', () => {
    const stocksUrl = '/api/gebruikers/user/stocks';
  
    it('should 200 and return the user\'s stocks', async () => {
      const response = await request
        .get(stocksUrl)
        .set('Authorization', authHeader);
    
      expect(response.statusCode).toBe(200);
    
      expect(response.body).toBeInstanceOf(Object);
    
      Object.keys(response.body).forEach((aandeelId: string) => {
        const stock = response.body[aandeelId];
        expect(stock).toHaveProperty('hoeveelheid');
      });
    });
  
    it('should 401 when not authenticated', async () => {
      const response = await request.get(stocksUrl);
  
      expect(response.statusCode).toBe(401);
      expect(response.body).toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'You need to be signed in',
      });
    });
  
    testAuthHeader(() => request.get(stocksUrl));
  });
  


  describe('GET /api/gebruikers/:id/portfolio', () => {
    const portfolioUrl = (id: string | number) => `${url}/${id}/portfolio`;
 
    it('should 200 when the user portfolio is empty', async () => {
      const userId = 253;
      const response = await request
        .get(portfolioUrl(userId)) 
        .set('Authorization', adminAuthHeader); 
    
      expect(response.statusCode).toBe(200);
    
      expect(response.body).toMatchObject({
        portfolio: {},
      });
    });
    
  
    it('should 400 for an invalid ID', async () => {
      const response = await request
        .get(portfolioUrl('invalid_id')) 
        .set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'Validation failed, check details for more information',
      });
    });
  
    testAuthHeader(() => request.get(portfolioUrl(1)));
  });
  
  

  describe('POST /api/gebruikers', () => {
    afterAll(async () => {
      await prisma.gebruiker.deleteMany({
        where: {
          email: 'new.user@hogent.be',
        },
      });
    });
  
    it(
      'should 200 and return the registered user',
      async () => {
        const response = await request
          .post(url)
          .send({
            naam: 'New User',
            email: 'new.user@hogent.be',
            wachtwoord: '123456789101112',
          })
          .set('Authorization', authHeader);
  
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.naam).toBe('New User');
      },
      10000, // Timeout set to 10 seconds
    );
  });

  describe('GET /api/gebruikers/leaderboardpagina', () => {
    const leaderboardUrl = '/api/gebruikers/leaderboardpagina';
  
    it('should 200 and return leaderboard data without authentication', async () => {
      const response = await request
        .get(leaderboardUrl);
  
      expect(response.statusCode).toBe(200);  
      expect(response.body.items).toBeInstanceOf(Array);  
      expect(response.body.items.length).toBeGreaterThan(0);  
    });
  
    it('should 200 and return leaderboard data with invalid authentication token', async () => {
      const response = await request
        .get(leaderboardUrl)
        .set('Authorization', 'InvalidToken');  
  
      expect(response.statusCode).toBe(200);  
      expect(response.body.items).toBeInstanceOf(Array);  
      expect(response.body.items.length).toBeGreaterThan(0);  
    });
  
    it('should 200 and return leaderboard data with valid auth token', async () => {
      const response = await request
        .get(leaderboardUrl)
        .set('Authorization', `Bearer ${authHeader}`);  
  
      expect(response.statusCode).toBe(200);  
      expect(response.body.items).toBeInstanceOf(Array);  
      expect(response.body.items.length).toBeGreaterThan(0);  
    });
  });
  
  
  

  describe('PUT /api/gebruikers/:id', () => {
    it('should 200 and return the updated user', async () => {
      const response = await request
        .put(`${url}/1`)
        .send({
          naam: 'Updated User',
          email: 'updated.user@hogent.be',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        naam: 'Updated User',
        email: 'updated.user@hogent.be',
      });
    });

    it('should 403 when not an admin and not own user id', async () => {
      const response = await request
        .put(`${url}/2`)
        .send({
          naam: 'Updated User',
          email: 'updated.user@hogent.be',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this user\'s information',
      });
    });

    testAuthHeader(() => request.put(`${url}/1`));
  });

  describe('DELETE /api/gebruikers/:id', () => {
    it('should 204 and return nothing', async () => {
      const response = await request
        .delete(`${url}/2`)
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(204);
    });

    it('should 403 when not an admin', async () => {
      const response = await request
        .delete(`${url}/2`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: "You are not allowed to view this user's information",
      });
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });

  describe('GET /api/gebruikers/:id/balance', () => {
    it('should 200 and return the user balance', async () => {
      const response = await request
        .get(`${url}/1/balance`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('balance');
    });
  });

  describe('GET /api/gebruikers/:id/transacties', () => {
    it('should 200 and return user transactions', async () => {
      const response = await request
        .get(`${url}/1/transacties`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('transacties');
    });
  });
});
