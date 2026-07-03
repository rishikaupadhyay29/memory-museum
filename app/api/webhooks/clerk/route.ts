import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";
import type { WebhookEvent } from "@clerk/nextjs/server";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await request.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: WebhookEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  switch (event.type) {
    case "user.created": {
      const { id: clerkId, email_addresses, first_name, last_name, image_url } = event.data;
      const primaryEmail = email_addresses.find(
        (e) => e.id === event.data.primary_email_address_id
      );

      await prisma.user.upsert({
        where: { clerkId },
        create: {
          clerkId,
          email: primaryEmail?.email_address ?? "",
          displayName: [first_name, last_name].filter(Boolean).join(" ") || null,
          avatarUrl: image_url || null,
        },
        update: {
          email: primaryEmail?.email_address ?? "",
          displayName: [first_name, last_name].filter(Boolean).join(" ") || null,
          avatarUrl: image_url || null,
        },
      });
      break;
    }

    case "user.updated": {
      const { id: clerkId, email_addresses, first_name, last_name, image_url } = event.data;
      const primaryEmail = email_addresses.find(
        (e) => e.id === event.data.primary_email_address_id
      );

      await prisma.user.update({
        where: { clerkId },
        data: {
          email: primaryEmail?.email_address ?? "",
          displayName: [first_name, last_name].filter(Boolean).join(" ") || null,
          avatarUrl: image_url || null,
        },
      });
      break;
    }

    case "user.deleted": {
      const { id: clerkId } = event.data;
      if (clerkId) {
        await prisma.user.delete({ where: { clerkId } });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
