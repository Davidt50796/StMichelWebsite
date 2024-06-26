export interface MerchantResponse {
  merchantID: string
  merchanType: string
  currency: string
  fspId: string | undefined
  fspName: string | undefined
  fspType: string | undefined
  fspLogoUri: string | undefined
  askPayeeDfsp: boolean
  party: {
    partyIdInfo: {
      partyIdType: string
      partyIdentifier: string
      fspId: string | undefined
    }
    merchantAccountNumber: string
    name: string
    personalInfo: {
      complexName: {
        firstName: string
        middleName: string | null
        lastName: string
        fullName: string
      }
      phoneNumber: string
      email: string
    }
  }
}
