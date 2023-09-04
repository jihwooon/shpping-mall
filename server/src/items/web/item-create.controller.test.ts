import { Test, TestingModule } from '@nestjs/testing'
import { ItemCreateController } from './item-create.controller'
import { ItemCreater } from '../application/item.creater'
import { ItemRepository } from '../domain/item.repository'
import { DatabaseModule } from '../../config/database/database.module'
import { DbHelper } from '../../config/helper/db.helper'
import { CREATE_REQUEST } from '../../fixture/itemFixture'

describe('ItemController class', () => {
  let itemController: ItemCreateController
  let itemCreater: ItemCreater
  let dbHelper: DbHelper

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [ItemCreateController],
      providers: [ItemCreater, ItemRepository, DbHelper],
    }).compile()

    itemController = app.get<ItemCreateController>(ItemCreateController)
    itemCreater = app.get<ItemCreater>(ItemCreater)
    dbHelper = app.get<DbHelper>(DbHelper)
  })

  beforeEach(async () => {
    await dbHelper.clear('item')
  })

  describe('createItemHandler method', () => {
    context('Item 객체가 주어지면', () => {
      it('해당 메서드 호출을 검증해야 한다', async () => {
        const spyFn = jest.spyOn(itemController, 'createItemHandler').mockImplementation()
        await itemController.createItemHandler(CREATE_REQUEST)

        expect(spyFn).toHaveBeenCalled()
        expect(spyFn).toBeCalledWith(CREATE_REQUEST)
      })
    })
  })
})
