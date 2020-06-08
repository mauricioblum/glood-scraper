# Glood Scraper 🍬

Puppeteer POC app to fetch a specific product stock availability on the Glood website.

## How to install 💻

You must have a working Node environment installed with node, npm and yarn.

Run the following command:

```bash
yarn install
```

## Setup ✨

Create a `.env` file in the root of the project and insert your Google OAuth2 credentials.

Insert a list of comma-separated in the `MAIL_TO_ADDRESS` environment variable.

There is an example in the root folder called `.env-example`.

For more information check out the official [Nodemailer documentation](https://nodemailer.com/smtp/oauth2/): 

## How to run in development mode 🚀

Run the following command:

```bash
yarn dev
```

## How to build 👷‍♂️

Run the following command:

```bash
yarn build
```

The build will be genereted in the `/dist` folder at the root directory.

Created with 💖 by Mauricio Blum.