import { PrismaClient, User } from '@prisma/client'
import { AuthProviders } from './enums'

const prisma = new PrismaClient()

export interface UserCreate extends User {
  provider: AuthProviders
  externalId?: string
}
export const userRepository = prisma.user
export const authProviderRepository = prisma.authProvider

export default prisma
