# NextShop

A demo e-commerce storefront built with **Next.js 16, React 19 and Tailwind CSS 4**. Portfolio project, no real payments.

## Features
- Neutral dark + light themes (follows your OS, header toggle, no flash) with a monochrome gradient background; tokens in `src/app/globals.css`
- Real authentication: NextAuth credentials sign-in/register backed by Postgres + Prisma, bcrypt-hashed passwords, JWT sessions
- 12-product catalogue with categories, ratings, specs, sale/new badges
- Shop page with category filter, search and sorting
- Product detail pages (server-rendered from the database, with SEO metadata) and related products
- Catalogue, orders and users stored in Postgres via Prisma (prices in integer cents)
- Persistent cart (localStorage) with quantity stepper, free-shipping progress, totals
- Sign-in-required checkout: the server re-prices every order from the database, so the client can't tamper with totals
- Per-user order history and confirmation pages (users can only see their own orders)
- Contact page, 404 page

## Getting started
```bash
npm install
npm run dev
```
The app needs a Postgres database:
```bash
cp .env.example .env                              # fill in DATABASE_URL and NEXTAUTH_SECRET (openssl rand -base64 32)
npx prisma migrate dev --name add_catalog_and_orders   # creates/updates the tables
npx prisma generate
npm run db:seed                                   # loads the 12 demo products (safe to re-run)
npm run dev
```

Useful scripts: `npm run db:studio` (browse the data), `npm run db:seed`, `npm run check:images`.

To change the catalogue, edit `src/data/products.ts` and run `npm run db:seed`. To hide a product without losing order history, set its `active` column to `false`.

## Images
Products 1–3 use local photos in `public/products`. The rest use Unsplash stock photos defined in `src/data/products.ts` and `src/data/categories.ts`.
Run `npm run check:images` to verify every remote image URL resolves.
