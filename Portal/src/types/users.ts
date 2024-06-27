import type { PortalUserStatus } from '../../../shared-lib'
import type { Role } from './roles'

export interface User {
  id: number
  name: string
  email: string
  phone_number: string
  status: string
  email_verification_status: string
  role: string
  dfsp: string | null,
  role_id: number
}

export type ServerUser = {
  id: number
  name: string
  email: string
  phone_number: string
  role: Role
  status: PortalUserStatus
  created_at: string
  updated_at: string
  email_verification_status: string
  role_id: number
}

export interface ChangePassword {
  oldPassword: string | null,
  newPassword: string
}
