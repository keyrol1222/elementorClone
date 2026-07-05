import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { RegisterInput } from "@/lib/validations/auth";

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existing) {
    return { error: "An account with this email already exists" } as const;
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return { user } as const;
}
