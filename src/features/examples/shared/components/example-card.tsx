import { Icons } from '@/components/icons';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface ExampleCardProps {
  title: string;
  /** One sentence; the docs hold the detail */
  description: string;
  /** The file to read for this demo, from the repo root */
  source: string;
  /** Header badge, top right (e.g. where the call runs) */
  action?: React.ReactNode;
  /** Row under the demo: readouts on the left, a button on the right */
  controls?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * One demo on an example page: title, one sentence, the live demo, and a footer
 * naming the file to read. Skeletons render the same card with the same copy, so
 * only the demo area changes when data arrives.
 */
export function ExampleCard({
  title,
  description,
  source,
  action,
  controls,
  children
}: ExampleCardProps) {
  const slash = source.lastIndexOf('/') + 1;

  return (
    <Card className='min-w-0'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className='text-pretty'>{description}</CardDescription>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className='flex-1'>{children}</CardContent>
      {controls && (
        <div className='flex min-h-8 flex-wrap items-center gap-x-4 gap-y-2 px-(--card-spacing)'>
          {controls}
        </div>
      )}
      <CardFooter className='text-muted-foreground gap-2 py-2.5 text-xs'>
        <Icons.code className='size-3.5 shrink-0' aria-hidden />
        <span className='sr-only'>Source file:</span>
        <code className='min-w-0 font-mono [overflow-wrap:anywhere]'>
          {source.slice(0, slash)}
          <span className='text-foreground'>{source.slice(slash)}</span>
        </code>
      </CardFooter>
    </Card>
  );
}
