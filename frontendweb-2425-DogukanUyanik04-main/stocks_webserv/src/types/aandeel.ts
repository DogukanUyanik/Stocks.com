import type { Entity, ListResponse } from "./common";
import type { Markt } from "./markt";
import type { Transactie } from "./transactie";

export interface Aandeel extends Entity{
  afkorting: string;
  naam: string;
  prijs: number;
  marktId: number;
  markt?: Markt;
  transacties?: Transactie[];
}




export interface GetAllAandeelResponse extends ListResponse<Aandeel> {}
export interface GetAandeelByNameResponse extends ListResponse<Aandeel>{}
export interface GetAandeelByIdResponse extends Aandeel {}

