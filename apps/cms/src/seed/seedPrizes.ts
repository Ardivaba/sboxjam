import { getPayload } from "payload";
import config from "@payload-config";
import { seedPrizes } from "./seedFunctions";

const payload = await getPayload({ config });
await seedPrizes(payload);
process.exit(0);
