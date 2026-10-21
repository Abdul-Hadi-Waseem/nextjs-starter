// `14:03:27 UTC`. UTC so the server and the browser render the same text.
const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'UTC'
});

export function formatTime(iso: string) {
  return `${timeFormatter.format(new Date(iso))} UTC`;
}
