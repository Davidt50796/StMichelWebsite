import { AppDataSource } from './dataSource'
import path from 'path'
import logger from '../services/logger'
import {
  CurrencyCodes,
  CurrencyDescriptions,
  PortalUserStatus
} from '../../../shared-lib'
import { hashPassword } from '../utils/utils'
import { PortalUserEntity } from '../entity/PortalUserEntity'
import { PortalRoleEntity } from '../entity/PortalRoleEntity'
import { DefaultHubSuperAdmin } from './defaultUsers'
import { type DataSource } from 'typeorm'
import { ApplicationStateEntity } from '../entity/ApplicationStateEntity'
import { CurrencyEntity } from '../entity/CurrencyEntity'
import { PortalPermissionEntity } from '../entity/PortalPermissionEntity'
import { DefaultRoles } from './defaultRoles'
import { PermissionsEnum } from '../types/permissions'

export const initializeDatabase = async (): Promise<void> => {
  logger.info('Connecting MySQL database...')

  await AppDataSource.initialize()
    .then(async () => {
      logger.info('MySQL Database Connection success.')
      await seedCurrency(AppDataSource)
      await seedDefaultRoles(AppDataSource)

      let applicationState = await AppDataSource.manager.findOne(ApplicationStateEntity, { where: {} })
      if (applicationState == null) {
        applicationState = new ApplicationStateEntity()
        applicationState.is_hub_onboarding_complete = false
        await AppDataSource.manager.save(applicationState)
      }

      if (!applicationState.is_hub_onboarding_complete) {
        await seedDefaultHubSuperAdmin(AppDataSource)
      }
    })
    .catch((error) => {
      
      throw error
    })
}

export async function seedDefaultHubSuperAdmin (appDataSource: DataSource): Promise<void> {
  logger.info('Seeding Default Hub Super Admin...')
  const roles = await appDataSource.manager.find(PortalRoleEntity)

  const user = DefaultHubSuperAdmin
  const userEntity = await appDataSource.manager.findOne(
    PortalUserEntity,
    { where: { email: user.email } }
  )

  if (userEntity != null) {
    logger.info(`User ${user.email} already seeded. Skipping...`)
    return
  }

  const newUserRole = roles.find(role => user.role === role.name)
  if (newUserRole == null) {
    throw new Error(`Role '${user.role}' not found for seeding with '${user.email}'.`)
  }

  const newUser = new PortalUserEntity()
  newUser.name = user.name
  newUser.email = user.email
  newUser.password = await hashPassword(user.password)
  newUser.phone_number = user.phone_number
  newUser.status = PortalUserStatus.ACTIVE
  newUser.role = newUserRole
  await appDataSource.manager.save(newUser)
}

export async function seedCurrency(appDataSource: DataSource): Promise<void> {
  // skip if already seeded by checking size
  // TODO: Is there a better way?
  logger.info("Seeding Currency Codes...")
  const alreadySeedSize = await appDataSource.manager.count(CurrencyEntity)
  if (Object.keys(CurrencyCodes).length <= alreadySeedSize) {
    logger.info("Currency Codes already seeded. Skipping...")
    return
  }

  for (const currencyCode in CurrencyCodes) {
    const currency = new CurrencyEntity()
    currency.iso_code =
      CurrencyCodes[currencyCode as keyof typeof CurrencyCodes]
    currency.description =
      CurrencyDescriptions[currencyCode as keyof typeof CurrencyDescriptions]
    await appDataSource.manager.save(currency)
  }
  logger.info("Seeding Currency Codes... Done")
}

export async function seedDefaultRoles(
  appDataSource: DataSource
): Promise<void> {
  logger.info("Seeding Default Roles...")
  const permissions = await appDataSource.manager.find(PortalPermissionEntity)

  for (const role of DefaultRoles) {
    const filteredPermissions = permissions.filter((permission) =>
      role.permissions?.includes(permission.name as unknown as PermissionsEnum)
    )

    const roleEntity = await appDataSource.manager.findOne(PortalRoleEntity, {
      where: { name: role.name },
    })

    if (roleEntity == null) {
      const newRole = new PortalRoleEntity();
      newRole.name = role.name;
      newRole.description = role.name;
      newRole.permissions = filteredPermissions
      await appDataSource.manager.save(newRole)
    }
  }
  logger.info("Seeding Default Roles... Done")
}