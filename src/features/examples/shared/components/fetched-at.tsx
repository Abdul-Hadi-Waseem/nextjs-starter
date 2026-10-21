import { formatTime } from '../lib/format-time';
import { Readout } from './readout';

/** "Fetched 14:03:27 UTC": the backend's timestamp, so caching and refetches are visible. */
export function FetchedAt({ iso, label = 'Fetched' }: { iso: string; label?: string }) {
  return <Readout label={label} value={formatTime(iso)} />;
}
