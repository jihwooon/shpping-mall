import { Injectable, UploadedFiles } from '@nestjs/common'
import { ItemImageRepository } from '../domain/item-image.repository'
import { ItemImage } from '../domain/item-image.entity'
import { ItemRepository } from '../../items/domain/item.repository'
import { ItemNotFoundException } from '../../items/error/item-not-found.exception'
import { FileIsNotEmpty } from '../error/file-is-not-empty'

@Injectable()
export class ItemImageCreater {
  constructor(
    private readonly itemImageRepository: ItemImageRepository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async saveItemImages(itemId: number, @UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new FileIsNotEmpty('파일은 필수 입력 값입니다')
    }

    await Promise.all(
      files.map((file, i) => {
        const isRepresentImage: boolean = i === 0
        this.saveItemImage(itemId, { ...file }, isRepresentImage)
      }),
    )
  }

  async saveItemImage(itemId: number, @UploadedFiles() file: Express.Multer.File, isRepresentImage) {
    const { originalname, filename, path } = file

    const item = await this.itemRepository.findById(itemId)
    if (!item) {
      throw new ItemNotFoundException(`${itemId}에 해당하는 상품을 찾을 수 없습니다.`)
    }

    await this.itemImageRepository.save(
      new ItemImage({
        imageName: filename,
        originalImageName: originalname,
        item: item,
        imageUrl: path,
        isRepresentImage: isRepresentImage,
      }),
    )
  }
}
