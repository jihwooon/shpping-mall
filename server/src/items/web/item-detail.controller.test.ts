import { Test, TestingModule } from '@nestjs/testing'
import { ItemController } from './item.controller'
import { ItemService } from '../application/item.service'
import { ItemStatusEnum } from '../domain/item-status.enum'
import { ItemRepository } from '../domain/item.repository'
import { DatabaseModule } from '../../config/database/database.module'
import { ITEMS } from '../../fixture/itemFixture'
import { NotFoundException } from '@nestjs/common'

describe('ItemController', () => {
  let itemController: ItemController
  let itemService: ItemService
  const REQUEST = {
    id: 1,
    itemName: 'New Balance 530 Steel Grey',
    itemDetail: 'M990WT6',
    price: 130000,
    stockNumber: 10,
    sellStatus: ItemStatusEnum.SELL,
  }

  const RESPONSE = {
    id: 1,
    itemName: 'New Balance 530 Steel Grey',
    itemDetail: 'M990WT6',
    price: 130000,
    stockNumber: 10,
    sellStatus: ItemStatusEnum.SELL,
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [ItemController],
      providers: [ItemService, ItemRepository],
    }).compile()

    itemController = app.get<ItemController>(ItemController)
    itemService = app.get<ItemService>(ItemService)
  })

  describe('getItemHandler 메서드', () => {
    const ID = 1
    const NOT_FOUND_ID = 9999
    context('id가 주어지면', () => {
      beforeEach(() => {
        itemService.getItem = jest.fn().mockImplementation(() => ITEMS)
      })
      it('저장된 객체 정보를 리턴한다', async () => {
        const item = await itemController.getItemHandler(ID)

        expect(item).toEqual(RESPONSE)
      })
    })

    context('잘못된 id가 주어지면', () => {
      beforeEach(() => {
        itemService.getItem = jest
          .fn()
          .mockRejectedValue(new NotFoundException(`${NOT_FOUND_ID}에 해당하는 상품을 찾을 수 없습니다.`))
      })

      it('NotFoundException을 던진다', async () => {
        expect(itemController.getItemHandler(NOT_FOUND_ID)).rejects.toThrow(
          new NotFoundException(`${NOT_FOUND_ID}에 해당하는 상품을 찾을 수 없습니다.`),
        )
      })
    })
  })
})
