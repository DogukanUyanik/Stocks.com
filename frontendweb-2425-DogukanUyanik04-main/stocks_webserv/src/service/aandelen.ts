import { prisma } from "../data";
import { Aandeel } from "../types/aandeel";
import handleDBError from "../service/_handleDBError";
import ServiceError from "../core/serviceError";

export const getAll = async (): Promise<Aandeel[]> => {
  try {
    return await prisma.aandeel.findMany({
      include: { markt: true },
    });
  } catch (error) {
    handleDBError(error); 
    throw ServiceError.internalServerError("Failed to retrieve stocks.");
  }
};

export const getById = async (id: number): Promise<Aandeel> => {
  try {
    const aandeel = await prisma.aandeel.findUnique({
      where: { id },
      include: {
        markt: true,
      },
    });

    if (!aandeel) {
      throw ServiceError.notFound(`No stock found with this ID: ${id}`);
    }

    return aandeel;
  } catch (error) {
    handleDBError(error); 
    throw ServiceError.internalServerError("Failed to retrieve stock.");
  }
};

export const getByName = async (name: string): Promise<Aandeel[]> => {
  try {
    const aandelen = await prisma.aandeel.findMany({
      where: {
        naam: {
          contains: name.toLowerCase(),  
        },
      },
      include: {
        markt: true,
      },
    });

    if (aandelen.length === 0) {
      throw ServiceError.notFound(`No stocks found with the name: ${name}`);
    }

    return aandelen;
  } catch (error) {
    handleDBError(error); 
    throw ServiceError.internalServerError("Failed to retrieve stocks.");
  }
};
