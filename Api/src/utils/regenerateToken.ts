import { AppDataSource } from '../database/dataSource'
import { EmailVerificationTokenEntity } from '../entity/EmailVerificationToken'
import { JwtTokenEntity } from '../entity/JwtTokenEntity'
import jwt from 'jsonwebtoken'
import ms from 'ms'
import { PortalUserEntity } from '../entity/PortalUserEntity'
import dotenv from 'dotenv'
import { readEnv } from '../setup/readEnv'

const JWT_SECRET = readEnv('JWT_SECRET', 'secret') as string

export async function regenerateToken(email: string, portalUser: PortalUserEntity): Promise<string> {
  
  const emailVerificationTokenRepository = AppDataSource.getRepository(EmailVerificationTokenEntity)
  const jwtTokenRepository = AppDataSource.getRepository(JwtTokenEntity)

  // Find the existing email verification token
  const emailVerificationToken = await emailVerificationTokenRepository.findOne({ where: { email } })

  if (!emailVerificationToken) {
    throw new Error('Token not found')
  }

  // Delete the existing tokens
  await emailVerificationTokenRepository.delete({ token: emailVerificationToken.token })
  await jwtTokenRepository.delete({ token: emailVerificationToken.token })

  // Generate a new token
  const token = jwt.sign({ id: portalUser.id, email: portalUser.email }, JWT_SECRET, { expiresIn: '1h' })

  // Save the new JWT token
  const jwtTokenObj = {
    token,
    user: portalUser,
    expires_at: new Date(Date.now() + ms('1h')),
    last_used: new Date()
  }
  await jwtTokenRepository.save(jwtTokenObj)

  // Save the new email verification token
  const emailVerificationObj = {
    user: portalUser,
    token,
    email: portalUser.email
  }
  await emailVerificationTokenRepository.save(emailVerificationObj)

  return token
}
