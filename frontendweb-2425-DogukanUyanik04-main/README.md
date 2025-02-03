# Examenopdracht Front-end Web Development & Web Services

- Student: DOGUKAN UYANIK
- Studentennummer: 295314du
- E-mailadres: dogukan.uyanik@student.hogent.be

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)


## Front-end

## Setup

Make sure Corepack is enabled:

```bash
corepack enable
```

Install all dependencies using the following command:

```bash
yarn install
```

Create a `.env` with the following content and apply to your configuration:

```dotenv
VITE_API_URL=http://localhost:9000/api
```

## Start the app

### Development

- Make sure a `.env` (see above) is present.
- Start the app using `yarn dev`. It runs on <http://localhost:5137> by default.

### Production

- Make sure a `.env` (see above) is present.
- Build the app using `yarn build`. This will generate a `dist` folder with the compiled files.
- Serve this folder using a static service like Apache, Nginx or others.

## Test the app

Run the tests using `yarn test` and choose `E2E testing` in the Cypress window. It will open a new browser window where you can select which test suite to run.

## Back-end

## Requirements

- [NodeJS v17 or higher](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [MySQL v8](https://dev.mysql.com/downloads/windows/installer/8.0.html) (no Oracle account needed, click the tiny link below the grey box)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (no Oracle account needed, click the tiny link below the grey box)

## Before starting/testing this project

Create a `.env` (development) or `.env.test` (testing) file with the following template.
Complete the environment variables with your secrets, credentials, etc.

```bash
NODE_ENV=development
DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@localhost:3306/<DATABASE_NAME>
AUTH_JWT_SECRET=<YOUR-JWT-SECRET>
```

In your .env file also define these two variables, this is needed for Nodemailer to work properly!

```bash
EMAIL_USER=<YOUR-EMAIL>
EMAIL_PASS=<APP-PASSWORD>
```

The email pass requires the app password from the email you used in EMAIL_USER. You can generate your app password in your own email service provider.

## Start this project

### Development

- Enable Corepack: `corepack enable`
- Install all dependencies: `yarn`
- Make sure a `.env` exists (see above)
- Run the migrations: `yarn migrate:dev`
- Start the development server: `yarn start:dev`
- After starting the server, in a seperate window run these two commands in this exact order:
    `yarn generate-stocks`
    `yarn update-stock-prices`

This allows the stocks to get generated and the price to be automatically updated

### Production

- Enable Corepack: `corepack enable`
- Install all dependencies: `yarn`
- Make sure a `.env` exists (see above) or set the environment variables in your production environment
- Run the migrations: `yarn prisma migrate deploy`
- Build the project: `yarn build`
- Start the production server: `node build/src/index.js`

## Test this project

This server will create the given database when the server is started.

- Enable Corepack: `corepack enable`
- Install all dependencies: `yarn`
- Make sure `.env.test` exists (see above)
- Run the migrations: `yarn migrate:test`
- Run the tests: `yarn test`
  - This will start a new server for each test suite that runs, you won't see any output as logging is disabled to make output more clean.
  - The user suite will take 'long' (around 10s) to complete, this is normal as many cryptographic operations are being performed.
- Run the tests with coverage: `yarn test:coverage`
  - This will generate a coverage report in the `__tests__/coverage` folder.
  - Open `__tests__/coverage/lcov-report/index.html` in your browser to see the coverage report.
