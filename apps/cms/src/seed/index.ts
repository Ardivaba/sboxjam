import { getPayload, type Payload } from "payload";
import config from "@payload-config";
import { participantsData } from "./data/participants";
import { teamsData } from "./data/teams";

async function clearCollection(
  payload: Payload,
  collection: "teams" | "participants" | "join-requests",
) {
  const existing = await payload.find({ collection, limit: 1000, depth: 0 });
  if (existing.docs.length > 0) {
    await Promise.all(
      existing.docs.map((doc) => payload.delete({ collection, id: doc.id })),
    );
  }
  return existing.docs.length;
}

async function seedAll() {
  const payload = await getPayload({ config });

  console.log("\n========================================");
  console.log("  s&box LFG — Database Seeder");
  console.log("========================================\n");

  console.log("Clearing existing data...");
  for (const collection of ["join-requests", "teams", "participants"] as const) {
    const cleared = await clearCollection(payload, collection);
    if (cleared > 0) console.log(`  Cleared ${cleared} ${collection}`);
  }

  console.log("\nCreating participants...");
  const participantIds: string[] = [];
  for (const p of participantsData) {
    const doc = await payload.create({
      collection: "participants",
      data: {
        username: p.username,
        email: `${p.username}@example.com`,
        password: "password123",
        discordId: `seed-${p.username}`,
        roles: p.roles,
        bio: p.bio,
        skills: p.skills,
        lookingForTeam: p.lookingForTeam,
        discordHandle: p.discordHandle,
        portfolio: p.portfolio,
      },
    });
    participantIds.push(doc.id);
  }
  console.log(`  ✓ Created ${participantsData.length} participants`);

  console.log("\nCreating teams...");
  // Team members come from the participants who are NOT looking for a team,
  // plus overflow from the rest of the pool.
  let cursor = 0;
  for (const team of teamsData) {
    const memberIds = participantIds.slice(cursor, cursor + team.memberCount);
    cursor += team.memberCount;
    if (memberIds.length === 0) break;

    await payload.create({
      collection: "teams",
      data: {
        name: team.name,
        description: team.description,
        leader: memberIds[0],
        members: memberIds,
        maxMembers: 4,
        rolesNeeded: team.rolesNeeded,
        lookingForMembers: team.lookingForMembers,
      },
    });
  }
  console.log(`  ✓ Created ${teamsData.length} teams`);

  console.log("\n========================================");
  console.log("  Seeding complete!");
  console.log("========================================\n");
}

console.log("Starting seeder...\n");
await seedAll();
process.exit(0);
