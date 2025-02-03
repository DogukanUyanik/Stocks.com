
import { Prisma } from "@prisma/client";
import type { Entity, ListResponse, IdParams } from "./common";
import { Context } from "koa";


export type PortfolioItem = {
  name: string;
  quantity: number;
  totalValue: number;
};

export type Portfolio = {
  [stockId: number]: PortfolioItem;
};

export interface Gebruiker extends Entity {
  naam: string;
  email: string;
  balans: number;
  password_hash: string,
  roles: Prisma.JsonValue;
}

export interface GebruikerRegisterInput {
  naam: string;
  email: string;
  wachtwoord: string;
}



export interface GebruikerUpdateInput extends GebruikerRegisterInput {}

export interface RegisterGebruikerRequest extends GebruikerRegisterInput {}
export interface RegisterGebruikerResponse extends GetGebruikerByIdResponse {}

export interface GetAllGebruikerResponse extends ListResponse<PublicUser> {}
export interface GetGebruikerByIdResponse extends PublicUser {}

export interface UpdateGebruikerRequest extends GebruikerUpdateInput {}
export interface UpdateGebruikerResponse extends GetGebruikerByIdResponse {}

export interface KoaContext<T = any, P = IdParams> extends Context {
  params: P; 
  body: T;
}




export interface PublicUser extends Pick<Gebruiker, 'id' | 'naam' | 'email' | 'balans'> {}
export interface UserUpdateInput extends Pick<GebruikerRegisterInput, 'naam' | 'email'> {}

export interface LoginRequest {
  email: string;
  wachtwoord: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
  };
}

export interface GetGebruikerRequest {
  id: number | 'me'; // 👈
}
