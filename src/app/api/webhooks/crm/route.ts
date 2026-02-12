import { NextRequest, NextResponse } from "next/server";

interface WebhookEvent {
  type: string;
  locationId: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body: WebhookEvent = await request.json();

    // Validate webhook has required fields
    if (!body.type || !body.locationId) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    // Route events to handlers
    switch (body.type) {
      case "contact.created":
        // Future: sync new users, trigger onboarding
        break;
      case "contact.updated":
        // Future: sync user profile changes
        break;
      case "contact.deleted":
        // Future: cleanup user data
        break;
      default:
        // Log unhandled event types
        console.log(`Unhandled webhook event: ${body.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Webhook processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
