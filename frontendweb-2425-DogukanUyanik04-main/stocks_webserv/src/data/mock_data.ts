export const GEBRUIKERS = [
  { id: 1, gebruikersnaam: "janedoe", email: "jane@example.com", wachtwoord: "secure123", balans: 5000.0 },
  { id: 2, gebruikersnaam: "johndoe", email: "john@example.com", wachtwoord: "secure456", balans: 1200.0 },
  { id: 3, gebruikersnaam: "mariecurie", email: "marie@example.com", wachtwoord: "secure789", balans: 7500.5 },
];


export const TRANSACTIES = [
  { id: 1, gebruikerId: 1, aandeelId: 1, hoeveelheid: 10, prijstransactie: 150, soorttransactie: "buy", datum: new Date("2023-09-12") },
  { id: 2, gebruikerId: 2, aandeelId: 2, hoeveelheid: 5, prijstransactie: 200, soorttransactie: "sell", datum: new Date("2023-09-13") },
  { id: 3, gebruikerId: 1, aandeelId: 3, hoeveelheid: 20, prijstransactie: 300, soorttransactie: "buy", datum: new Date("2023-09-14") },
];


export const AANDELEN = [
  { id: 1, afkorting: "AAPL", bedrijfsnaam: "Apple Inc.", huidigeprijs: 150, marktId: 1 },
  { id: 2, afkorting: "GOOGL", bedrijfsnaam: "Alphabet Inc.", huidigeprijs: 200, marktId: 1 },
  { id: 3, afkorting: "TSLA", bedrijfsnaam: "Tesla Inc.", huidigeprijs: 300, marktId: 2 },
];


export const MARKTEN = [
  { id: 1, naam: "NASDAQ", valuta: "USD" },
];
