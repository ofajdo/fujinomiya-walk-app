"use server";
import prisma from "@/lib/db";

interface Location {
  id: string;
}

export async function LocationSerchById({ id }: Location) {
  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      course: {
        include: {
          routes: true,
          locations: {
            include: {
              place: true,
            },
          },
        },
      },
      culture: {
        include: { culture: true },
      },
      topic: {
        include: { topic: true },
      },
    },
  });

  return location;
}
