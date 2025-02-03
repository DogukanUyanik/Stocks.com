import type { Entity, ListResponse } from "./common";
import type { Gebruiker } from "./gebruiker";
import type { Aandeel } from "./aandeel";

export interface Transactie extends Entity {
  gebruikerId: number; 
  aandeelId: number; 
  prijstransactie: number;
  soorttransactie: string;
  datum: Date;
  gebruiker?: Gebruiker;
  aandeel?: Aandeel;
}

export interface TransactieCreateInput {
  gebruikerId: number;
  aandeelId: number;
  hoeveelheid: number;
  soorttransactie: string;
  datum?: Date;
}

export interface CreateTransactieRequest extends TransactieCreateInput {}
export interface CreateTransactieResponse extends GetTransactieByIdResponse {}

export interface GetAllTransactieResponse extends ListResponse<Transactie> {}
export interface GetTransactieByIdResponse extends Transactie {}

export interface StockHolding {
  hoeveelheid: number;
}
