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
- Slide-over cart drawer (keyboard accessible: Esc to close, focus trap, focus restore)
- Stripe Checkout in test mode: the server re-prices every order from the database, Stripe takes the card, and a signed webhook confirms payment
- Orders start as PENDING and become CONFIRMED only after Stripe reports the exact amount paid
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

### Stripe (test mode)
1. Create a free Stripe account and copy your **test** secret key (`sk_test_...`) into `STRIPE_SECRET_KEY`.
2. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and forward webhooks to your dev server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   It prints a signing secret (`whsec_...`): put it in `STRIPE_WEBHOOK_SECRET` and restart `npm run dev`.
3. Check out with test card `4242 4242 4242 4242`, any future expiry, any CVC.

The success page also asks Stripe directly if the webhook hasn't arrived yet, so checkout works even before you set up the CLI. In production, add `https://YOUR-DOMAIN/api/stripe/webhook` as a webhook endpoint (events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`).

Useful scripts: `npm run db:studio` (browse the data), `npm run db:seed`, `npm run check:images`.

To change the catalogue, edit `src/data/products.ts` and run `npm run db:seed`. To hide a product without losing order history, set its `active` column to `false`.

## Images
Products 1–3 use local photos in `public/products`. The rest use Unsplash stock photos defined in `src/data/products.ts` and `src/data/categories.ts`.
Run `npm run check:images` to verify every remote image URL resolves.
