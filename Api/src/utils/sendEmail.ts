import dotenv from 'dotenv'
import path from 'path'
import logger from '../services/logger'
import { readEnv } from '../setup/readEnv'

const nodemailer = require('nodemailer')

const email = readEnv('MAIL_USERNAME', '') as string
const password = readEnv('MAIL_PASSWORD', '') as string
const host = readEnv('MAIL_HOST', '') as string
const port = readEnv('MAIL_PORT','',true) as number

const backendAppUrl = readEnv('APP_URL', 'http://localhost:3000') as string
const FRONTEND_SET_PASSWORD_URL = readEnv('FRONTEND_SET_PASSWORD_URL', '') as string

const mailTransporter = nodemailer.createTransport({
  host: host,
  port: port,
  // secure: true,
  service: 'gmail',
  auth: {
    user: email,
    pass: password
  },
  debug: true
})

async function sendEmail (to: string, subject: string, body: any): Promise<void> {
  const mailOptions = {
    from: email,
    to,
    subject,
    html: body
  }
  const info = await mailTransporter.sendMail(mailOptions)
  logger.info(`Email sent to ${to} ${body}`, info)
}

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test'), override: true })
}



export async function sendOTPEmail (email: string, otp: string): Promise<void> {
  await sendEmail(
    email,
    'RSwitch Portal User Verification Code',
    `
      Dear Mr/Mrs,<br/>
      <br/> 
      Here is the verification code for your RSwitch Portal User account: 
      <strong>${otp}</strong>,<br/>
      This code can only be used within the next 4 minutes.<br/>
      <br/>
      Best regards,<br/>
      The RSwitch Team
    `
  )
}

export async function sendVerificationEmail (email: string, token: string, role: string): Promise<void> {
  sendEmail(
    email,
    'RSwitch Portal User Email Verification',
    `
      Dear Mr/Mrs,<br/>
      <br/>
      Your email address has been registered and assigned as <strong>${role}</strong>
      in RSwitch Portal.<br/>
      Please verify your email address below and set your password:<br/>
      <br/>
      <a 
        style="
          background-color: #4CAF50; 
          color: white; 
          padding: 14px 20px; margin: 8px 0; border: none; 
          cursor: pointer; width: 100%; text-align: center;
          text-decoration: none;"
          href="${backendAppUrl}/api/v1/users/verify?token=${token}" class="verify-button">Verify email</a><br/>
      <br/>
      Best regards,<br/>
      The RSwitch Team
    `
  )
}

export async function sendForgotPasswordEmail (email: string, token: string): Promise<void> {
  sendEmail(
    email,
    'RSwitch Portal User Reset Password Link',
    `
      Dear Mr/Mrs,<br/>
      Please ignore this email if you did not request to reset your password. <br />
      Your reset Password Link for RSwitch Portal: <br />
      <a href="${FRONTEND_SET_PASSWORD_URL}?token=${token}"> 
      ${FRONTEND_SET_PASSWORD_URL}?token=${token}
      </a> 
      <br/>
      <br/>
      Best regards,<br/>
      The RSwitch Team
    `
  )
}

interface errorObject {
  status: number
  message: any
  merchant_code: string
  lineNumber: number
}

export async function bulkMerchantRegistrationStatusEmail (
  email: string,
  dfspName: string,
  fileName: string,
  batchSize: number,
  succeeded_registrations: number,
  failed_registrations: number,
  status: string,
  errors: Array<errorObject>
): Promise<void> {
  let errorList = ''
  if (errors.length) {
    errorList += 'Errors and Details:<br/><ul>'
    for (let i = 0; i < errors.length; i++) {
      errorList += `
        <li>
          Line Number: ${errors[i].lineNumber}<br/>
          Merchant Code: ${errors[i].merchant_code}<br/>
        </li>
      `
    }
    errorList += '</ul><br/>'
  }

  sendEmail(
    email,
    `RSwitch Bulk Processing Result - ${fileName}`,
    `
      Dear ${dfspName} team,<br/><br/>
      This email is to inform you about the recent bulk merchant registration file you uploaded to our system, named <strong>${fileName}</strong>.<br/><br/>
      Here is a summary of the processing status:<br/>
      - Batch Size: ${batchSize} records<br/>
      - Successfully registered: ${succeeded_registrations} merchants<br/>
      - Failed registrations: ${failed_registrations} merchants<br/>
      - Overall Status: ${status}<br/>
      <br/>
      ${errorList}
      If you have any questions or need further assistance, please let us know.<br/><br/>
      Best regards,<br/>
      The RSwitch team
    `
  )
}
