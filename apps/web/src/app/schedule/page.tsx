import { fetchCollection } from "@/lib/payload";
import type { ScheduleEvent } from "@/lib/types";
import { ScheduleContent } from "@/features/schedule/ScheduleContent";

export default async function SchedulePage() {
  let events: ScheduleEvent[] = [];

  try {
    const data = await fetchCollection<ScheduleEvent>("schedule-events", { sort: "order", limit: 50 });
    events = data.docs;
  } catch {}

  return <ScheduleContent events={events} />;
}
