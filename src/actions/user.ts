"use server";

import { auth } from "@/auth";

export async function GetUser() {
  const session = await auth();

  if (!session?.user) return null;

  return session?.user;
}
