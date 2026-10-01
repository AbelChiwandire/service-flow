import { prisma } from "../prisma";

export type CreateUserInput = {
  name: string;
  businessName: string;
  email: string;
  passwordHash: string;
};

export type UpdateUserInput = {
  name?: string;
  businessName?: string;
  email?: string;
};

export async function createUser(input: CreateUserInput) {
  return prisma.user.create({
    data: {
      name: input.name,
      businessName: input.businessName,
      email: input.email,
      passwordHash: input.passwordHash,
    },
    select: {
      id: true,
      name: true,
      businessName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUser(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      businessName: true,
      email: true,
      passwordHash: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      businessName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
) {
  return prisma.user.update({
    where: { id },
    data: input,
    select: {
      id: true,
      name: true,
      businessName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      businessName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}