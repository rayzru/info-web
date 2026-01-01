import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

import { db } from "~/server/db";
import { publications } from "~/server/db/schema";
import { generateICS } from "~/lib/ics";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Fetch the event
  const event = await db.query.publications.findFirst({
    where: and(
      eq(publications.id, id),
      eq(publications.type, "event"),
      eq(publications.status, "published")
    ),
    with: {
      author: {
        columns: { name: true },
      },
    },
  });

  if (!event || !event.eventStartAt) {
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404 }
    );
  }

  // Extract text from content if it's JSON
  let description = "";
  if (event.content) {
    try {
      const content = typeof event.content === "string"
        ? JSON.parse(event.content)
        : event.content;
      description = extractTextFromContent(content);
    } catch {
      description = String(event.content);
    }
  }

  // Generate ICS content
  const icsContent = generateICS({
    id: event.id,
    title: event.title,
    description,
    location: event.eventLocation ?? undefined,
    startAt: new Date(event.eventStartAt),
    endAt: event.eventEndAt ? new Date(event.eventEndAt) : undefined,
    url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://sr2.ru"}/events/${event.id}`,
    organizer: event.eventOrganizer ?? event.author?.name ?? undefined,
  });

  // Return ICS file
  return new NextResponse(icsContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.id}.ics"`,
    },
  });
}

// Extract plain text from TipTap JSON content
function extractTextFromContent(content: unknown): string {
  if (!content || typeof content !== "object") return "";

  let text = "";

  function traverse(node: unknown) {
    if (!node || typeof node !== "object") return;
    const n = node as Record<string, unknown>;

    if (n.type === "text" && typeof n.text === "string") {
      text += n.text;
    }
    if (Array.isArray(n.content)) {
      n.content.forEach(traverse);
    }
  }

  traverse(content);
  return text;
}
