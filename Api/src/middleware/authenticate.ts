import path from 'path'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { type Request, type Response, type NextFunction } from 'express'
import { audit } from '../utils/audit'
import { AppDataSource } from '../database/dataSource'
import { AuditActionType, AuditTrasactionStatus } from '../../../shared-lib'
import { isUndefinedOrNull } from '../utils/utils'
import { JwtTokenEntity } from '../entity/JwtTokenEntity'
import { readEnv } from '../setup/readEnv'
import ms from 'ms'

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test'), override: true })
}

export const JWT_SECRET = process.env.JWT_SECRET ?? ''

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
export async function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header('Authorization')
  const INACTIVITY_LIMIT = readEnv('INACTIVITY_LIMIT', '15m') as string
  const INACTIVITY_LIMIT_MS = ms(INACTIVITY_LIMIT)

  if (isUndefinedOrNull(authorization)) {
    await audit(
      AuditActionType.UNAUTHORIZED_ACCESS,
      AuditTrasactionStatus.FAILURE,
      'authenticateJWT',
      'Authorization header is undefined',
      'PortalUserEntity',
      {},
      {},
      null
    )
    return res.status(401).send({ message: 'Authorization Failed' })
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const token = authorization!.replace('Bearer', '').trim()

  const jwtTokenRecord = await AppDataSource.manager.findOne(JwtTokenEntity, {
    where: { token },
    relations: ['user', 'user.role', 'user.role.permissions', 'user.dfsp']
  })

  try {
    if (jwtTokenRecord == null) {
      throw new Error('JWT Token Not Found!')
    }

    const userLimitTime = new Date(jwtTokenRecord.last_used)

    if (userLimitTime.getTime() + INACTIVITY_LIMIT_MS <= Date.now()) {
      await audit(
        AuditActionType.UNAUTHORIZED_ACCESS,
        AuditTrasactionStatus.FAILURE,
        'authenticateJWT',
        'Inactivity time limit breached',
        'PortalUserEntity',
        {},
        {},
        jwtTokenRecord.user
      )
      await AppDataSource.manager.delete(JwtTokenEntity, { token })
      res.status(401).send({ message: 'Authorization Failed.' })
    } else {
      jwt.verify(token, JWT_SECRET)

      req.user = jwtTokenRecord.user
      req.token = token

      await AppDataSource.manager.update(
        JwtTokenEntity,
        { token },
        { last_used: new Date() }
      )
      next()
    }
  } catch (err) {
    await audit(
      AuditActionType.UNAUTHORIZED_ACCESS,
      AuditTrasactionStatus.FAILURE,
      'authenticateJWT',
      'Invalid token',
      'PortalUserEntity',
      {},
      {},
      null
    )
    if (req.path === '/users/logout' && jwtTokenRecord !== null) {
      req.user = jwtTokenRecord.user
      next()
    } else {
      res.status(401).send({ message: 'Authorization Failed', error: err })
    }
  }
}

