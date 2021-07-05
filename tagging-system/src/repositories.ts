import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type TagBody = {
  name: string
}

export type ItemBody = {
  name: string
  description: string
  tags: string[]
}

export const itemRepository = prisma.item
export const itemImageRepository = prisma.itemImage
export const taggingRepository = prisma.tagging
export const tagRepository = prisma.tag

export default prisma
