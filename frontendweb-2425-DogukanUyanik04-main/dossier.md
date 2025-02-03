# Dossier
- Student: Dogukan Uyanik
- Studentennummer: 202295314
- E-mailadres: <mailto:dogukan.uyanik@student.hogent.be>
- Demo: https://hogent.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=fb3cec75-6550-4bd4-b0b3-b24c00201ec0
- GitHub-repository: <https://github.com/HOGENT-frontendweb/frontendweb-2425-DogukanUyanik04>

- Front-end Web Development
  - Online versie: https://frontendweb-2425-dogukanuyanik04.onrender.com
- Web Services:
  - Online versie: https://stocks-webserv.onrender.com

## Logingegevens

### Lokaal

- Gebruikersnaam/e-mailadres: john@example.com
- Wachtwoord: 12345678

admin
- Gebruikersnaam/e-mailadres: jane@example.com
- Wachtwoord: 12345678

### Online

- Gebruikersnaam/e-mailadres: public@gmail.com
- Wachtwoord: Public12345678

admin
- Gebruikersnaam/e-mailadres: jane@example.com
- Wachtwoord: 12345678

## Projectbeschrijving

De applicatie geeft de gebruiker de mogelijkheid om in een nepomgeving in aandelen te handelen. Door dit te doen raakt de gebruiker vertrouwd met de aandelenmarkt. Het is een eerste stap om een ​​echte belegger te worden.
 
[Gebruiker]
*id
naam
email
balans
password_hash
roles


[Transactie]
*id
+gebruikerId
+AandeelId
hoeveelheid
prijstransactie
soorttransactie
datum

[Aandeel]
*id
afkorting
naam
huidigeprijs
+marktId

[Markt]
*id
naam
valuta

Gebruiker 1--* Transactie

Aandeel 1--* Transactie

Markt 1--* Aandeel

## Screenshots

- Homescreen
![Homescreen](screenshots/Screenshot%202024-12-19%20235455.png)

- LoginsSreen
![LoginScreen](screenshots/Screenshot%202024-12-20%20000057.png)

- Livestocks
![LiveStocks](screenshots/Screenshot%202024-12-13%20195547.png)

- Buyform
![BuyForm](screenshots/Screenshot%202024-12-13%20195606.png)

- Portfolio
![Portfolio](screenshots/Screenshot%202024-12-20%20000709.png)

- HomescreenAdmin
![HomescreenAdmin](screenshots/Screenshot%202024-12-20%20000521.png)

- DeleteUsersAdminOnly
![DeleteUsersAdminOnly](screenshots/Screenshot%202024-12-20%20000544.png)

- EERD
![EERD](screenshots/Screenshot%202024-12-20%20000435.png)





## API calls

### Aandelen

- `GET /api/aandelen`:                      alle aandelen opvragen
- `GET /api/aandelen/:id`:                  aandeel met een bepaalde id opvragen
- `GET /api/aandelen/name/:name`:           aandeel met een bepaalde naam opvragen


### Gebruikers

- `GET /api/gebruikers`:                    alle gebruikers ophalen
- `GET /api/gebruikers/:id`:                gebruiker met een bepaald id ophalen
- `GET /api/gebruikers/:id/balance`:        balans van een gebruiker met een bepaalde id ophalen
- `GET /api/gebruikers/:id/transacties`:    alle transacties van een gebruiker met een bepaald id ophalen
- `GET /api/gebruikers/:id/portfolio`:      portfolio van een gebruiker ophalen
- `GET /api/gebruikers/user/stocks`:        alle aandelen dat een gebruiker bezit ophalen
- `GET /api/gebruikers/leaderboardpagina`:  alle gebruikers ophalen voor de leaderboard component
- `POST /api/gebruikers`:				            nieuwe gebruiker aanmaken/registreren
- `PUT /api/gebruikers/:id`:                gebruiker met een bepaald id updaten
- `DELETE /api/gebruikers/:id`:             gebruiker met een bepaald id verwijderen


### Health

- `GET /api/health/ping`:	                  de server pingen
- `GET /api/health/version`:	              versie info van server ophalen


### Sessions

- `POST /api/sessions`:                     endpoint om een nieuwe login session aan te maken.


### Transacties

- `GET /api/transcaties`:	                  alle transacties ophalen
- `GET /api/transcaties/:id`:	              transacties met een bepaalde id ophalen
- `POST /api/transcaties/buy`:	            nieuwe koop transactie creëren
- `POST /api/transcaties/sell`:	            nieuwe verkoop transactie creëren


### Swagger
https://stocks-webserv.onrender.com/swagger




## Behaalde minimumvereisten

### Front-end Web Development

#### Componenten

- [x] heeft meerdere componenten - dom & slim (naast login/register)
- [x] applicatie is voldoende complex
- [x] definieert constanten (variabelen, functies en componenten) buiten de component
- [x] minstens één form met meerdere velden met validatie (naast login/register)
- [x] login systeem

#### Routing

- [x] heeft minstens 2 pagina's (naast login/register)
- [x] routes worden afgeschermd met authenticatie en autorisatie

#### State management

- [x] meerdere API calls (naast login/register)
- [x] degelijke foutmeldingen indien API-call faalt
- [x] gebruikt useState enkel voor lokale state
- [x] gebruikt gepast state management voor globale state - indien van toepassing

#### Hooks

- [x] gebruikt de hooks op de juiste manier

#### Algemeen

- [x] een aantal niet-triviale én werkende e2e testen
- [x] minstens één extra technologie
- [x] node_modules, .env, productiecredentials... werden niet gepushed op GitHub
- [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
- [x] de applicatie start zonder problemen op gebruikmakend van de instructies in de README
- [x] de applicatie draait online
- [x] duidelijke en volledige README.md
- [x] er werden voldoende (kleine) commits gemaakt
- [x] volledig en tijdig ingediend dossier

### Web Services

#### Datalaag

- [x] voldoende complex en correct (meer dan één tabel (naast de user tabel), tabellen bevatten meerdere kolommen, 2 een-op-veel of veel-op-veel relaties)
- [x] één module beheert de connectie + connectie wordt gesloten bij sluiten server
- [x] heeft migraties - indien van toepassing
- [x] heeft seeds

#### Repositorylaag

- [ ] definieert één repository per entiteit - indien van toepassing
- [ ] mapt OO-rijke data naar relationele tabellen en vice versa - indien van toepassing
- [ ] er worden kindrelaties opgevraagd (m.b.v. JOINs) - indien van toepassing

#### Servicelaag met een zekere complexiteit

- [x] bevat alle domeinlogica
- [x] er wordt gerelateerde data uit meerdere tabellen opgevraagd
- [x] bevat geen services voor entiteiten die geen zin hebben zonder hun ouder (bv. tussentabellen)
- [x] bevat geen SQL-queries of databank-gerelateerde code

#### REST-laag

- [x] meerdere routes met invoervalidatie
- [x] meerdere entiteiten met alle CRUD-operaties
- [x] degelijke foutboodschappen
- [x] volgt de conventies van een RESTful API
- [x] bevat geen domeinlogica
- [x] geen API calls voor entiteiten die geen zin hebben zonder hun ouder (bv. tussentabellen)
- [x] degelijke autorisatie/authenticatie op alle routes

#### Algemeen

- [x] er is een minimum aan logging en configuratie voorzien
- [x] een aantal niet-triviale én werkende integratietesten (min. 1 entiteit in REST-laag >= 90% coverage, naast de user testen)
- [x] node_modules, .env, productiecredentials... werden niet gepushed op GitHub
- [x] minstens één extra technologie die we niet gezien hebben in de les
- [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
- [x] de applicatie start zonder problemen op gebruikmakend van de instructies in de README
- [x] de API draait online
- [x] duidelijke en volledige README.md
- [x] er werden voldoende (kleine) commits gemaakt
- [x] volledig en tijdig ingediend dossier

## Projectstructuur

### Front-end Web Development

Het mapje stocks_frontend bevat een cypress mapje met daarin alle e2 testen, fixtures en enkele commands die helpen met het inloggen bij de testen. Het mapje node_modules bevat alle geinstalleerde dependencies nodig voor dit project. Het mapje public bevat een foto dat dient als favicon voor het website. Ten slotte het mapje src, hier zit al het logica van de frontend. Als eerst het mapje api, hierin is er een aparte file voor elk entiteit waarin de api calls naar de backend zich bevinden, deze api calls hebben we nodig in onze componenten. Vervolgens het mapje components, hierin zit voor elk component van ons website de code, bijvoorbeel een component aandeellijst waar elk aandeel mooi getoond word op een lijstje. Hierna hebben we het mapje contexts, hierin kunnen we globale instellingen toepassingen op ons website, bijvoorbeeld om het website een donkere thema te geven, of om te controleren of de gebruiker is ingelogd en zo navigeren doorheen de website. Ten slotte hebben we het mapje pages, hierin worden componenten opgeroepen om ze te tonen om de pagina. Een van de belangrijkste files in de pages folder is de main.jsx, hier gebeurt alle routing van de pagina's.  


### Web Services

Het mapje stocks_webserv bevat een tests mapje waarin alle testen plaatsvinden voor de backend. In de folder tests hebben we een folder helpers, dit zijn files dat toepasselijk is op alle testen zoals ingelogd zijn, ingelogd zijn als een admin, ... Dit bespaart veel typwerk. Een ander mapje rest met daarin een testfile voor elk entiteit. Het mapje config bevat alle configuratie instellingen, dit kan verschillen als we in development, productie of in testing zitten. Hierna hebben we waarschijnlijk het belangrijkste mapje van onze backend, de src folder. Hierin hebben we allereerst het core mapje, hier gebeuren zaken zoals authenticatie, jwt tokens genereren, rollen definieren, validatie en errors en een van de belangrijkere, het installeren van de middleware. Vervolgens hebben we het mapje data, hierin praten we voornamelijk met de databank, we definieren een schema prisma, wat ons eerd voorstelt, en kunnen daarmee ons databank opstellen, het seed bestandje zorgt ervoor dat de databank al een beetje word opgevuld met data. Vervolgens hebben we de rest folder, hierin hebben we een bestand voor elk entiteit waarin hun endpoints gedefinieerd worden, ze worden ook gevalideerd met hulp van Joi en er is documentatie voorzien. Het volgende mapje is scripts, dit bevat 2 files die uitgevoerd moeten worden bij het opstarten van de backendserver. Het volgend mapje is de service folder waarin alle business logica zit van de entiteiten. Het volgend mapje is de types folder, hierin worden alle types van elk entiteit gedefineerd, dit kan bijvoorbeeld helpen dat elk function of endpoint waar je je type gebruikt, een mooi structuur blijft houden. Als laatst hebben we het mapje utils met daarin een bestand dat zorgt dat er een mail word verstuurt naar elk gebruiker dat registreert (extra). Het bestandje .env is waar de backend zijn geheime environment variablen zoals databank url, ... .

## Extra technologie

### Front-end Web Development

Voor Frontend heb ik 2 extra technologieen geimplementeerd doordat ze vrij klein zijn, enerszijds heb ik fakerjs geimplementeerd wat ik gebruikte tijdens development van mijn frontend in vroege fase, dit genereerde erg snel mockdata voor me, ik heb het nog gelaten in de component stockdatawindow als bewijs dat het is gebruikt https://www.npmjs.com/package/@faker-js/faker.

Anderzijds heb ik een wachtwoordsterke indicator gebruikt in mijn registerform component, het module dat ik hiervoor heb gebruikt noemt zxcvbn https://www.npmjs.com/package/zxcvbn.


### Web Services

Als extra voor mijn backend heb ik nodemailer geimplementeerd, dit zorgt ervoor dat je door gebruik van je email account, emails automatisch kan versturen bij specifieke handelingen in de backend. In mijn geval stuur ik een email naar het mailadres van de registreerde gebruiker om hun te verwelkomen op de website met wat achtergrondinfo. https://www.npmjs.com/package/nodemailer



## Gekende bugs

### Front-end Web Development
De jwt token kan soms plots vervallen, maar weet niet meestal wanneer dit voorkomt, opnieuw inloggen is een fix maar wil dit in de toekomst nog verbeteren. 

### Web Services
Het url door render gegenereerd voor mijn backend is https://stocks-webserv.onrender.com Nu als ik rechtstreeks naar deze url request maak, failen mijn requests uiteraard doordat er geen /api prefix is in de url. Mijn requests van mijn frontend zijn wel allemaal succesvol en ze worden ook gelogged in de console in render. Het zou dus handiger geweest zijn moest de url de prefix al bevatten, of is dit bewust gedaan en is het volkomen normaal?

## Reflectie

Ik heb enorm veel bijgeleerd, het was super tof dat we zelf ons onderwerp mochten kiezen en dat uitwerken aan de hand van de cursus. Eerder had ik nog nooit gewerkt met typescript en niet zo erg veel met javascript, dit project heeft dus mijn kennis in beide talen enorm veel verbeterd. Ik zou later graag als fullstack developer willen werken en dus was dit project een ideaal eerste stap. Wat ik anders gedaan zou hebben en waar ik me ook aan erger is mijn consistentie in bijvoorbeeld naamgeving, ik begon aan mijn project in het nederlands, maar halverwege dacht ik dat ik het na de deadline wat uitgebreider wil maken en dus publiceren op github voor iedereen of op mijn portfolio zetten, het zou dan slimmer geweest zijn moest mijn code in het engels staan zodat het begrijpelijker zou zijn voor iedereen. Ik wou dit nog fixen, maar het zou een hele wierwar worden. 


De cursus is erg goed in elkaar gestoken, het was soms eens opzoekwerk doordat mijn project natuurlijk verschilt van het voorbeeldprojectje, maar dat is absoluut geen probleem doordat ik zo veel heb bijgeleerd. Misschien een klein aanpassing kan zijn dat er in hoofdstuk 7 Testing van frontend een klein uitleg kan zijn dat je ingelogd moet zijn voor de testen, dus eerst de cypress commands maken, en dan pas kan je je routes testen die afgebakend zijn voor authenticatie.


