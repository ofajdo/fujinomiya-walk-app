"use server";
import prisma from "@/lib/db";

export const UsersGet = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const PostUserLocations = async ({
  id,
  user,
}: {
  id: string[];
  user: string;
}) => {
  const userLocationData = id.map((i) => {
    return {
      userId: user,
      locationId: i,
    };
  });

  if (!userLocationData) return;
  console.log(userLocationData);

  const createUserLocation = await prisma.userLocation.createMany({
    data: userLocationData,
    skipDuplicates: true,
  });
};

export const DeleteUserLocation = async ({
  id,
  user,
}: {
  id: string;
  user: string;
}) => {
  const deleteUserLocation = await prisma.userLocation.deleteMany({
    where: {
      userId: user,
      locationId: id,
    },
  });
};
