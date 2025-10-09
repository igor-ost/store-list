import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting fabric database seed...")

  // const hashedPassword = await bcrypt.hash("H93wp21kls@", 10);
  // const user = await prisma.user.create({
  //   data: {
  //     email: "igorostap21.31@gmail.com",
  //     name: "Игорь Остапенко",
  //     password: hashedPassword,
  //     role: "admin"
  //   },
  // });

  // console.log("✅ Created demo user")

  // Create fabric categories
  const categories = await Promise.all([
    prisma.fabricCategory.upsert({
      where: { name: "costume" },
      update: {},
      create: {
        name: "costume",
        name_ru: "Костюмные ткани",
        sort_order: 1,
      },
    }),
    prisma.fabricCategory.upsert({
      where: { name: "technical" },
      update: {},
      create: {
        name: "technical",
        name_ru: "Технические ткани",
        sort_order: 2,
      },
    }),
    prisma.fabricCategory.upsert({
      where: { name: "padding" },
      update: {},
      create: {
        name: "padding",
        name_ru: "Синтепон флис",
        sort_order: 3,
      },
    }),
  ])

  console.log("✅ Created fabric categories")

  // Costume fabrics data
  const costumeFabrics = [
    { name: "Орион", color: "красный", price: 1500, stock: 1000 },
    { name: "Орион", color: "оранжевый", price: 1500, stock: 1000 },
    { name: "Орион", color: "серый", price: 1500, stock: 1000 },
    { name: "Орион", color: "черный", price: 1500, stock: 1000 },
    { name: "Орион", color: "темно синий", price: 1500, stock: 1000 },
    { name: "Орион", color: "лимонный", price: 1500, stock: 1000 },
    { name: "Твил", color: "серый", price: 1200, stock: 1000 },
    { name: "Твил", color: "василек", price: 1200, stock: 1000 },
    { name: "Твил", color: "красный", price: 1200, stock: 1000 },
    { name: "Твил", color: "темно синий", price: 1200, stock: 1000 },
    { name: "Твил", color: "оранжевый", price: 1200, stock: 1000 },
    { name: "Твил", color: "черный", price: 1200, stock: 1000 },
    { name: "Твил", color: "морская волна", price: 1200, stock: 1000 },
    { name: "Твил", color: "терракот", price: 1200, stock: 1000 },
    { name: "Канвас", color: "серый", price: 1500, stock: 1000 },
    { name: "Канвас", color: "хаки", price: 1500, stock: 1000 },
    { name: "Канвас", color: "бежевый", price: 1500, stock: 1000 },
    { name: "Канвас", color: "синий", price: 1500, stock: 1000 },
    { name: "Канвас", color: "черный", price: 1500, stock: 1000 },
    { name: "Халатная ткань", color: "белый", price: 700, stock: 1000 },
    { name: "Халатная ткань", color: "темно синий", price: 700, stock: 1000 },
    { name: "Халатная ткань", color: "серый", price: 700, stock: 1000 },
    { name: "Халатная ткань", color: "василек", price: 700, stock: 1000 },
    { name: "Хлопок", color: "василек", price: 1300, stock: 1000 },
    { name: "Тафета (подклад)", color: "темно синий", price: 350, stock: 1000 },
    { name: "Тафета (подклад)", color: "хаки", price: 350, stock: 1000 },
    { name: "Тафета (подклад)", color: "серый", price: 350, stock: 1000 },
    { name: "Тафета (подклад)", color: "черный", price: 350, stock: 1000 },
    { name: "Болонь Аляска", color: "синий", price: 1600, stock: 1000 },
    { name: "Болонь Аляска", color: "серый", price: 1600, stock: 1000 },
    { name: "Кошачий глаз", color: "синий", price: 1600, stock: 1000 },
    { name: "Кошачий глаз", color: "темно синий", price: 1600, stock: 1000 },
    { name: "Кошачий глаз", color: "василек", price: 1600, stock: 1000 },
    { name: "Кошачий глаз", color: "красный", price: 1600, stock: 1000 },
    { name: "Кошачий глаз", color: "серый", price: 1600, stock: 1000 },
    { name: "Полиджордан (болонь)", color: "черный", price: 1600, stock: 1000 },
    { name: "Полиджордан (болонь)", color: "серый", price: 1600, stock: 1000 },
    { name: "Полиджордан (болонь)", color: "василек", price: 1600, stock: 1000 },
    { name: "Полиджордан (болонь)", color: "красный", price: 1600, stock: 1000 },
    { name: "Лидер", color: "бежевый", price: 2500, stock: 1000 },
    { name: "Зоро Лайкра", color: "бежевый", price: 1800, stock: 1000 },
    { name: "Зоро Лайкра", color: "серый", price: 1800, stock: 1000 },
    { name: "Зоро Лайкра", color: "кофе", price: 1800, stock: 1000 },
    { name: "Верона", color: "хаки", price: 1800, stock: 1000 },
    { name: "Верона", color: "серый", price: 1800, stock: 1000 },
    { name: "Пиксель", color: "светлый хаки", price: 1800, stock: 1000 },
    { name: "Пиксель", color: "хаки", price: 1800, stock: 1000 },
    { name: "Пиксель", color: "синий", price: 1800, stock: 1000 },
    { name: "Пиксель", color: "черный", price: 1800, stock: 1000 },
  ]

  // Technical fabrics data
  const technicalFabrics = [
    { name: "Бельтинг", color: null, price: 2500, stock: 1000 },
    { name: "Брезент", color: "292 ХПВ", price: 2200, stock: 1000 },
    { name: "Брезент", color: "293 ХПВ", price: 2500, stock: 1000 },
    { name: "Брезент", color: "292 ХОП", price: 2200, stock: 1000 },
    { name: "Брезент", color: "293 ХОП", price: 2500, stock: 1000 },
    { name: "Брезент", color: "11252 СКПВ", price: 2000, stock: 1000 },
    { name: "Брезент", color: "11193 СКПВ", price: 1800, stock: 1000 },
    { name: "Брезент", color: "11192 ОП", price: 1800, stock: 1000 },
    { name: "Двунитка", color: "белый", price: 500, stock: 1000 },
    { name: "Спилок", color: null, price: 90, stock: 10000, unit: "кв.дм" },
    { name: "Палатка", color: "3*3", price: 1500, stock: 10000 },
    { name: "Палатка", color: "4*4", price: 1900, stock: 10000 },
  ]

  // Padding/fleece fabrics data
  const paddingFabrics = [
    { name: "Флис", color: "серый", price: 850, stock: 1000 },
    { name: "Флис", color: "синий", price: 850, stock: 1000 },
    { name: "Флис", color: "василек", price: 850, stock: 1000 },
    { name: "Флис", color: "черный", price: 850, stock: 1000 },
    { name: "Флис", color: "красный", price: 850, stock: 1000 },
    { name: "Войлок", color: null, price: 0, stock: 0 },
    { name: "Синтепон", color: "300", price: 600, stock: 1000 },
    { name: "Синтепон", color: "200", price: 400, stock: 1000 },
    { name: "Синтепон", color: "250", price: 500, stock: 1000 },
    { name: "Слайтекс", color: "200", price: 1200, stock: 1000 },
  ]

  // Insert costume fabrics
  for (const fabric of costumeFabrics) {
    await prisma.fabric.create({
      data: {
        name: fabric.name,
        color: fabric.color,
        unit: "м",
        price_per_unit: fabric.price,
        stock_quantity: fabric.stock,
        category_id: categories[0].id,
      },
    })
  }

  console.log(`✅ Created ${costumeFabrics.length} costume fabrics`)

  // Insert technical fabrics
  for (const fabric of technicalFabrics) {
    await prisma.fabric.create({
      data: {
        name: fabric.name,
        color: fabric.color,
        unit: fabric.unit || "м",
        price_per_unit: fabric.price,
        stock_quantity: fabric.stock,
        category_id: categories[1].id,
      },
    })
  }

  console.log(`✅ Created ${technicalFabrics.length} technical fabrics`)

  // Insert padding fabrics
  for (const fabric of paddingFabrics) {
    await prisma.fabric.create({
      data: {
        name: fabric.name,
        color: fabric.color,
        unit: "м",
        price_per_unit: fabric.price,
        stock_quantity: fabric.stock,
        category_id: categories[2].id,
      },
    })
  }

  console.log(`✅ Created ${paddingFabrics.length} padding fabrics`)

  console.log("🎉 Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
