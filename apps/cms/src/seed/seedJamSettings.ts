import { getPayload } from "payload";
import config from "@payload-config";
import { seedJamSettings } from "./seedFunctions";

const payload = await getPayload({ config });
await seedJamSettings(payload);
process.exit(0);
