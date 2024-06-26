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
      // PermissionsEnum.CREATE_HUB_ADMIN,
      PermissionsEnum.CREATE_DFSP_ADMIN,

      PermissionsEnum.VIEW_DFSPS,
      PermissionsEnum.CREATE_DFSPS,
      PermissionsEnum.EDIT_DFSPS,
      PermissionsEnum.DELETE_DFSPS,

      PermissionsEnum.VIEW_PORTAL_USERS,
      PermissionsEnum.EDIT_PORTAL_USERS_STATUS,

      PermissionsEnum.VIEW_MERCHANTS,

      PermissionsEnum.VIEW_ROLES,

      PermissionsEnum.VIEW_AUDIT_LOGS,

      PermissionsEnum.EDIT_SERVER_LOG_LEVEL,

      PermissionsEnum.VIEW_TRANSACTIONS,

      PermissionsEnum.VIEW_RECONCILIATIONS,

      PermissionsEnum.CLOSE_RECONCILIATIONS,

      PermissionsEnum.EDIT_PORTAL_USERS,
      PermissionsEnum.EXPORT_MERCHANTS,
      PermissionsEnum.CREATE_ROLES,
      PermissionsEnum.EDIT_ROLES,
      PermissionsEnum.EDIT_PORTAL_USERS,
      PermissionsEnum.CHANGE_RECON_MISMATCH_STATUS,

    ]
  }
]
