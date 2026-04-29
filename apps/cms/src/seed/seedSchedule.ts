import { getPayload } from "payload";
import config from "@payload-config";
import { seedSchedule } from "./seedFunctions";

const payload = await getPayload({ config });
await seedSchedule(payload);
process.exit(0);
