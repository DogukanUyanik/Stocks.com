# Stock app

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