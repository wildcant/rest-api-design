import { PrismaClient, User } from '@prisma/client'
import { AUTH_PROVIDERS } from './enums'

const prisma = new PrismaClient()

export interface UserCreate extends User {
  provider: AUTH_PROVIDERS
  idpToken?: string
}
export const userRepository = prisma.user

export default prisma
