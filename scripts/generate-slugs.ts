// scripts/generate-slugs.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")                // quita tildes
    .replace(/[\u0300-\u036f]/g, "") // más tildes
    .replace(/[^a-z0-9 ]/g, "")      // caracteres raros
    .trim()
    .replace(/\s+/g, "-");
}

async function main() {
  const products = await prisma.product.findMany();

  for (const product of products) {
    if (!product.slug) {
      const newSlug = slugify(product.name);
      await prisma.product.update({
        where: { id: product.id },
        data: { slug: newSlug }
      });
      console.log(`✅ Slug generado para: "${product.name}" → ${newSlug}`);
    } else {
      console.log(`⏭️ Slug ya presente en: "${product.name}"`);
    }
  }
}

main()
  .then(() => {
    console.log("🎉 Slugs generados exitosamente.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Error generando slugs:", e);
    prisma.$disconnect();
    process.exit(1);
  });
