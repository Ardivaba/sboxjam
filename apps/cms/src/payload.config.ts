import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import path from "path";
import { fileURLToPath } from "url";
import { Users } from "./collections/Users";
import { Participants } from "./collections/Participants";
import { Teams } from "./collections/Teams";
import { Prizes } from "./collections/Prizes";
import { Rules } from "./collections/Rules";
import { Guides } from "./collections/Guides";
import { ScheduleEvents } from "./collections/ScheduleEvents";
import { Submissions } from "./collections/Submissions";
import { Media } from "./collections/Media";
import { JamSettings } from "./globals/JamSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Participants,
    Teams,
    Prizes,
    Rules,
    Guides,
    ScheduleEvents,
    Submissions,
    Media,
  ],
  globals: [JamSettings],
  secret: process.env.PAYLOAD_SECRET || "dev-secret",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "mongodb://localhost:27017/sboxjam",
  }),
  cors: [
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  csrf: [
    "http://localhost:3000",
    "http://localhost:3001",
  ],
});
