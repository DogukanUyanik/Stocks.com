import supertest from 'supertest';
import type { Server } from '../../src/createServer';
import createServer from '../../src/createServer';
import { prisma } from '../../src/data';
import { hashPassword } from '../../src/core/password';
import roles from '../../src/core/roles';

export default function withServer(setter: (s: supertest.Agent) => void): void {
  let server: Server;

  beforeAll(async () => {
    server = await createServer();

    const passwordHash = await hashPassword('12345678');
    await prisma.gebruiker.create({
      data: {
        id: 1,
        naam: 'Test User',
        email: 'test.user@hogent.be',
        password_hash: passwordHash,
        roles: JSON.stringify([roles.USER]),
      },
    });
    
    await prisma.gebruiker.create({
      data: {
        id: 2,
        naam: 'Admin User',
        email: 'admin.user@hogent.be',
        password_hash: passwordHash,
        roles: JSON.stringify([roles.ADMIN, roles.USER]),
      },
    });

    setter(supertest(server.getApp().callback()));
  });

  afterAll(async () => {
    await prisma.transactie.deleteMany();
    await prisma.gebruiker.deleteMany();
    await prisma.aandeel.deleteMany();
    await prisma.markt.deleteMany();

    await server.stop();
  });
}
