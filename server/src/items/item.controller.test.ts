import { Test, TestingModule } from '@nestjs/testing'
import { ItemController } from './item.controller'
import { ItemService } from './item.service'
import { ItemStatusEnum } from './item-status.enum'
import { ItemRepository } from './item.repository'
import { DatabaseModule } from '../config/database/database.module'
import { ITEMS } from '../fixture/itemFixture'

describe('ItemController', () => {
  let itemController: ItemController
  let itemService: ItemService
  const request = {
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

  describe('createItemHandler 메서드', () => {
    context('멤버 객체가 주어지면', () => {
      it('해당 메서드 호출한다', async () => {
        const spyFn = jest.spyOn(itemController, 'createItemHandler')
        await itemController.createItemHandler(request)
        expect(spyFn).toHaveBeenCalled()
        expect(spyFn).toBeCalledWith(request)
      })
    })
  })

  describe('getItemHandler 메서드', () => {
    beforeEach(() => {
      itemService.getItem = jest.fn().mockImplementation(() => ITEMS)
    })

    context('만약 id가 주어지면', () => {
      const ID = 1
      it('저장된 객체 정보를 리턴한다', async () => {
        const item = await itemController.getItemHandler(ID)

        expect(item).toEqual(ITEMS)
      })
    })
  })
})
