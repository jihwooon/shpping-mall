import { Test, TestingModule } from '@nestjs/testing'
import { ItemController } from './item.controller'
import { ItemService } from './item.service'
import { ItemStatusEnum } from './item-status.enum'
import { ItemRepository } from './item.repository'
import { DatabaseModule } from '../config/database/database.module'

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

  describe('createItemHandler', () => {
    it('should return "Hello World!"', async () => {
      const spyFn = jest.spyOn(itemController, 'createItemHandler')
      await itemController.createItemHandler(request)

      expect(spyFn).toHaveBeenCalled()
      expect(spyFn).toBeCalledWith(request)
    })
  })
})
