import { PrismaClient } from "@prisma/client";
import { generateStockData } from "../scripts/generateStockData";  
import { updateStockPrices } from "../scripts/updateStockPrices"; 
import { hashPassword } from "../core/password";

import Role from '../core/roles';

const prisma = new PrismaClient();

async function main() {
    const market = await prisma.markt.upsert({
      where: { id: 1 },  
      update: {},  
      create: {
        naam: "NASDAQ",  
        valuta: "USD",  
      },
    });
    

  console.log(`Market created or found with ID: ${market.id}`);

  await generateStockData(market.id);  
  
  await updateStockPrices();  
  
  const passwordHash = await hashPassword('12345678');
  await prisma.gebruiker.createMany({
    data: [
      {
        id: 1,
        naam: "janedoe",
        email: "jane@example.com",
        balans: 5000.0,
        password_hash: passwordHash,
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
      },
      {
        id: 2,
        naam: "johndoe",
        email: "john@example.com",
        balans: 1200.0,
        password_hash: passwordHash,
        roles: JSON.stringify([Role.USER]),
      },
      {
        id: 3,
        naam: "mariecurie",
        email: "marie@example.com",
        balans: 7500.5,
        password_hash: passwordHash,
        roles: JSON.stringify([Role.USER]),
      },
    ],
    skipDuplicates: true,  
  });

  console.log("Users created or found");

  await prisma.transactie.createMany({
    data: [
      {
        gebruikerId: 1,  
        aandeelId: 1,    
        hoeveelheid: 10,
        prijstransactie: 150,
        soorttransactie: "buy",
        datum: new Date(2023, 9, 12),
      },
      {
        gebruikerId: 2,
        aandeelId: 2,
        hoeveelheid: 5,
        prijstransactie: 200,
        soorttransactie: "sell",
        datum: new Date(2023, 9, 13),
      },
      {
        gebruikerId: 1,
        aandeelId: 3,
        hoeveelheid: 20,
        prijstransactie: 300,
        soorttransactie: "buy",
        datum: new Date(2023, 9, 14),
      },
    ],
    skipDuplicates: true,  
  });

  console.log("Transactions created or found");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
