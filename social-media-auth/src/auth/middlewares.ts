import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import passport from 'passport'
import { generateToken } from '../auth'
import { PartialUser } from '../helpers'

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  passport.authenticate('local', { session: false }, (error, user) => {
    if (error) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ statusCode: StatusCodes.UNAUTHORIZED, error })
      return
    }
    if (!user) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ statusCode: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' })
      return
    }
    const payload = user as PartialUser
    req.login(payload, { session: false }, (error) => {
      if (error) res.status(400).json({ statusCode: 400, error })
      generateToken(payload)
        .then((token) => {
          res.status(201).json({ statusCode: 200, response: { token } })
        })
        .catch(next)
    })
  })(req, res, next)
}

export function authorize(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (err) {
      res.status(400).send(err)
    } else if (info) {
      res.status(401).send(info.message)
    } else if (user) {
      next()
    }
  })(req, res, next)
}
