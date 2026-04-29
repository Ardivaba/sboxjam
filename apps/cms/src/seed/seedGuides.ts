import { getPayload } from "payload";
import config from "@payload-config";
import { seedGuides } from "./seedFunctions";

const payload = await getPayload({ config });
await seedGuides(payload);
process.exit(0);
