import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateStockPrice(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

const stocks = [
  { symbol: 'AAPL', name: 'Apple', min: 100, max: 200 },
  { symbol: 'TSLA', name: 'Tesla', min: 300, max: 600 },
  { symbol: 'GOOG', name: 'Google', min: 1000, max: 2000 },
  { symbol: 'AMZN', name: 'Amazon', min: 1500, max: 3500 },
  { symbol: 'MSFT', name: 'Microsoft', min: 150, max: 300 }
];

async function generateStockData(marketId: number) {  
  for (const stock of stocks) {
    const price = generateStockPrice(stock.min, stock.max);

    await prisma.aandeel.create({
      data: {
        afkorting: stock.symbol,
        naam: stock.name,
        prijs: price,
        marktId: marketId,  
      },
    });
    console.log(`Inserted ${stock.name} (${stock.symbol}) with price $${price}`);
  }

  console.log("Stock seeding completed!");
}

export { generateStockData };
