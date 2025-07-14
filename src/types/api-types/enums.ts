// shared/enums/index.ts
export enum Role {
  USER = 'USER',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

export enum RequestType {
  AUDIT = 'AUDIT',
  TAX = 'TAX',
}

export enum UrgencyLevel {
  NORMAL = 'NORMAL',
  URGENT = 'URGENT',
}

export enum AuditFramework {
  IFRS = 'IFRS',
  GAPSME = 'GAPSME',
  GAAP = 'GAAP',
  OTHER = 'OTHER',
}

export enum FirmSize {
  SOLO = 'SOLO',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum Country {
  GERMANY = 'GERMANY',
  FRANCE = 'FRANCE',
  MALTA = 'MALTA',
  UAE = 'UAE',
  INDIA = 'INDIA',
  UK = 'UK',
  USA = 'USA',
  NETHERLANDS = 'NETHERLANDS',
  IRELAND = 'IRELAND',
  OTHER = 'OTHER',
}

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  INR = 'INR',
  AED = 'AED',
  OTHER = 'OTHER',
}

export enum AccountStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  BANNED = 'BANNED',
}
