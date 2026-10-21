/** A short bulleted list of rules on an example card. */
export function RulesList({ rules }: { rules: readonly string[] }) {
  return (
    <ul className='text-muted-foreground grid list-disc gap-2 ps-4 text-sm text-pretty'>
      {rules.map((rule) => (
        <li key={rule}>{rule}</li>
      ))}
    </ul>
  );
}
