import { getPayload } from "payload";
import config from "@payload-config";
import { seedTeams } from "./seedFunctions";

const payload = await getPayload({ config });
await seedTeams(payload);
process.exit(0);
