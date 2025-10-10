import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";
// import bcrypt from "bcrypt";



export async function GET() {

  // const hashedPassword = await bcrypt.hash("H93wp21kls@", 10);
  
  // await prisma.user.create({
  //   data: {
  //     email: "igorostap21.31@gmail.com",
  //     name: "Игорь Остапенко",
  //     password: hashedPassword,
  //     role: "admin"
  //   },
  // });

  const zippers = [
    {color: "Черная",type: "№8(80)",unit: "м",price:1000, qty: 1000},
    {color: "Черная",type: "№5(80)",unit: "м",price:1000, qty: 1000},
    {color: "Черная",type: "№5(20)",unit: "м",price:1000, qty: 500},
    {color: "Черная",type: "№7(40)",unit: "м",price:1000, qty: 1000},
    {color: "Черная",type: "№3(18)",unit: "м",price:1000, qty: 5000},
    {color: "Черная",type: "№7(мет)",unit: "м",price:1000, qty: 500},
    {color: "Синяя",type: "№8(80)",unit: "м",price:1000, qty: 800},
    {color: "Синяя",type: "№5(80)",unit: "м",price:1000, qty: 800},
    {color: "Синяя",type: "№5(20)",unit: "м",price:1000, qty: 800},
    {color: "Синяя",type: "№3(18)",unit: "м",price:1000, qty: 3000},
    {color: "Красная",type: "№8(80)",unit: "м",price:1000, qty: 200},
    {color: "Красная",type: "№5(80)",unit: "м",price:1000, qty: 200},
    {color: "Красная",type: "№5(20)",unit: "м",price:1000, qty: 200},
    {color: "Красная",type: "№3(18)",unit: "м",price:1000, qty: 500},
    {color: "Хаки",type: "№8(80)",unit: "м",price:1000, qty: 700},
    {color: "Хаки",type: "№5(80)",unit: "м",price:1000, qty: 700},
    {color: "Хаки",type: "№5(20)",unit: "м",price:1000, qty: 700},
    {color: "Хаки",type: "№3(18)",unit: "м",price:1000, qty: 3000},
    {color: "Бирюза",type: "№5(80)",unit: "м",price:1000, qty: 100},
    {color: "Бирюза",type: "№5(20)",unit: "м",price:1000, qty: 100},
    {color: "Серая",type: "№8(80)",unit: "м",price:1000, qty: 1000},
    {color: "Серая",type: "№5(80)",unit: "м",price:1000, qty: 1000},
    {color: "Серая",type: "№5(20)",unit: "м",price:1000, qty: 1000},
    {color: "Серая",type: "№3(18)",unit: "м",price:1000, qty: 5000},
  ]


  for (let i = 0; i < zippers.length; i++) {
    await prisma.zippers.create({
      data: zippers[i]
    });
  }


  const threads = [
    {color: "Черные",type: "№30/3",unit: "шт.",price:1000,qty: 1000},
    {color: "Черные",type: "№40/3",unit: "шт.",price:1000,qty: 1000},
    {color: "Черные",type: "№20/2",unit: "шт.",price:1000,qty: 1000},
    {color: "Хаки",type: "№30/3",unit: "шт.",price:1000,qty: 1000},
    {color: "Хаки",type: "№40/3",unit: "шт.",price:1000,qty: 1000},
    {color: "Хаки",type: "№20/2",unit: "шт.",price:1000,qty: 1000},
    {color: "Хаки",type: "№20/4",unit: "шт.",price:1000,qty: 1000},
    {color: "Серые",type: "№30/3",unit: "шт.",price:1000,qty: 1000},
    {color: "Серые",type: "№40/3",unit: "шт.",price:1000,qty: 1000},
    {color: "Серые",type: "№20/2",unit: "шт.",price:1000,qty: 1000},
    {color: "Красные",type: "№30/3",unit: "шт.",price:1000,qty: 1000},
    {color: "Красные",type: "№40/3",unit: "шт.",price:1000,qty: 1000},
    {color: "Красные",type: "№20/2",unit: "шт.",price:1000,qty: 1000},
  ]

  for (let i = 0; i < threads.length; i++) {
    await prisma.threads.create({
      data: threads[i]
    });
  }


  const buttons = [
    {color: "Красные",type: "№20",unit: "шт.",price:1000, qty: 1000},
    {color: "Серые",type: "№20",unit: "шт.",price:1000, qty: 1000},
    {color: "Хаки",type: "№20",unit: "шт.",price:1000, qty: 1000},
    {color: "Черные",type: "№20",unit: "шт.",price:1000, qty: 1000},
    {color: "Синие",type: "№20",unit: "шт.",price:1000, qty: 1000},
    {color: "Оранжевые",type: "№20",unit: "шт.",price:1000, qty: 1000},
    {color: "Василёк",type: "№20",unit: "шт.",price:1000, qty: 1000},
    {color: "Белые",type: "№20",unit: "шт.",price:1000, qty: 1000},
  ]

  for (let i = 0; i < buttons.length; i++) {
    await prisma.buttons.create({
      data: buttons[i]
    });
  }

  const fabrics = [
    { type: "Костюмные ткани", name: "Орион", color: "красный", unit: "м", price: 1500, qty: 1000 },
    { type: "Костюмные ткани", name: "Орион", color: "оранжевый", unit: "м", price: 1500, qty: 1000 },
    { type: "Костюмные ткани", name: "Орион", color: "серый", unit: "м", price: 1500, qty: 1000 },
    { type: "Костюмные ткани", name: "Орион", color: "черный", unit: "м", price: 1500, qty: 1000 },
    { type: "Костюмные ткани", name: "Орион", color: "темно синий", unit: "м", price: 1500, qty: 1000 },
    { type: "Костюмные ткани", name: "Орион", color: "лимонный", unit: "м", price: 1500, qty: 1000 },
    { type: "Костюмные ткани", name: "Твил", color: "серый", unit: "м", price: 1200, qty: 1000 },
    { type: "Костюмные ткани", name: "Твил", color: "василек", unit: "м", price: 1200, qty: 1000 },
    { type: "Костюмные ткани", name: "Твил", color: "красный", unit: "м", price: 1200, qty: 1000 },
    { type: "Костюмные ткани", name: "Твил", color: "темно синий", unit: "м", price: 1200, qty: 1000 },
    { type: "Костюмные ткани", name: "Твил", color: "оранжевый", unit: "м", price: 1200, qty: 1000 },
    { type: "Костюмные ткани", name: "Твил", color: "черный", unit: "м", price: 1200, qty: 1000 },
    { type: "Костюмные ткани", name: "Твил", color: "морская волна", unit: "м", price: 1200, qty: 1000 },
    { type: "Костюмные ткани", name: "Твил", color: "терракот", unit: "м", price: 1200, qty: 1000 },
    { type: "Костюмные ткани", name: "Канвас", color: "серый", unit: "м", price: 1500, qty: 1000 },
    { type: "Костюмные ткани", name: "Канвас", color: "хаки", unit: "м", price: 1500, qty: 1000 },
    { type: "Костюмные ткани", name: "Канвас", color: "бежевый", unit: "м", price: 1500, qty: 1000 },
    { type: "Костюмные ткани", name: "Канвас", color: "синий", unit: "м", price: 1500, qty: 1000 },
    { type: "Костюмные ткани", name: "Канвас", color: "черный", unit: "м", price: 1500, qty: 1000 },
    { type: "Костюмные ткани", name: "Халатная ткань", color: "белый", unit: "м", price: 700, qty: 1000 },
    { type: "Костюмные ткани", name: "Халатная ткань", color: "темно синий", unit: "м", price: 700, qty: 1000 },
    { type: "Костюмные ткани", name: "Халатная ткань", color: "серый", unit: "м", price: 700, qty: 1000 },
    { type: "Костюмные ткани", name: "Халатная ткань", color: "василек", unit: "м", price: 700, qty: 1000 },
    { type: "Костюмные ткани", name: "Хлопок", color: "василек", unit: "м", price: 1300, qty: 1000 },
    { type: "Костюмные ткани", name: "Тафета (подклад)", color: "темно синий", unit: "м", price: 350, qty: 1000 },
    { type: "Костюмные ткани", name: "Тафета (подклад)", color: "хаки", unit: "м", price: 350, qty: 1000 },
    { type: "Костюмные ткани", name: "Тафета (подклад)", color: "серый", unit: "м", price: 350, qty: 1000 },
    { type: "Костюмные ткани", name: "Тафета (подклад)", color: "черный", unit: "м", price: 350, qty: 1000 },
    { type: "Костюмные ткани", name: "Болонь Аляска", color: "синий", unit: "м", price: 1600, qty: 1000 },
    { type: "Костюмные ткани", name: "Болонь Аляска", color: "серый", unit: "м", price: 1600, qty: 1000 },
    { type: "Костюмные ткани", name: "Кошачий глаз", color: "синий", unit: "м", price: 1600, qty: 1000 },
    { type: "Костюмные ткани", name: "Кошачий глаз", color: "темно синий", unit: "м", price: 1600, qty: 1000 },
    { type: "Костюмные ткани", name: "Кошачий глаз", color: "василек", unit: "м", price: 1600, qty: 1000 },
    { type: "Костюмные ткани", name: "Кошачий глаз", color: "красный", unit: "м", price: 1600, qty: 1000 },
    { type: "Костюмные ткани", name: "Кошачий глаз", color: "серый", unit: "м", price: 1600, qty: 1000 },
    { type: "Костюмные ткани", name: "Полиджордан (болонь)", color: "черный", unit: "м", price: 1600, qty: 1000 },
    { type: "Костюмные ткани", name: "Полиджордан (болонь)", color: "серый", unit: "м", price: 1600, qty: 1000 },
    { type: "Костюмные ткани", name: "Полиджордан (болонь)", color: "василек", unit: "м", price: 1600, qty: 1000 },
    { type: "Костюмные ткани", name: "Полиджордан (болонь)", color: "красный", unit: "м", price: 1600, qty: 1000 },
    { type: "Костюмные ткани", name: "Лидер", color: "бежевый", unit: "м", price: 2500, qty: 1000 },
    { type: "Костюмные ткани", name: "Зоро Лайкра", color: "бежевый", unit: "м", price: 1800, qty: 1000 },
    { type: "Костюмные ткани", name: "Зоро Лайкра", color: "серый", unit: "м", price: 1800, qty: 1000 },
    { type: "Костюмные ткани", name: "Зоро Лайкра", color: "кофе", unit: "м", price: 1800, qty: 1000 },
    { type: "Костюмные ткани", name: "Верона", color: "хаки", unit: "м", price: 1800, qty: 1000 },
    { type: "Костюмные ткани", name: "Верона", color: "серый", unit: "м", price: 1800, qty: 1000 },
    { type: "Костюмные ткани", name: "Пиксель", color: "светлый хаки", unit: "м", price: 1800, qty: 1000 },
    { type: "Костюмные ткани", name: "Пиксель", color: "хаки", unit: "м", price: 1800, qty: 1000 },
    { type: "Костюмные ткани", name: "Пиксель", color: "синий", unit: "м", price: 1800, qty: 1000 },
    { type: "Костюмные ткани", name: "Пиксель", color: "черный", unit: "м", price: 1800, qty: 1000 },
    { type: "Кехнические ткани", name: "Бельтинг", color: "", unit: "м", price: 2500, qty: 1000 },
    { type: "Кехнические ткани", name: "Брезент", color: "292 ХПВ", unit: "м", price: 2200, qty: 1000 },
    { type: "Кехнические ткани", name: "Брезент", color: "293 ХПВ", unit: "м", price: 2500, qty: 1000 },
    { type: "Кехнические ткани", name: "Брезент", color: "292 ХОП", unit: "м", price: 2200, qty: 1000 },
    { type: "Кехнические ткани", name: "Брезент", color: "293 ХОП", unit: "м", price: 2500, qty: 1000 },
    { type: "Кехнические ткани", name: "Брезент", color: "11252 СКПВ", unit: "м", price: 2000, qty: 1000 },
    { type: "Кехнические ткани", name: "Брезент", color: "11193 СКПВ", unit: "м", price: 1800, qty: 1000 },
    { type: "Кехнические ткани", name: "Брезент", color: "11192 ОП", unit: "м", price: 1800, qty: 1000 },
    { type: "Кехнические ткани", name: "Двунитка", color: "белый", unit: "м", price: 500, qty: 1000 },
    { type: "Кехнические ткани", name: "Спилок", color: "", unit: "кв.дм", price: 90, qty: 10000 },
    { type: "Кехнические ткани", name: "Палатка", color: "3*3", unit: "м", price: 1500, qty: 10000 },
    { type: "Кехнические ткани", name: "Палатка", color: "4*4", unit: "м", price: 1900, qty: 10000 },
    { type: "Синтепон флис", name: "Флис", color: "серый", unit: "м", price: 850, qty: 1000 },
    { type: "Синтепон флис", name: "Флис", color: "синий", unit: "м", price: 850, qty: 1000 },
    { type: "Синтепон флис", name: "Флис", color: "василек", unit: "м", price: 850, qty: 1000 },
    { type: "Синтепон флис", name: "Флис", color: "черный", unit: "м", price: 850, qty: 1000 },
    { type: "Синтепон флис", name: "Флис", color: "красный", unit: "м", price: 850, qty: 1000 },
    { type: "Синтепон флис", name: "Войлок", color: "", unit: "м", price: 0, qty: 0 },
    { type: "Синтепон флис", name: "Синтепон", color: "300", unit: "м", price: 600, qty: 1000 },
    { type: "Синтепон флис", name: "Синтепон", color: "200", unit: "м", price: 400, qty: 1000 },
    { type: "Синтепон флис", name: "Синтепон", color: "250", unit: "м", price: 500, qty: 1000 },
    { type: "Синтепон флис", name: "Слайтекс", color: "200", unit: "м", price: 1200, qty: 1000 }
  ];

  for (let i = 0; i < fabrics.length; i++) {
    await prisma.fabrics.create({
      data: fabrics[i]
    });
  }

  const accessories = [
    { name: "СОП 5см 1 боб 100 м.",unit: "шт.",price:1000, qty: 1000 },
    { name: "СОП 3см1 боб 100 м.",unit: "шт.",price:1000, qty: 1000 },
    { name: "СОП кант 1 боб 100 м.",unit: "шт.",price:1000, qty: 5000 },
    { name: "Резинка 5 см 1 боб 25 метров",unit: "шт.",price:1000, qty: 1000 },
    { name: "Резинка 4 см 1 боб 25 метров",unit: "шт.",price:1000, qty: 1000 },
    { name: "Резинка 3 см 1 боб 25 метров",unit: "шт.",price:1000, qty: 1000 },
    { name: "Резинка 2 см 1 боб 25 метров",unit: "шт.",price:1000, qty: 1000 },
    { name: "Резинка 1 см 1 боб 100 метров",unit: "шт.",price:1000, qty: 1000 },
    { name: "Резинка шляп 1 боб 50 метров",unit: "шт.",price:1000, qty: 1000 },
    { name: "Шнур капрон. 1 боб 100 метров",unit: "шт.",price:1000, qty: 1000 },
    { name: "Карабины",unit: "шт.",price:1000, qty: 5000 },
    { name: "Пряжки обыч",unit: "шт.",price:1000, qty: 5000 },
    { name: "Пряжки двой",unit: "шт.",price:1000, qty: 5000 },
    { name: "Колокольчик",unit: "шт.",price:1000, qty: 5000 },
    { name: "Стопр обыч.",unit: "шт.",price:1000, qty: 5000 },
    { name: "Стопр двойн.",unit: "шт.",price:1000, qty: 5000 }
  ];

  for (let i = 0; i < accessories.length; i++) {
    await prisma.accessories.create({
      data: accessories[i]
    });
  }

  const velcro = [
    { name: "Rрасная 2,5",unit: "шт.",price:1000, qty: 1000},
    { name: "Хаки 2,5",unit: "шт.",price:1000,qty: 1000 },
    { name: "Черная 2,5",unit: "шт.",price:1000,qty: 1000 },
    { name: "Синяя 2,5",unit: "шт.",price:1000,qty: 1000 },
    { name: "Серая 2,5",unit: "шт.",price:1000,qty: 1000 },
    { name: "Оранжевая",unit: "шт.",price:1000,qty: 1000 }
  ];

  for (let i = 0; i < velcro.length; i++) {
    await prisma.velcro.create({
      data: velcro[i]
    });
  }

  return NextResponse.json({status: "ok"});
}