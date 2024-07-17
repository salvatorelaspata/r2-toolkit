# R2-TOOLKIT

A simple toolkit for the Cloudflare R2 Object Storage.

## Pre-requisites

- Node.js
- Account on Cloudflare
  - Cloudflare R2 API Key

## Configuration

Copy `.env.sample` to `.env` and fill in the required fields:

```env
CLOUDFLARE_R2_ACCOUNT_ID=YOUR_ACCOUNT_ID
CLOUDFLARE_R2_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
CLOUDFLARE_R2_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
# TEST
CLOUDFLARE_R2_TEST_BUCKET_NAME=
```

## Usage

```bash
# Install dependencies
npm install

# Run the toolkit
npm start
```

If you want to show the result (console.table) in a file you can use the following command:

```bash
npm start > output.txt
```