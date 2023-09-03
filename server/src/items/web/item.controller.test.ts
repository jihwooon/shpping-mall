import { Test, TestingModule } from '@nestjs/testing'
import { ItemController } from './item.controller'
import { ItemService } from '../application/item.service'
import { ItemStatusEnum } from '../domain/item-status.enum'
import { ItemRepository } from '../domain/item.repository'
import { DatabaseModule } from '../../config/database/database.module'
import { DbHelper } from '../../config/helper/db.helper'

describe('ItemController', () => {
  let itemController: ItemController
  let itemService: ItemService
  let dbHelper: DbHelper
  const REQUEST = {
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
      providers: [ItemService, ItemRepository, DbHelper],
    }).compile()

    itemController = app.get<ItemController>(ItemController)
    itemService = app.get<ItemService>(ItemService)
    dbHelper = app.get<DbHelper>(DbHelper)
  })

  beforeEach(async () => {
    await dbHelper.clear()
  })

  describe('createItemHandler 메서드', () => {
    context('Item 객체가 주어지면', () => {
      it('해당 메서드 호출을 검증한다', async () => {
        const spyFn = jest.spyOn(itemController, 'createItemHandler').mockImplementation()
        await itemController.createItemHandler(REQUEST)

        expect(spyFn).toHaveBeenCalled()
        expect(spyFn).toBeCalledWith(REQUEST)
      })
    })
  })
})
