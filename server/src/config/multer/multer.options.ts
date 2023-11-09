import { BadRequestException } from '@nestjs/common'
import { diskStorage } from 'multer'
import { existsSync, mkdirSync } from 'fs'
import * as mime from 'mime-types'
import { v4 as uuid } from 'uuid'

export const multerDiskOptions = {
  storage: diskStorage({
    destination(req, file, callback) {
      const uploadPath = 'uploads'
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath)
      }
      callback(null, uploadPath)
    },
    filename(req, file, callback) {
      callback(null, `${uuid()}.${mime.extension(file.mimetype)}`)
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 5,
  },
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(null, true)
    } else {
      callback(new BadRequestException('지원하지 않는 이미지 형식입니다.'), false)
    }
  },
}
