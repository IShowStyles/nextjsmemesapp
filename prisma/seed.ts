import { PrismaClient } from "@/app/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.memes.deleteMany();

  await prisma.memes.createMany({
    data: [
      {
        name: "Doge",
        image: "https://i.imgflip.com/4t0m5.jpg",
        likesCount: 10,
      },
      {
        name: "Distracted Boyfriend",
        image: "https://i.imgflip.com/1ur9b0.jpg",
        likesCount: 25,
      },
      {
        name: "Success Kid",
        image: "https://i.imgflip.com/1bhk.jpg",
        likesCount: 30,
      },
      {
        name: "Roll Safe",
        image: "https://i.imgflip.com/1h7in3.jpg",
        likesCount: 18,
      },
      {
        name: "Change My Mind",
        image: "https://i.imgflip.com/24y43o.jpg",
        likesCount: 22,
      },
      {
        name: "Two Buttons",
        image: "https://i.imgflip.com/1g8my4.jpg",
        likesCount: 15,
      },
      {
        name: "Expanding Brain",
        image: "https://i.imgflip.com/1jwhww.jpg",
        likesCount: 12,
      },
      {
        name: "Drake Hotline Bling",
        image: "https://i.imgflip.com/30b1gx.jpg",
        likesCount: 33,
      },
      {
        name: "Left Exit 12 Off Ramp",
        image: "https://i.imgflip.com/22bdq6.jpg",
        likesCount: 8,
      },
      {
        name: "UNO Draw 25 Cards",
        image: "https://i.imgflip.com/3lmzyx.jpg",
        likesCount: 40,
      },
    ],
  });

  console.log("✅ Seeded memes");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
