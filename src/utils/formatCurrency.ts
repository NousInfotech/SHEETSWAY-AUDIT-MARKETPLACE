// src/utils/formatCurrency.ts

export function formatCurrency(amount: number): string {
  // Always use EUR and de-DE locale for euro formatting
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
} 