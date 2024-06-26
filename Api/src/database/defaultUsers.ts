import { readEnv } from "../setup/readEnv";

export const DefaultHubSuperAdmin = {
  email: readEnv('PP_SUPERADMIN_EMAIL', '') as string,
  name: readEnv('PP_SUPERADMIN_NAME', '') as string,
  password: readEnv('PP_SUPERADMIN_PASSWORD', '') as string,
  phone_number: readEnv('PP_SUPERADMIN_PHONE_NUMBER', '') as string,
  role: 'Hub Super Admin'
}
