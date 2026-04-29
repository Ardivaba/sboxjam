import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const mine = request.nextUrl.searchParams.get("mine");

  if (mine === "true") {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const team = db.teams.findByMemberId(userId);
    return NextResponse.json({ team: team ?? null });
  }

  const teams = db.teams.findAll();
  return NextResponse.json({ teams });
}

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingTeam = db.teams.findByMemberId(userId);
  if (existingTeam) {
    return NextResponse.json({ error: "Already on a team" }, { status: 400 });
  }

  const { name, description } = await request.json();
  const user = db.users.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const team = db.teams.create({
    name,
    description,
    leaderId: userId,
    leaderName: user.username,
  });

  db.users.update(userId, { teamId: team.id });

  return NextResponse.json({ team }, { status: 201 });
}
