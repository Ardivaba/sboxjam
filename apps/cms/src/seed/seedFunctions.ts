import type { Payload } from "payload";
import { prizesData } from "./data/prizes";
import { rulesData } from "./data/rules";
import { guidesData } from "./data/guides";
import { scheduleData } from "./data/schedule";
import { teamsData } from "./data/teams";
import { jamSettingsData } from "./data/jamSettings";

async function clearCollection(payload: Payload, collection: "prizes" | "rules" | "guides" | "schedule-events" | "submissions" | "teams" | "participants") {
  const existing = await payload.find({ collection, limit: 1000, depth: 0 });
  if (existing.docs.length > 0) {
    await Promise.all(
      existing.docs.map((doc) => payload.delete({ collection, id: doc.id }))
    );
  }
  return existing.docs.length;
}

export async function seedJamSettings(payload: Payload) {
  console.log("  Configuring jam settings...");
  await payload.updateGlobal({
    slug: "jam-settings",
    data: jamSettingsData,
  });
  console.log("  ✓ Jam settings configured");
}

export async function seedPrizes(payload: Payload) {
  console.log("  Clearing existing prizes...");
  const cleared = await clearCollection(payload, "prizes");
  if (cleared > 0) console.log(`  Cleared ${cleared} existing prizes`);

  console.log("  Creating prizes...");
  for (const prize of prizesData) {
    await payload.create({ collection: "prizes", data: prize });
  }
  console.log(`  ✓ Created ${prizesData.length} prizes`);
}

export async function seedRules(payload: Payload) {
  console.log("  Clearing existing rules...");
  const cleared = await clearCollection(payload, "rules");
  if (cleared > 0) console.log(`  Cleared ${cleared} existing rules`);

  console.log("  Creating rules...");
  for (const rule of rulesData) {
    await payload.create({ collection: "rules", data: rule });
  }
  console.log(`  ✓ Created ${rulesData.length} rules`);
}

export async function seedGuides(payload: Payload) {
  console.log("  Clearing existing guides...");
  const cleared = await clearCollection(payload, "guides");
  if (cleared > 0) console.log(`  Cleared ${cleared} existing guides`);

  console.log("  Creating guides...");
  for (const guide of guidesData) {
    // Lexical helper output is structurally compatible with Payload's
    // SerializedEditorState but has a slightly looser node type; cast to
    // satisfy the strict generated type.
    await payload.create({ collection: "guides", data: guide as never });
  }
  console.log(`  ✓ Created ${guidesData.length} guides`);
}

export async function seedSchedule(payload: Payload) {
  console.log("  Clearing existing schedule events...");
  const cleared = await clearCollection(payload, "schedule-events");
  if (cleared > 0) console.log(`  Cleared ${cleared} existing events`);

  console.log("  Creating schedule events...");
  for (const event of scheduleData) {
    await payload.create({ collection: "schedule-events", data: event });
  }
  console.log(`  ✓ Created ${scheduleData.length} schedule events`);
}

export async function seedTeams(payload: Payload) {
  console.log("  Clearing existing teams and participants...");
  const clearedTeams = await clearCollection(payload, "teams");
  if (clearedTeams > 0) console.log(`  Cleared ${clearedTeams} existing teams`);
  const clearedParticipants = await clearCollection(payload, "participants");
  if (clearedParticipants > 0) console.log(`  Cleared ${clearedParticipants} existing participants`);

  console.log("  Creating participants...");
  const participants: string[] = [];
  const names = [
    "alex_dev", "sam_pixels", "jordan_code", "riley_3d",
    "casey_sound", "morgan_net", "quinn_vfx", "avery_ui",
    "taylor_sys", "skyler_gen", "drew_anim", "blake_ux",
    "charlie_ai", "pat_shader", "jamie_phys", "rowan_map",
  ];

  for (const name of names) {
    const doc = await payload.create({
      collection: "participants",
      data: {
        username: name,
        email: `${name}@example.com`,
        password: "password123",
        registeredForJam: true,
      },
    });
    participants.push(doc.id);
  }
  console.log(`  ✓ Created ${names.length} participants`);

  console.log("  Creating teams...");
  let participantIndex = 0;
  for (const team of teamsData) {
    const leaderIdx = participantIndex;
    const memberCount = team.lookingForMembers ? 2 + Math.floor(Math.random() * 2) : 4;
    const memberIds = participants.slice(participantIndex, participantIndex + memberCount);
    participantIndex += memberCount;

    if (memberIds.length === 0) break;

    await payload.create({
      collection: "teams",
      data: {
        name: team.name,
        description: team.description,
        leader: memberIds[0],
        members: memberIds,
        maxMembers: 4,
        lookingForMembers: team.lookingForMembers,
      },
    });
  }
  console.log(`  ✓ Created ${teamsData.length} teams`);
}
