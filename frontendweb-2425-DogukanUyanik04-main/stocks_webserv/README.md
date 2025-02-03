# Web Services Stocks.com

This is the backend I made for the course Web Services

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
