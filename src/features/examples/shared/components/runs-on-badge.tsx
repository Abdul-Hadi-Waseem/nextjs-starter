import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { RUNS_ON, type RunsOn } from '../constants/demo';

const LABEL: Record<RunsOn, string> = {
  [RUNS_ON.SERVER]: 'Runs on the server',
  [RUNS_ON.BROWSER]: 'Runs in the browser'
};

/** Where a call runs, with an icon so it doesn't rely on color. */
export function RunsOnBadge({ where }: { where: RunsOn }) {
  const Icon = where === RUNS_ON.SERVER ? Icons.server : Icons.browser;
  return (
    <Badge variant='secondary'>
      <Icon data-icon='inline-start' aria-hidden />
      {LABEL[where]}
    </Badge>
  );
}
