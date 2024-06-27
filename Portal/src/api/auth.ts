import instance from '../lib/axiosInstance'
import { ChangePassword } from '../types/users'
import { LoginForm } from '../lib/validations/login';

export async function login(loginObject: LoginForm) {
  const response = await instance.post<{ token: string }>(
    "/users/login",
    loginObject
  );
  return response.data;
}

export async function logout() {
  const response = await instance.post<{ token: string }>('/users/logout')
  return response.data
}
export async function sendVerificationCode(email: string ) {
  const response = await instance.post('/users/send-verification-code', { email, })
  return response.data
}

export  async function verifyCode(otp: string, email: string ) {
  const response = await instance.post('/users/verify-code', { otp, email, })
  return response.data
}


export async function setPassword(passwordObj: ChangePassword) {
  const response = await instance.put('/users/reset-password', passwordObj)
  return response.data
}

export async function forgotPassword(email: string) {
  const response = await instance.post('/users/forgot-password', {
    email,
  })
  return response.data
}
