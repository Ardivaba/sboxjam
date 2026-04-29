import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingTeam = db.teams.findByMemberId(userId);
  if (existingTeam) {
    return NextResponse.json({ error: "Already on a team" }, { status: 400 });
  }

  const { id: inviteCode } = await params;
  const team = db.teams.findByInviteCode(inviteCode);
  if (!team) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  if (team.members.length >= team.maxMembers) {
    return NextResponse.json({ error: "Team is full" }, { status: 400 });
  }

  const user = db.users.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updatedTeam = db.teams.addMember(team.id, userId, user.username);
  db.users.update(userId, { teamId: team.id });

  return NextResponse.json({ team: updatedTeam });
}
