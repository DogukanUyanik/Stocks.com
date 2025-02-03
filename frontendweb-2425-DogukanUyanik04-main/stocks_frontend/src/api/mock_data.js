import { faker } from '@faker-js/faker';
//extra technologie


export const GEBRUIKERS = Array.from({ length: 10 }).map((_, index) => ({
  id: index + 1,
  gebruikersnaam: faker.internet.username(),
  email: faker.internet.email(),
  wachtwoord: faker.internet.password(),
  balans: faker.finance.amount(1000, 10000, 2), 
}));

export const TRANSACTIES = Array.from({ length: 20 }).map((_, index) => ({
  id: index + 1,
  gebruikerId: faker.number.int({ min: 1, max: 10 }),  
  aandeelId: faker.number.int({ min: 1, max: 3 }), 
  hoeveelheid: faker.number.int({ min: 1, max: 50 }), 
  prijstransactie: faker.finance.amount(50, 500, 2), 
  soorttransactie: faker.helpers.arrayElement(["buy", "sell"]), 
  datum: faker.date.past().toISOString().split('T')[0], 
}));

export const AANDELEN = [
  { id: 1, afkorting: "AAPL", bedrijfsnaam: "Apple Inc.", huidigeprijs: parseFloat(faker.finance.amount(100, 2000, 2)), marktId: 1 },
  { id: 2, afkorting: "GOOGL", bedrijfsnaam: "Alphabet Inc.", huidigeprijs: parseFloat(faker.finance.amount(100, 2000, 2)), marktId: 1 },
  { id: 3, afkorting: "TSLA", bedrijfsnaam: "Tesla Inc.", huidigeprijs: parseFloat(faker.finance.amount(100, 2000, 2)), marktId: 1 },
  { id: 4, afkorting: "AMZN", bedrijfsnaam: "Amazon", huidigeprijs: parseFloat(faker.finance.amount(3000, 4000, 2)), marktId: 1 },
  { id: 5, afkorting: "MSFT", bedrijfsnaam: "Microsoft", huidigeprijs: parseFloat(faker.finance.amount(200, 300, 2)), marktId: 1 },
].map(stock => {
  const percentageChange = parseFloat((Math.random() * (5 - (-5)) + (-5)).toFixed(2)); // Random percentage between -5% and +5%
  return { ...stock, percentageChange };
});



export const MARKTEN = [
  { id: 1, naam: "NASDAQ", valuta: "USD" },
  { id: 2, naam: "NYSE", valuta: "USD" },
];
