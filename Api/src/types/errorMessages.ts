export const ERROR_MESSAGES = {
  DFSP_NOT_FOUND_HEADER: 'DFSP not found in request header',
  DFSP_NOT_FOUND: 'DFSP not found',
  TILL_CODE_EXISTS: (code: string) => `Merchant code ${code} already exists`,
  MERCHANT_NAME_MISMATCH: (merchantName: string, existingMerchantName: string) => `Merchant name ${merchantName} does not match business name from the provided license number ${existingMerchantName}`
}
