import { prisma } from "../data";
import { Gebruiker } from "../types/gebruiker";
import { GebruikerRegisterInput } from "../types/gebruiker";
import { GebruikerUpdateInput } from "../types/gebruiker";
import type { Portfolio } from "../types/gebruiker";
import ServiceError from "../core/serviceError";
import handleDBError from "./_handleDBError";
import { hashPassword, verifyPassword } from "../core/password";
import { generateJWT, verifyJWT } from "../core/jwt";
import { PublicUser } from "../types/gebruiker";
import Role from '../core/roles';
import type { SessionInfo } from "../types/auth";
import { getLogger } from "../core/logging";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/mailer";



const makeExposedUser = ({id, naam, email, balans}: Gebruiker): PublicUser => ({
  id,
  naam,
  email,
  balans,
});


export const register = async ({
  naam,
  email,
  wachtwoord,
}: GebruikerRegisterInput): Promise<PublicUser> => {
  try {
    const passwordHash = await hashPassword(wachtwoord);

    const gebruiker = await prisma.gebruiker.create({
      data: {
        naam,
        email,
        password_hash: passwordHash,
        roles: JSON.stringify([Role.USER]),
      },
    });

    await sendEmail(
      email,
      'Welcome to Stocks.com!',
      `Hi ${naam},\n\n
      Thank you for registering at Stocks.com. We're excited to have you with us!\n\n
      To get started, we've credited your account with a balance of $50,000. You can view your favorite stocks in the "Live Stocks" section, choose the ones you'd like to buy or sell, and keep track of your investments in your personal portfolio.\n\n
      We're here to help you get the most out of your trading experience!\n\n
      Best regards,\n
      The Stocks.com Team`
    );
    
    return makeExposedUser(gebruiker);
  } catch (error){
    throw handleDBError(error);
  }
};


//Getest   -
export const getAll = async (): Promise<PublicUser[]> => {
  const gebruikers = await prisma.gebruiker.findMany();
  return gebruikers.map(makeExposedUser);
}


export const getAllPublic = async (): Promise<PublicUser[]> => {
  const gebruikers = await prisma.gebruiker.findMany();
  return gebruikers.map(makeExposedUser); 
};


export const getById = async (id: number): Promise<PublicUser> => {
  const gebruiker = await prisma.gebruiker.findUnique({ where: { id } });
  if (!gebruiker) {
    throw ServiceError.notFound('No user with this id exists.');
  }
  return makeExposedUser(gebruiker); 
};

export const getBalanceById = async (id: number): Promise<number> => {
  const gebruiker = await prisma.gebruiker.findUnique({ where: { id } });
  if (!gebruiker) {
    throw ServiceError.notFound('No user with this id exists.');
  }
  return gebruiker.balans; 
};


export const updateById = async (id: number, changes: GebruikerUpdateInput): Promise<PublicUser> => {
  try {
    const gebruiker = await prisma.gebruiker.update({
      where: {
        id,
      },
      data: changes,
    });
    return makeExposedUser(gebruiker);
  } catch (error) {
   throw handleDBError(error);
  }
};
 

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.gebruiker.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    handleDBError(error);
    throw new Error('An error occurred while deleting the user.');
  }
};


export const getTransactieByGebruikerId = async (id: number) => {
  try {
    const gebruiker = await prisma.gebruiker.findUnique({
      where: { id },
      include: {
        transactie: {
          select: {
            id: true,
            hoeveelheid: true,
            prijstransactie: true,
            soorttransactie: true,
            datum: true,
          },
        },
      },
    });

    if (!gebruiker) {
      throw ServiceError.notFound('Gebruiker niet gevonden');
    }

    return gebruiker.transactie;
  } catch (error) {
    handleDBError(error);
    throw new Error('An error occurred while fetching transactions.');
  }
};



export const getGebruikerPortfolio = async (userId: number): Promise<Portfolio> => {
  try {
    const activePortfolio = await getActivePortfolio(userId);

    const portfolio: Portfolio = {};

    activePortfolio.forEach((item) => {
      portfolio[item.aandeelId] = {
        name: item.naam,
        quantity: item.hoeveelheid,
        totalValue: item.totalValue,
      };
    });

    return portfolio;
  } catch (error) {
    handleDBError(error);
    throw new Error('An error occurred while fetching the portfolio.');
  }
};


export const getActivePortfolio = async (gebruikerId: number) => {
  try {
    const activePortfolio = await prisma.transactie.groupBy({
      by: ['aandeelId'],
      where: { gebruikerId },
      _sum: { hoeveelheid: true },
      having: { hoeveelheid: { _sum: { gt: 0 } } }, 
    });

    const portfolioDetails = await Promise.all(
      activePortfolio.map(async (portfolioItem) => {
        const aandeel = await prisma.aandeel.findUnique({
          where: { id: portfolioItem.aandeelId },
          select: { naam: true, afkorting: true, prijs: true },
        });

        const hoeveelheid = portfolioItem._sum.hoeveelheid || 0;

        return {
          aandeelId: portfolioItem.aandeelId,
          hoeveelheid,
          naam: aandeel?.naam || 'Unknown',
          afkorting: aandeel?.afkorting || 'N/A',
          prijs: aandeel?.prijs || 0,
          totalValue: (aandeel?.prijs || 0) * hoeveelheid,
        };
      })
    );

    return portfolioDetails;
  } catch (error) {
    handleDBError(error);
    throw new Error('An error occurred while fetching the active portfolio.');
  }
};





export const login = async (
  email: string,
  wachtwoord: string,
): Promise<{ token: string, id: number}> => {  
  const gebruiker = await prisma.gebruiker.findUnique({ where: { email } });

  if (!gebruiker) {
    throw ServiceError.unauthorized("The given email and password do not match");
  }

  const wachtwoordValid = await verifyPassword(wachtwoord, gebruiker.password_hash);

  if (!wachtwoordValid) {
    throw ServiceError.unauthorized("The given email and password do not match");
  }

  const token = await generateJWT(gebruiker); 
  return {
    token,
    id: gebruiker.id,
  };
};








export const checkAndParseSession = async (
  authHeader?: string,
): Promise<SessionInfo> => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);

  try {
    const { roles, sub } = await verifyJWT(authToken); 

    return {
      userId: Number(sub),
      roles,
    };
  } catch (error: any) {
    getLogger().error(error.message, { error });

    if (error instanceof jwt.TokenExpiredError) {
      throw ServiceError.unauthorized('The token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw ServiceError.unauthorized(
        `Invalid authentication token: ${error.message}`,
      );
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};

export const checkRole = (role: string, roles: string[]): void => {
  const hasPermission = roles.includes(role); 

  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application',
    );
  }
};
