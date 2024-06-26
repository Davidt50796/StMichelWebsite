export enum MerchantType {
  INDIVIDUAL = 'Individual',
  SMALL_SHOP = 'Small Shop',
  CHAIN_STORE = 'Chain Store'
}

export enum MerchantAllowBlockStatus {
  PENDING = 'Pending',
  ALLOWED = 'Allowed',
  BLOCKED = 'Blocked'
}

export enum MerchantRegistrationStatus {
  WAITINGALIASGENERATION = 'Waiting For Alias Generation',
  DRAFT = 'Draft',
  REVIEW = 'Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  REVERTED = 'Reverted',
}

export enum MerchantLookupStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum MerchantLocationType {
  PHYSICAL = 'Physical',
  VIRTUAL = 'Virtual',
}

export enum DFSPType {
  BANK = 'Bank and Credit Union',
  MMO = 'Mobile Money Operator',
  PSP = 'Payment Service Provider',
  EMI = 'Electronic Money Issuer',
  MFI = 'Microfinance Institution',
  OTHER = 'Other'
}

export enum PortalUserStatus {
  UNVERIFIED = "Unverified",
  RESETPASSWORD = "Reset Password",
  ACTIVE = "Active",
  DISABLED = "Disabled",
}

export enum NumberOfEmployees {
  ONE_TO_FIVE = '1 - 5',
  SIX_TO_TEN = '6 - 10',
  ELEVEN_TO_FIFTY = '11 - 50',
  FIFTY_ONE_TO_ONE_HUNDRED = '51 - 100',
  HUNDRED_PLUS_PLUS = '100++',
}

export enum BusinessOwnerIDType {
  PASSPORT = 'Passport',
  NATIONAL_ID = 'National ID',
  SSN = 'SSN',
}

export enum CommonStatusType {
  COMPLETED = 'Completed',
  PROCESSING = 'Processing',
  FAILED = 'Failed'
}

export enum HubAccountType {
  RECONCILIATION_ACC = "HUB_RECONCILIATION",
  SETTLEMENT_ACC = "HUB_MULTILATERAL_SETTLEMENT"
}

export enum LedgeAccountType {
  POSITION = 'POSITION',
  SETTLEMENT= 'SETTLEMENT'
}


export enum TransactionStatusType {
  FAILED = 'FAILED',
  ABORTED = 'ABORTED',
  COMPLETED = 'COMPLETED'
}

export enum DfspTransactionStatusType {
  FAILED = 'FAILED',
  ABORTED = 'ABORTED',
  COMPLETED = 'COMPLETED'
}

export enum ReconciliationSTATUSType {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  MISMATCHED = 'MISMATCHED',
  SETTLED = 'SETTLED'
}

export enum ReconciliationMismatchSTATES {
  MISMATCHED = 'MISMATCHED',
  SETTLED = 'SETTLED'
}

export enum ReconciliationMismatchVariances {
  IN_DB_ONLY = 'IN_DB_ONLY',
  IN_CSV_ONLY = 'IN_CSV_ONLY',
  AMOUNT_MISMATCH = 'AMOUNT_MISMATCH',
  STATUS_MISMATCH = 'STATUS_MISMATCH'
}

export enum MISMATCH_SOURCES {
  INDBONLY = 1,
  INCSVONLY = 2
}

export enum CommonActiveStatusType {
  ACTIVATED = 'Activated',
  DISABLED = 'Disabled'
}

export enum TRANSACTIONCURRENTSTATE {
  COMPLETED = 'COMPLETED'
}

export enum FileUploadModuleName {
  MERCHANT_REGISTRATION = 'BULK_MERCHANT_REGISTRATION',
  RECONCILIATION = 'RECONCILIATION'
}

export enum PortalRolesLevels {
  Hub = 'Hub',
  DFSP = 'DFSP',
  DFSP_USER = 'DFSP_USER'
}

export enum StatusType {
  ACTIVE = 'Active',
  DISABLED = 'Disabled'
}