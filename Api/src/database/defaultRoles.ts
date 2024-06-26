import { PermissionsEnum } from '../types/permissions'

export const DefaultRoles = [
  {
    name: 'Hub Super Admin',
    description: 'Hub Super Admin Role',
  },
  {
    name: 'Hub Admin',
    description: 'Hub Admin Role',
    level: 'Hub',
    permissions: [
      PermissionsEnum.CREATE_PORTAL_USERS,
      PermissionsEnum.VIEW_PORTAL_USERS,
      PermissionsEnum.VIEW_ROLES,
      PermissionsEnum.EDIT_PORTAL_USERS,


    ]
  }
]
