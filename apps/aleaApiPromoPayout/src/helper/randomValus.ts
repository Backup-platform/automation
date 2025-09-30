export function randomAmount(): number {

  const MIN = 1.00;
  const MAX = 10.00;

  const minCents = Math.round(MIN * 100);
  const maxCents = Math.round(MAX * 100);
  const cents = Math.floor(Math.random() * (maxCents - minCents + 1)) + minCents;
  return Number((cents / 100).toFixed(2));
}

export function randomPlace(): string {
  const MIN = 1;
  const MAX = 3;

  const cents = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
  return cents.toString();
} 