import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type CreateTagBody = {
  name: string
  icon: string
}

export const itemRepository = prisma.item
export const itemImageRepository = prisma.itemImage
export const taggingRepository = prisma.tagging
export const tagRepository = prisma.tag

export default prisma
