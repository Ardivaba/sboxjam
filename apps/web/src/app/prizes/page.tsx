import { fetchCollection } from "@/lib/payload";
import type { Prize } from "@/lib/types";
import { PrizesContent } from "@/features/prizes/PrizesContent";

export default async function PrizesPage() {
  let prizes: Prize[] = [];

  try {
    const data = await fetchCollection<Prize>("prizes", { sort: "order", limit: 50 });
    prizes = data.docs;
  } catch {}

  return <PrizesContent prizes={prizes} />;
}
