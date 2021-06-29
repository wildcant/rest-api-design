import { NextFunction, Request, Response } from 'express'
import { generateToken } from '../auth'
import { ResponseMessages, AuthProviders } from '../enums'
import { sanitizeUser } from '../helpers'
import {
  authProviderRepository,
  UserCreate,
  userRepository,
} from '../repositories'

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const createUserBody = req.body as UserCreate
    const existingUser = await userRepository.findUnique({
      where: { email: createUserBody.email },
    })

    if (existingUser) {
      const userProviders = await authProviderRepository.findMany({
        where: { userId: existingUser.id },
      })
      // Any existing user should have at least one auth provider
      if (!userProviders?.length) {
        throw new Error()
      }

      const currentUser = userProviders.find(
        ({ provider }) => provider === createUserBody.provider
      )
      // Trying to register existing user
      if (currentUser.provider === AuthProviders.LOCAL) {
        res.status(400).json({
          statusCode: 400,
          message: ResponseMessages.USER_ALREADY_EXIST,
        })
        return
      }

      if (currentUser.externalId !== createUserBody.externalId) {
        throw new Error(ResponseMessages.UNAUTHORIZED)
      }

      const token = await generateToken(sanitizeUser(existingUser))
      res.status(200).json({ statusCode: 200, response: { token } })
      return
    }

    switch (createUserBody.provider) {
      case AuthProviders.FACEBOOK:
      case AuthProviders.GOOGLE:
        const { externalId, provider, ...userBody } = createUserBody
        const newUser = await userRepository.create({
          data: {
            ...userBody,
            isDeleted: false,
            isEmailVerified: true,
            authProvider: {
              create: { externalId, provider },
            },
          },
        })
        const token = await generateToken(sanitizeUser(newUser))
        res.status(201).json({ statusCode: 200, response: { token } })
        break
      case AuthProviders.LOCAL:
      default:
        delete createUserBody.provider
        await userRepository.create({
          data: {
            ...createUserBody,
            isDeleted: false,
            authProvider: {
              create: { provider: AuthProviders.LOCAL },
            },
          },
        })
        // TODO - Send verification email
        res.status(200).json({
          statusCode: 200,
          message: ResponseMessages.VERIFICATION_EMAIL_SENT,
        })
        break
    }
  } catch (error) {
    next(error)
  }
}

export function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  userRepository
    .findMany()
    .then((users) => {
      res
        .status(200)
        .json({ statusCode: 200, response: { users: users.map(sanitizeUser) } })
    })
    .catch(next)
}
