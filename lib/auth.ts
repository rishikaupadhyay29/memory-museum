import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

/**
 * Get the authenticated Clerk user ID from the current request context.
 * Throws if unauthenticated — call only from protected server actions/routes.
 */
export async function requireAuth(): Promise<{ userId: string; clerkId: string }> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("Unauthenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found in database — webhook may not have fired yet");
  }

  return { userId: user.id, clerkId };
}

/**
 * Get the full database User record for the authenticated Clerk user.
 * Returns null if the user is not authenticated or not yet synced.
 */
export async function getAuthUser(): Promise<User | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  return prisma.user.findUnique({ where: { clerkId } });
}

/**
 * Sync a Clerk user to the database. Called from the Clerk webhook handler.
 * Safe to call multiple times (upsert).
 */
export async function syncClerkUser(clerkId: string): Promise<User> {
  const clerkUser = await currentUser();

  if (!clerkUser || clerkUser.id !== clerkId) {
    throw new Error(`Cannot sync: Clerk user ${clerkId} not accessible in this context`);
  }

  const primaryEmail = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  );

  return prisma.user.upsert({
    where: { clerkId },
    create: {
      clerkId,
      email: primaryEmail?.emailAddress ?? "",
      displayName:
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
      avatarUrl: clerkUser.imageUrl || null,
    },
    update: {
      email: primaryEmail?.emailAddress ?? "",
      displayName:
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
      avatarUrl: clerkUser.imageUrl || null,
    },
  });
}

/**
 * Verify that a resource belongs to the authenticated user.
 * Throws if ownership check fails.
 */
export async function assertOwnership(
  resourceUserId: string,
  authUserId: string
): Promise<void> {
  if (resourceUserId !== authUserId) {
    throw new Error("Forbidden: resource does not belong to authenticated user");
  }
}
