import { NextFunction, Request, Response } from 'express'
import { AUTH_PROVIDERS } from '../enums'
import { sanitizeUser } from '../helpers'
import { UserCreate, userRepository } from '../repositories'
import axios from 'axios'
import { User } from '@prisma/client'

async function facebookAuth(accessToken: string): Promise<User> {
  try {
    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name'].join(','),
        access_token: accessToken,
      },
    })
    // TODO - Review fields
    const user = {
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
    } as User
    const federetedUser = {
      externalId: data.id,
      provider: AUTH_PROVIDERS.FACEBOOK,
    }
    return user
  } catch (error) {
    console.log({ error })
    throw new Error(error.message)
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const createUserBody = req.body as UserCreate
    const existingUser = await userRepository.findFirst({
      where: {
        OR: [
          { username: createUserBody.username },
          { email: createUserBody.email },
        ],
      },
    })

    if (existingUser) {
      res.status(200).json({ statusCode: 400, message: 'User already exist.' })
      return
    }

    switch (createUserBody.provider) {
      case AUTH_PROVIDERS.FACEBOOK:
        const newUser = await facebookAuth(createUserBody.idpToken)
        console.log({ newUser })
        // await userRepository.create({
        //   data: { ...newUser, isDeleted: false },
        // })
        break
      case AUTH_PROVIDERS.LOCAL:
      default:
        await userRepository.create({
          data: { ...createUserBody, isDeleted: false },
        })
        break
    }
    res.status(200).json({ statusCode: 200, message: 'User created.' })
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
