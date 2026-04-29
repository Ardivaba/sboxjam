import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 });
  }

  const existing = db.users.findByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = db.users.create({ username, email, passwordHash });

  const token = await createToken(user.id);
  await setAuthCookie(token);

  const { passwordHash: _, ...safeUser } = user;
  return NextResponse.json({ user: safeUser }, { status: 201 });
}
