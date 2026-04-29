import { getPayload } from "payload";
import config from "@payload-config";
import { seedRules } from "./seedFunctions";

const payload = await getPayload({ config });
await seedRules(payload);
process.exit(0);
