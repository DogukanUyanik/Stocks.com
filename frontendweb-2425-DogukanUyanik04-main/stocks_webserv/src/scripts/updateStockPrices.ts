import { prisma } from "../data";  

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

export async function updateStockPrices() {
  try {
    const updatePromises = stocks.map(async (stock) => {
      const newPrice = generateStockPrice(stock.min, stock.max);

      await prisma.aandeel.updateMany({
        where: { afkorting: stock.symbol },  
        data: { prijs: newPrice },           
      });

      console.log(`Updated ${stock.name} (${stock.symbol}) to $${newPrice}`);
    });

    await Promise.all(updatePromises);  
  } catch (error) {
    console.error("Error updating stock prices:", error);
  }
}

setInterval(updateStockPrices, 5 * 1000);  // price updates every 5 seconds
