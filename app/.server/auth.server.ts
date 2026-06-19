import { clerkClient, getAuth } from "@clerk/react-router/server";
import type { User } from "../../generated/prisma/client";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { updateUserRole, upsertUserFromClerk } from "./user.server";

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number = 401,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

async function syncClerkUser(
  args: LoaderFunctionArgs,
  userId: string,
): Promise<User> {
  const client = clerkClient(args);
  const clerkUser = await client.users.getUser(userId);

  const primaryEmail = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId,
  );

  if (!primaryEmail?.emailAddress) {
    throw new AuthError("User has no email address", 400);
  }

  return upsertUserFromClerk({
    id: clerkUser.id,
    email: primaryEmail.emailAddress,
    name: clerkUser.fullName,
    imageUrl: clerkUser.imageUrl,
  });
}

export async function getOptionalUser(
  args: LoaderFunctionArgs,
): Promise<User | null> {
  const { userId } = await getAuth(args);
  if (!userId) return null;
  return syncClerkUser(args, userId);
}

export async function requireUserId(args: LoaderFunctionArgs): Promise<string> {
  const { userId } = await getAuth(args);
  if (!userId) {
    throw redirect("/");
  }
  await syncClerkUser(args, userId);
  return userId;
}

export async function requireUser(args: LoaderFunctionArgs): Promise<User> {
  const userId = await requireUserId(args);
  return syncClerkUser(args, userId);
}

export async function requireSeller(args: LoaderFunctionArgs): Promise<User> {
  const user = await requireUser(args);
  const client = clerkClient(args);
  const clerkUser = await client.users.getUser(user.id);
  const clerkRole = clerkUser.publicMetadata?.role;

  if (user.role !== "SELLER" && clerkRole !== "seller") {
    throw redirect("/");
  }

  if (user.role !== "SELLER" && clerkRole === "seller") {
    return updateUserRole(user.id, "SELLER");
  }

  return user;
}

export async function promoteToSeller(
  args: LoaderFunctionArgs,
  userId: string,
): Promise<User> {
  const client = clerkClient(args);
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role: "seller" },
  });
  return updateUserRole(userId, "SELLER");
}
