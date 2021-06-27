import { Schema } from '@hapi/joi'
import { User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export function validate(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body)
    if (error) return next(error)
    next()
  }
}

type Error = {
  message?: string
  stack?: string
}
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  console.log({ err })
  res.status(StatusCodes.BAD_REQUEST).json({
    statusCode: StatusCodes.BAD_REQUEST,
    message: err.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
  })
}

export type PartialUser = {
  id?: number
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  phone?: string
}

export const sanitizeUser = (user: User): PartialUser => {
  const allowedFields = ['firstName', 'lastName', 'username', 'email', 'phone']
  const sanitizedUser = Object.keys(user)
    .filter((field: string) => allowedFields.includes(field))
    .reduce((obj, key: string | number) => {
      obj[key] = user[key]
      return obj
    }, {})

  return sanitizedUser
}
