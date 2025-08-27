
export interface TransactionsCount {
  posted: number;
  pending: number;
}

// Common properties for all extra fields, then specific ones
export interface BaseAccountExtra {
  status?: string;
  client_name?: string;
  account_name?: string;
  current_date?: string;
  current_time?: string;
  account_number?: string;
  balance_updated_at?: string;
  transactions_count?: TransactionsCount;
  last_posted_transaction_id?: string;
  swift?: string;
  sort_code?: string;
  bban?: string;
  iban?: string;
}

export interface CardAccountExtra extends BaseAccountExtra {
  card_type?: string;
  expiry_date?: string;
  blocked_amount?: number;
  closing_balance?: number;
  next_payment_date?: string;
  next_payment_amount?: number;
}

export interface CreditAccountExtra extends BaseAccountExtra {
  credit_limit?: number;
  available_amount?: number;
  cards?: string[]; // Array of card numbers (e.g., last 4 digits)
}

export interface GeneralAccountExtra extends BaseAccountExtra {
  cards?: string[]; // Array of card numbers (e.g., last 4 digits)
}

// A discriminated union for better type safety based on 'nature' if you want
export type AccountExtra = CardAccountExtra | CreditAccountExtra | GeneralAccountExtra;


export interface AccountData {
  id: string;
  connection_id: string;
  name: string;
  nature: 'card' | 'account' | 'credit' | 'credit_card'; // Define possible natures
  balance: number;
  currency_code: string;
  extra: AccountExtra; // Use the union type for extra
  created_at: string;
  updated_at: string;
}