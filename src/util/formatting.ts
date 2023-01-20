import { Duration } from 'luxon';

export const formatDuration = (totalSeconds: number): string => {
  const duration = Duration.fromObject({ seconds: totalSeconds })
    .rescale()
    .shiftTo('hours', 'minutes', 'seconds');
  return duration.hours > 0
    ? duration.toFormat('h:mm:ss')
    : duration.toFormat('mm:ss');
};

export const humanize = (totalSeconds: number): string => {
  const duration = Duration.fromObject({ seconds: totalSeconds }).rescale();
  return duration.toHuman();
};
