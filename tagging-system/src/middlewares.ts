import Joi, { Schema } from '@hapi/joi'
import { NextFunction, Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { FileSchema } from './validations'

type ValidateOptions = {
  image?: string
}
export const validate =
  (schema: Schema, options?: ValidateOptions) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const error = schema.validate(req.body).error
    if (error) return next(error)

    if (options?.image) {
      const error = !req.file
        ? ({
            name: 'ValidationError',
            message: `"${options.image}" file is required`,
          } as Joi.ValidationError)
        : FileSchema.validate(req.file).error
      if (error) return next(error)
    }
    next()
  }

type Action = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void
export const catcher =
  (action: Action) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await action(req, res, next)
    } catch (error) {
      next(error)
    }
  }

type Error = {
  message?: string
  stack?: string
}
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  console.log({ error })
  res.status(StatusCodes.BAD_REQUEST).json({
    statusCode: StatusCodes.BAD_REQUEST,
    message:
      (!error.message.includes('prisma') && error.message) ||
      ReasonPhrases.INTERNAL_SERVER_ERROR,
  })
}
