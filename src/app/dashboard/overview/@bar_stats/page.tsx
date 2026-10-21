import { delay } from '@/constants/mock-api';
import { BarGraph } from '@/features/overview/components/lazy-graphs';

export default async function BarStats() {
  await delay(1000);

  return <BarGraph />;
}
