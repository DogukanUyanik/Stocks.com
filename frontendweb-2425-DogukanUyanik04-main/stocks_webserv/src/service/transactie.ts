import { prisma } from "../data";
import { TransactieCreateInput, StockHolding } from "../types/transactie";

import ServiceError from "../core/serviceError";
import handleDBError from "./_handleDBError";
import Role from "../core/roles";




export const getAllTransacties = async (userId: number, roles: string[]): Promise<any[]> => {
  try {
    const transacties = await prisma.transactie.findMany({
      where: roles.includes(Role.ADMIN) ? {} : { gebruikerId: userId }, 
      include: {
        gebruiker: {
          select: { id: true, naam: true },
        },
        aandeel: {
          select: { id: true, afkorting: true, naam: true, prijs: true },
        },
      },
    });
    return transacties;
  } catch (error) {
    handleDBError(error);
    throw error; 
  }
};


export const getTransactieById = async (id: number, userId: number, roles: string[]): Promise<any> => {
  try {
    const extraFilter = roles.includes(Role.ADMIN) ? {} : { gebruikerId: userId };

    const transactie = await prisma.transactie.findFirst({
      where: {
        id,
        ...extraFilter, 
      },
      include: {
        gebruiker: {
          select: {
            id: true,
            naam: true,
            email: true,
            balans: true,
          },
        },
        aandeel: {
          select: {
            id: true,
            afkorting: true,
            naam: true,
            prijs: true,
          },
        },
      },
    });

    if (!transactie) {
      throw ServiceError.notFound("No transaction with this id or access denied.");
    }

    return {
      id: transactie.id,
      datum: transactie.datum.toISOString(), 
      hoeveelheid: transactie.hoeveelheid,
      prijstransactie: transactie.prijstransactie,
      soorttransactie: transactie.soorttransactie,
      gebruiker: {
        id: transactie.gebruiker.id,
        naam: transactie.gebruiker.naam,
        email: transactie.gebruiker.email,
        balans: transactie.gebruiker.balans,
      },
      aandeel: { 
        id: transactie.aandeel.id,
        afkorting: transactie.aandeel.afkorting,
        naam: transactie.aandeel.naam,
        prijs: transactie.aandeel.prijs,
      },
    };
  } catch (error) {
    handleDBError(error);
    throw error;
  }
};


export const getUserStocks = async (userId: number): Promise<{ [key: number]: StockHolding }> => {
  try {
    const transacties = await prisma.transactie.findMany({
      where: {
        gebruikerId: userId,
      },
      select: {
        aandeelId: true,
        hoeveelheid: true,
        soorttransactie: true,
      },
    });

    const stockHoldings: { [key: number]: StockHolding } = {};

    transacties.forEach((transactie) => {
      if (!stockHoldings[transactie.aandeelId]) {
        stockHoldings[transactie.aandeelId] = { hoeveelheid: 0 };
      }
      
      const stock = stockHoldings[transactie.aandeelId] as StockHolding;

      if (transactie.soorttransactie === 'buy') {
        stock.hoeveelheid += transactie.hoeveelheid;
      } else if (transactie.soorttransactie === 'sell') {
        stock.hoeveelheid -= transactie.hoeveelheid;
      }
    });

    return stockHoldings;
  } catch (error) {
    throw new Error("Error fetching user stocks: " + error);
  }
};








export const buyTransaction = async (
  transactieData: TransactieCreateInput
): Promise<any> => {
  try {
    const aandeel = await prisma.aandeel.findUnique({
      where: { id: transactieData.aandeelId },
      select: { prijs: true },
    });

    if (!aandeel) {
      throw ServiceError.notFound('Stock not found');
    }

    const prijstransactie = aandeel.prijs * transactieData.hoeveelheid;

    const gebruiker = await prisma.gebruiker.findUnique({
      where: { id: transactieData.gebruikerId },
    });

    if (!gebruiker) {
      throw ServiceError.notFound('User not found');
    }

    if (gebruiker.balans < prijstransactie) {
      throw ServiceError.validationFailed('Insufficient balance to complete the transaction');
    }

    const updatedGebruiker = await prisma.gebruiker.update({
      where: { id: transactieData.gebruikerId },
      data: {
        balans: gebruiker.balans - prijstransactie,
      },
    });

    const nieuwTransactie = await prisma.transactie.create({
      data: {
        gebruikerId: transactieData.gebruikerId,
        aandeelId: transactieData.aandeelId,
        hoeveelheid: transactieData.hoeveelheid,
        soorttransactie: transactieData.soorttransactie,
        prijstransactie,
        datum: transactieData.datum || new Date(), 
      },
      include: {
        gebruiker: {
          select: { id: true, naam: true, email: true, balans: true },
        },
        aandeel: {
          select: { id: true, afkorting: true, naam: true, prijs: true },
        },
      },
    });

    return {
      id: nieuwTransactie.id,
      datum: nieuwTransactie.datum.toISOString(),
      hoeveelheid: nieuwTransactie.hoeveelheid,
      prijstransactie: nieuwTransactie.prijstransactie,
      soorttransactie: nieuwTransactie.soorttransactie,
      gebruiker: {
        id: nieuwTransactie.gebruiker.id,
        naam: nieuwTransactie.gebruiker.naam,
        email: nieuwTransactie.gebruiker.email,
        balans: updatedGebruiker.balans, 
      },
      aandeel: {
        id: nieuwTransactie.aandeel.id,
        afkorting: nieuwTransactie.aandeel.afkorting,
        naam: nieuwTransactie.aandeel.naam,
        prijs: nieuwTransactie.aandeel.prijs,
      },
    };
  } catch (error) {
    handleDBError(error);
    throw error;
  }
};





export const sellTransaction = async (
  transactieData: TransactieCreateInput
): Promise<any> => {
  try {
    if (transactieData.hoeveelheid <= 0) {
      throw ServiceError.validationFailed('Invalid quantity to sell');
    }

    const userHolding = await prisma.transactie.aggregate({
      where: {
        gebruikerId: transactieData.gebruikerId,
        aandeelId: transactieData.aandeelId,
        soorttransactie: 'buy', 
      },
      _sum: {
        hoeveelheid: true, 
      },
    });

    const totalQuantityOwned = userHolding._sum.hoeveelheid || 0;

    if (totalQuantityOwned < transactieData.hoeveelheid) {
      throw ServiceError.validationFailed('Insufficient stocks to sell');
    }

    const aandeel = await prisma.aandeel.findUnique({
      where: { id: transactieData.aandeelId },
      select: { prijs: true },
    });

    if (!aandeel) {
      throw ServiceError.notFound('Stock not found');
    }

    const prijstransactie = aandeel.prijs * transactieData.hoeveelheid;

    const gebruiker = await prisma.gebruiker.findUnique({
      where: { id: transactieData.gebruikerId },
    });

    if (!gebruiker) {
      throw ServiceError.notFound('User not found');
    }

    await prisma.gebruiker.update({
      where: { id: transactieData.gebruikerId },
      data: {
        balans: gebruiker.balans + prijstransactie, 
      },
    });

    const nieuwTransactie = await prisma.transactie.create({
      data: {
        gebruikerId: transactieData.gebruikerId,
        aandeelId: transactieData.aandeelId,
        hoeveelheid: transactieData.hoeveelheid,
        soorttransactie: 'sell',
        prijstransactie,
        datum: transactieData.datum || new Date(),
      },
      include: {
        gebruiker: {
          select: { id: true, naam: true, email: true, balans: true },
        },
        aandeel: {
          select: { id: true, afkorting: true, naam: true, prijs: true },
        },
      },
    });

    return {
      id: nieuwTransactie.id,
      datum: nieuwTransactie.datum.toISOString(),
      hoeveelheid: nieuwTransactie.hoeveelheid,
      prijstransactie: nieuwTransactie.prijstransactie,
      soorttransactie: nieuwTransactie.soorttransactie,
      gebruiker: {
        id: nieuwTransactie.gebruiker.id,
        naam: nieuwTransactie.gebruiker.naam,
        email: nieuwTransactie.gebruiker.email,
        balans: nieuwTransactie.gebruiker.balans,
      },
      aandeel: {
        id: nieuwTransactie.aandeel.id,
        afkorting: nieuwTransactie.aandeel.afkorting,
        naam: nieuwTransactie.aandeel.naam,
        prijs: nieuwTransactie.aandeel.prijs,
      },
    };
  } catch (error) {
    handleDBError(error);
    throw error;
  }
};








