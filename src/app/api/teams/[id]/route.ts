import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const team = db.teams.findById(id);
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }
  return NextResponse.json({ team });
}

export async function DELETE(
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

  if (team.leaderId !== userId) {
    return NextResponse.json({ error: "Only the leader can delete the team" }, { status: 403 });
  }

  for (const member of team.members) {
    db.users.update(member.id, { teamId: undefined });
  }

  db.teams.removeMember(id, team.leaderId);
  for (const member of team.members.filter((m) => m.id !== team.leaderId)) {
    db.teams.removeMember(id, member.id);
  }

  return NextResponse.json({ success: true });
}
