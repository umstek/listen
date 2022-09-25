import { Duration } from "luxon";

export const formatDuration = (totalSeconds: number): string => {
  const duration = Duration.fromObject({ seconds: totalSeconds }).normalize();

  return duration.hours > 0 ? duration.toFormat("hh:mm:ss") : duration.toFormat("mm:ss");
}
