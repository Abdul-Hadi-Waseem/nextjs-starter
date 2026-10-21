import type { ReactNode } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  description: string;
  /** Header button or link, top right */
  action?: ReactNode;
  /**
   * What the chart shows, in words. Rendered as a visually hidden figcaption, so
   * screen readers get the trend the chart draws.
   */
  summary?: string;
  contentClassName?: string;
  children: ReactNode;
}

// The card every overview section uses. Its header is static, so a section's
// skeleton renders the same ChartCard and only the body is a placeholder.
export function ChartCard({
  title,
  description,
  action,
  summary,
  contentClassName,
  children
}: ChartCardProps) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      {/* With a summary the content is a <figure>, which then takes the layout classes */}
      <CardContent className={summary ? undefined : contentClassName}>
        {summary ? (
          <figure className={contentClassName}>
            {children}
            <figcaption className='sr-only'>{summary}</figcaption>
          </figure>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
