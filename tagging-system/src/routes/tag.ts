import { Request, Response, Router } from 'express'
import { ResponseMessages } from '../enums'
import { catcher, validate } from '../middlewares'
import { TagBody, tagRepository } from '../repositories'
import { uploadIcon } from '../uploads'
import { TagCreateSchema, TagUpdateSchema } from '../validations'

// Tag routes
export const tagRouter = Router()
tagRouter
  .route('/')
  .get(catcher(getAllTags))
  .post(
    uploadIcon,
    validate(TagCreateSchema, { image: 'icon' }),
    catcher(createTag)
  )
tagRouter
  .route('/:tagId')
  .get(catcher(getTag))
  .put(uploadIcon, validate(TagUpdateSchema), catcher(updateTag))
  .delete(catcher(deleteTag))

export async function getAllTags(req: Request, res: Response): Promise<void> {
  const tags = await tagRepository.findMany({
    select: { id: true, name: true, iconUrl: true, taggingCount: true },
  })
  res.status(200).json({
    statusCode: 200,
    response: { tags },
  })
}

export async function getTag(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.tagId)
  const tag = await tagRepository.findFirst({
    where: { AND: [{ id }, { isDeleted: false }] },
    select: { isDeleted: false },
  })
  if (!tag) {
    res.status(400).json({
      statusCode: 400,
      message: ResponseMessages.TAG_NOT_FOUND,
    })
    return
  }
  res.status(200).json({
    statusCode: 200,
    response: { tag },
  })
}

export async function createTag(req: Request, res: Response): Promise<void> {
  const { name } = req.body as TagBody

  const existingTag = await tagRepository.findFirst({
    where: { AND: [{ name }, { isDeleted: false }] },
  })
  if (existingTag) {
    res.status(400).json({
      statusCode: 400,
      message: ResponseMessages.TAG_ALREADY_EXIST,
    })
    return
  }

  await tagRepository.create({
    data: {
      name: name.toLowerCase(),
      iconUrl: req.file.filename,
      isDeleted: false,
      taggingCount: 0,
    },
  })
  res.status(200).json({
    statusCode: 200,
    message: ResponseMessages.TAG_CREATED,
  })
}

export async function updateTag(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.tagId)
  const { name } = req.body as TagBody

  const tag = await tagRepository.findFirst({
    where: { AND: [{ id }, { isDeleted: false }] },
  })
  if (!tag) {
    res.status(400).json({
      statusCode: 400,
      message: ResponseMessages.TAG_NOT_FOUND,
    })
    return
  }

  const existingTag = await tagRepository.findFirst({
    where: { AND: [{ name }, { isDeleted: false }] },
  })
  if (existingTag) {
    res.status(400).json({
      statusCode: 400,
      message: ResponseMessages.TAG_ALREADY_EXIST,
    })
    return
  }

  await tagRepository.update({
    where: { id },
    data: {
      name: name?.toLowerCase() ?? tag.name,
      iconUrl: req.file.filename ?? tag.iconUrl,
      updatedAt: new Date().toISOString(),
    },
  })

  res.status(200).json({
    statusCode: 200,
    message: ResponseMessages.TAG_UPDATED,
  })
}

export async function deleteTag(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.tagId)
  const existingTag = await tagRepository.findFirst({
    where: { AND: [{ id }, { isDeleted: false }] },
  })
  if (!existingTag) {
    res.status(400).json({
      statusCode: 400,
      message: ResponseMessages.TAG_NOT_FOUND,
    })
    return
  }

  await tagRepository.update({
    where: { id },
    data: {
      isDeleted: true,
      tagging: {
        updateMany: { where: { tagId: id }, data: { isDeleted: true } },
      },
    },
  })
  res.status(200).json({
    statusCode: 200,
    message: ResponseMessages.TAG_DELETED,
  })
}
