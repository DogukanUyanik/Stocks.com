import type { Agent } from 'supertest';
import { prisma } from '../../src/data';
import withServer from '../helpers/withServer';
import Role from '../../src/core/roles';
import { hashPassword } from '../../src/core/password';

describe('Sessions', () => {
  let supertest: Agent;

  withServer((s) => supertest = s);  

  describe('POST /api/sessions', () => {
    const url = '/api/sessions';

    beforeAll(async () => {
      const passwordHash = await hashPassword('12345678');
      await prisma.gebruiker.create({
        data: {
          id: 3,
          naam: 'Login User',
          email: 'login@hogent.be',
          password_hash: passwordHash,
          roles: JSON.stringify([Role.USER]),
        },
      });
    });

    afterAll(async () => {
      await prisma.gebruiker.delete({ where: { id: 3 } });
    });

    it('should 200 and return the token when successfully logged in', async () => {
      const response = await supertest.post(url)
        .send({
          email: 'login@hogent.be',
          wachtwoord: '12345678',  
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeTruthy();
      expect(response.body.user.id).toBe(3);  
    });

    it('should 401 with wrong email', async () => {
      const response = await supertest.post(url)
        .send({
          email: 'invalid@hogent.be',
          wachtwoord: '12345678910112',
        });

      expect(response.statusCode).toBe(401);
      expect(response.body).toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'The given email and password do not match',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 401 with wrong password', async () => {
      const response = await supertest.post(url)
        .send({
          email: 'login@hogent.be',
          wachtwoord: 'invalidpassword',
        });

      expect(response.statusCode).toBe(401);
      expect(response.body).toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'The given email and password do not match',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid email', async () => {
      const response = await supertest.post(url)
        .send({
          email: 'invalid',
          wachtwoord: '12345678',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('email');
    });

    it('should 400 when no password given', async () => {
      const response = await supertest.post(url)
        .send({ email: 'login@hogent.be' });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('wachtwoord');
    });

    it('should 400 when no email given', async () => {
      const response = await supertest.post(url)
        .send({ wachtwoord: '12345678' });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('email');
    });
  });
});
