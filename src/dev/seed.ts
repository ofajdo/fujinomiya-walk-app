//作る用

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 座標データをそのまま貼り付け
  const rawData = `
`;

  // 改行で分割して [lat, lng] の配列に変換
  const coordinates = rawData
    .trim()
    .split("\n")
    .map((line) => line.split(",").map((v) => v.trim()));

  const courseId = ""; // 実際のcourseIdに置き換えてください
  const now = new Date();

  const data = coordinates.map(([lat, lng], index) => ({
    latitude: lat,
    longitude: lng,
    courseId,
    display: false,
    sort: new Date(now.getTime() + index * 100), // 順番を保つ
  }));

  await prisma.route.createMany({
    data,
  });

  console.log("データ追加完了！");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
