import { Test, TestingModule } from '@nestjs/testing'
import { itemMock } from '../../fixture/itemFixture'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'
import { when } from 'jest-when'
import { fileMock, filesMock } from '../../fixture/itemImageFixture'
import { ItemImageService } from '../../item-images/application/item-image.service'
import { ItemImageRepository } from '../../item-images/domain/item-image.repository'
import { ItemRepository } from '../../items/domain/item.repository'

describe('ItemImageService class', () => {
  let itemImageService: ItemImageService
  let connection: Connection

  const ItemRepositoryMock = {
    save: jest.fn(),
    findById: jest.fn(),
  }

  const ItemImageRepositoryMock = {
    save: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemImageService,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
        {
          provide: ItemRepository,
          useValue: ItemRepositoryMock,
        },
        {
          provide: ItemImageRepository,
          useValue: ItemImageRepositoryMock,
        },
      ],
    }).compile()

    itemImageService = module.get<ItemImageService>(ItemImageService)
  })

  describe('saveItemImages method', () => {
    beforeEach(() => {
      when(ItemRepositoryMock.save).calledWith(expect.anything()).mockResolvedValue(itemMock().id)
      when(ItemRepositoryMock.findById).calledWith(itemMock().id).mockResolvedValue(itemMock())
    })

    context('상품 정보와 이미지 파일이 주어지면', () => {
      it('저장에 성공한다', async () => {
        const id = await itemImageService.saveItemImages(itemMock().id, filesMock())

        expect(id).toEqual(undefined)
      })
    })
  })

  describe('saveItemImage method', () => {
    beforeEach(() => {
      when(ItemRepositoryMock.save).calledWith(expect.anything()).mockResolvedValue(itemMock().id)
      when(ItemRepositoryMock.findById).calledWith(itemMock().id).mockResolvedValue(itemMock())
    })

    context('상품 정보와 이미지 파일이 주어지고 대표이미지가 true면', () => {
      let isRepresentImage = true
      it('저장에 성공한다', async () => {
        const id = await itemImageService.saveItemImage(itemMock().id, fileMock(), isRepresentImage)

        expect(id).toEqual(undefined)
      })
    })
  })
})
