import { getPayload } from "payload";
import config from "@payload-config";
import {
  seedJamSettings,
  seedPrizes,
  seedRules,
  seedGuides,
  seedSchedule,
  seedTeams,
} from "./seedFunctions";

async function seedAll() {
  const payload = await getPayload({ config });

  console.log("\n========================================");
  console.log("  s&box Jam — Database Seeder");
  console.log("========================================\n");

  console.log("[1/6] Jam Settings");
  console.log("----------------------------------------");
  await seedJamSettings(payload);
  console.log("");

  console.log("[2/6] Prizes");
  console.log("----------------------------------------");
  await seedPrizes(payload);
  console.log("");

  console.log("[3/6] Rules");
  console.log("----------------------------------------");
  await seedRules(payload);
  console.log("");

  console.log("[4/6] Guides");
  console.log("----------------------------------------");
  await seedGuides(payload);
  console.log("");

  console.log("[5/6] Schedule");
  console.log("----------------------------------------");
  await seedSchedule(payload);
  console.log("");

  console.log("[6/6] Teams & Participants");
  console.log("----------------------------------------");
  await seedTeams(payload);
  console.log("");

  console.log("========================================");
  console.log("  All seeding complete!");
  console.log("========================================\n");
}

console.log("Starting seeder...\n");
await seedAll();
process.exit(0);
