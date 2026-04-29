import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const team = db.teams.findById(id);
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const isMember = team.members.some((m) => m.id === userId);
  if (!isMember) {
    return NextResponse.json({ error: "Not a member of this team" }, { status: 403 });
  }

  return NextResponse.json({ inviteCode: team.inviteCode });
}
