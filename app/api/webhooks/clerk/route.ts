import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const headerList = headers();

  const svixId = (await headerList).get("svix-id");
  const svixTimestamp = (await headerList).get("svix-timestamp");
  const svixSignature = (await headerList).get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const wh = new Webhook(webhookSecret);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;

  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (error) {
    console.error("Webhook verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = event;

  if (type == "user.created") {
    const email = data.email_addresses?.[0]?.email_address;

    if (!email) {
      return new Response("No email", { status: 400 });
    }

    await prisma.user.create({
      data: {
        clerkId: data.id,
        email,
        name: data.first_name ?? null,
      },
    });
  }

  return new Response("OK")
}
