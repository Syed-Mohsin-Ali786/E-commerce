import "dotenv/config";
import { prisma } from "../config/db.server";
import { productsDummyData } from "../app/assets/dummyData";

const SEED_SELLER_ID = "user_seed_seller";

async function main() {
  await prisma.user.upsert({
    where: { id: SEED_SELLER_ID },
    create: {
      id: SEED_SELLER_ID,
      email: "seller@example.com",
      name: "Seed Seller",
      role: "SELLER",
    },
    update: { role: "SELLER" },
  });

  for (const product of productsDummyData) {
    await prisma.product.upsert({
      where: { id: product._id },
      create: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        offerPrice: product.offerPrice,
        images: product.image,
        category: product.category,
        sellerId: SEED_SELLER_ID,
      },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        offerPrice: product.offerPrice,
        images: product.image,
        category: product.category,
      },
    });
  }

  console.log(`Seeded ${productsDummyData.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
