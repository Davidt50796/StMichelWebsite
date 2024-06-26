import { AppDataSource } from './dataSource'
import path from 'path'
import logger from '../services/logger'
import {
  PortalUserStatus, PortalUserType
} from '../../../shared-lib'
import { hashPassword } from '../utils/utils'
import { PortalUserEntity } from '../entity/PortalUserEntity'
import { PortalRoleEntity } from '../entity/PortalRoleEntity'
import { DefaultHubSuperAdmin } from './defaultUsers'
import { type DataSource } from 'typeorm'
import { ApplicationStateEntity } from '../entity/ApplicationStateEntity'

export const initializeDatabase = async (): Promise<void> => {
  logger.info('Connecting MySQL database...')

  await AppDataSource.initialize()
    .then(async () => {
      logger.info('MySQL Database Connection success.')

      let applicationState = await AppDataSource.manager.findOne(ApplicationStateEntity, { where: {} })
      if (applicationState == null) {
        applicationState = new ApplicationStateEntity()
        applicationState.is_hub_onboarding_complete = false
        await AppDataSource.manager.save(applicationState)
      }

      if (!applicationState.is_hub_onboarding_complete) {
        await seedDefaultHubSuperAdmin(AppDataSource)
      }

      /* istanbul ignore next */
      if (process.env.NODE_ENV !== 'test') {
        // only seed countries, subdivisions, districts in non-test environment
        // because it takes a long time to seed
        const filePath = path.join(__dirname, 'countries.json')
      }
    })
    .catch((error) => {
      /* istanbul ignore next */
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
  newUser.user_type = PortalUserType.HUB
  newUser.status = PortalUserStatus.ACTIVE
  newUser.role = newUserRole
  await appDataSource.manager.save(newUser)
}

export interface SubdivisionData {
  name: string
  districts: string[]
}

export interface CountryData {
  name: string
  code: string
  country_subdivisions: SubdivisionData[]
}
