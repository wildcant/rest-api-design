import { NextFunction, Request, Response } from 'express'
import { ResponseMessages } from '../enums'
import { itemRepository } from '../repositories'

export async function createItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const createItemBody = req.body
    console.log({ createItemBody })
    res.status(200).json({
      statusCode: 200,
      message: ResponseMessages.ACCEPTED,
    })
  } catch (error) {
    next(error)
  }
}

export function getItems(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  itemRepository
    .findMany()
    .then((items) => {
      res.status(200).json({ statusCode: 200, response: { items } })
    })
    .catch(next)
}
