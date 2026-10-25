import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { seedProducts } from "../src/data/products";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const cents = (n: number) => Math.round(n * 100);

async function main() {
  for (const p of seedProducts) {
    const data = {
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      priceCents: cents(p.price),
      compareAtCents: p.compareAt ? cents(p.compareAt) : null,
      category: p.category,
      image: p.image,
      rating: p.rating,
      reviews: p.reviews,
      badge: p.badge ?? null,
      features: p.features,
      specs: p.specs,
      active: true,
    };
    await prisma.product.upsert({ where: { id: p.id }, create: { id: p.id, ...data }, update: data });
  }

  // Explicit ids were inserted, so move the autoincrement sequence past them.
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Product"', 'id'), (SELECT MAX(id) FROM "Product"))`,
  );

  console.log(`Seeded ${seedProducts.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
