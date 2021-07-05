import { Request, Response, Router } from 'express'
import { ResponseMessages } from '../enums'
import { catcher, validate } from '../middlewares'
import prisma, {
  ItemBody,
  itemRepository,
  tagRepository,
} from '../repositories'
import { MulterFile } from '../types'
import { uploadImages } from '../uploads'
import { ItemCreateSchema, ItemUpdateSchema } from '../validations'

// Item routes
export const itemRouter = Router()
itemRouter
  .route('/')
  .get(catcher(getItems))
  .post(
    uploadImages,
    validate(ItemCreateSchema, { images: 'images' }),
    catcher(createItem)
  )
itemRouter
  .route('/:itemId')
  .get(catcher(getItem))
  .put(uploadImages, validate(ItemUpdateSchema), catcher(updateItem))
  .delete(catcher(deleteItem))
itemRouter.get('/tag/:tagId', catcher(byTag))

async function getItems(req: Request, res: Response): Promise<void> {
  const items = await itemRepository.findMany({
    select: {
      id: true,
      createdAt: true,
      name: true,
      description: true,
      itemImage: { select: { id: true, imageUrl: true } },
      tagging: {
        select: {
          id: true,
          tag: { select: { name: true, iconUrl: true, taggingCount: true } },
        },
      },
    },
  })
  res.status(200).json({
    statusCode: 200,
    response: { items },
  })
}

async function getItem(req: Request, res: Response): Promise<void> {
  const id = +req.params.itemId
  const item = await itemRepository.findFirst({
    where: {
      AND: [{ id }, { isDeleted: false }],
    },
    select: {
      id: true,
      createdAt: true,
      name: true,
      description: true,
      itemImage: { select: { id: true, imageUrl: true } },
      tagging: {
        where: { isDeleted: false },
        select: {
          id: true,
          tag: { select: { name: true, iconUrl: true, taggingCount: true } },
        },
      },
    },
  })
  if (!item) {
    res.status(200).json({
      statusCode: 200,
      message: ResponseMessages.ITEM_NOT_FOUND,
    })
    return
  }
  res.status(200).json({
    statusCode: 200,
    response: { item },
  })
}

async function createItem(req: Request, res: Response): Promise<void> {
  const { name, description, tags } = req.body as ItemBody
  const images = req.files as MulterFile[]
  const tagsIds = tags.map((id) => Number(id))
  const existingTags = await tagRepository.findMany({
    where: {
      AND: [{ id: { in: tagsIds } }, { isDeleted: false }],
    },
  })
  if (tags.length !== existingTags?.length) {
    res.status(400).json({
      statusCode: 400,
      message: ResponseMessages.TAG_NOT_FOUND,
    })
  }

  await prisma.$transaction([
    itemRepository.create({
      data: {
        name,
        description,
        isDeleted: false,
        tagging: {
          createMany: {
            data: tags.map((tagId) => ({
              tagId: Number(tagId),
              isDeleted: false,
            })),
          },
        },
        itemImage: {
          createMany: {
            data: images.map((image) => ({ imageUrl: image.filename })),
          },
        },
      },
    }),
    prisma.$executeRaw(
      `UPDATE Tag SET taggingCount = taggingCount + 1 WHERE id IN (${tagsIds})`
    ),
  ])

  res.status(200).json({
    statusCode: 200,
    message: ResponseMessages.ITEM_CREATED,
  })
}

async function updateItem(req: Request, res: Response): Promise<void> {
  const id = +req.params.itemId
  const { tags, ...itemUpdateBody } = req.body as ItemBody
  const existingItem = await itemRepository.findFirst({
    where: {
      AND: [{ id }, { isDeleted: false }],
    },
  })
  if (!existingItem) {
    res.status(200).json({
      statusCode: 200,
      message: ResponseMessages.ITEM_NOT_FOUND,
    })
    return
  }

  const existingTags = await tagRepository.findMany({
    where: {
      AND: [{ id: { in: tags.map((id) => Number(id)) } }, { isDeleted: false }],
    },
  })
  if (tags.length !== existingTags?.length) {
    res.status(400).json({
      statusCode: 400,
      message: ResponseMessages.TAG_NOT_FOUND,
    })
  }
  // TODO - update tags and tagging
  await itemRepository.update({
    data: {
      ...existingItem,
      ...itemUpdateBody,
      updatedAt: new Date().toISOString(),
    },
    where: { id },
  })
  res.status(200).json({
    statusCode: 200,
    message: ResponseMessages.ITEM_UPDATED,
  })
}

async function deleteItem(req: Request, res: Response): Promise<void> {
  const id = +req.params.itemId
  const existingItem = await itemRepository.findFirst({
    where: {
      AND: [{ id }, { isDeleted: false }],
    },
  })
  if (!existingItem) {
    res.status(200).json({
      statusCode: 200,
      message: ResponseMessages.ITEM_NOT_FOUND,
    })
    return
  }

  await itemRepository.update({
    where: { id },
    data: {
      isDeleted: true,
      tagging: {
        updateMany: { where: { itemId: id }, data: { isDeleted: true } },
      },
      updatedAt: new Date().toISOString(),
    },
  })
}

async function byTag(req: Request, res: Response): Promise<void> {
  const tagId = +req.params.tagId
  const tag = await tagRepository.findFirst({
    where: { AND: [{ id: tagId }, { isDeleted: false }] },
  })
  if (!tag) {
    res.status(400).json({
      statusCode: 400,
      message: ResponseMessages.TAG_NOT_FOUND,
    })
    return
  }

  const items = await itemRepository.findMany({
    where: { AND: [{ tagging: { some: { tagId } } }, { isDeleted: false }] },
    select: {
      id: true,
      createdAt: true,
      name: true,
      description: true,
      itemImage: { select: { id: true, imageUrl: true } },
      tagging: {
        select: {
          id: true,
          tag: { select: { name: true, iconUrl: true, taggingCount: true } },
        },
        where: { AND: [{ tagId }, { isDeleted: false }] },
      },
    },
  })

  res.status(200).json({
    statusCode: 200,
    response: { tag, items },
  })
}
