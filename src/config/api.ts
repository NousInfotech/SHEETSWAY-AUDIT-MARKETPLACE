// Centralized API endpoints for the marketplace

// Business Profiles
export const BUSINESS_PROFILES_API = '/api/v1/users/business-profiles';

// Plaid Integrations
export const PLAID_LINK_TOKEN_API = '/api/v1/plaid-integration/link-token';
export const PLAID_EXCHANGE_TOKEN_API = '/api/v1/plaid-integration/exchange-token';
export const PLAID_CREATE_ACCOUNT_API = '/api/v1/plaid-integration/create-account'; 

// List Plaid Accounts (for dropdown)
export const PLAID_ACCOUNTS_API = '/api/v1/users/plaid-accounts';

// Client Requests
export const CLIENT_REQUESTS_API = '/api/v1/client-request/';

// Centralized API object (optional, for easier import)
export const API = {
  BUSINESS_PROFILES: BUSINESS_PROFILES_API,
  PLAID_ACCOUNTS: PLAID_ACCOUNTS_API,
  CLIENT_REQUESTS: CLIENT_REQUESTS_API,
}; 