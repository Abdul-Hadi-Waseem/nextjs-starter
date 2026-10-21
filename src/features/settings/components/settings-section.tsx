import { useId } from 'react';

/** One settings group: heading and description on the left (md+), controls on the right. */
export function SettingsSection({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className='grid gap-4 border-t py-6 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-10'
    >
      <div className='space-y-1'>
        <h2 id={headingId} className='text-base font-medium'>
          {title}
        </h2>
        <p className='text-muted-foreground text-sm text-pretty'>{description}</p>
      </div>
      <div className='min-w-0 max-w-2xl'>{children}</div>
    </section>
  );
}
