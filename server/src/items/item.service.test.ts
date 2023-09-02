import { ItemRepository } from './item.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { ItemService } from './item.service'
import { ITEMS } from '../fixture/itemFixture'
import { Item } from './item.entity'
import { DatabaseModule } from '../config/database/database.module'

describe('ItemService', () => {
  let itemService: ItemService
  let items = new Item(ITEMS)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ItemRepository, ItemService],
    }).compile()

    itemService = module.get<ItemService>(ItemService)
  })

  it('registerItem 함수을 호출한다 ', async () => {
    const spyFn = jest.spyOn(itemService, 'registerItem')
    await itemService.registerItem(items)

    expect(spyFn).toHaveBeenCalled()
    expect(spyFn).toBeCalledWith(items)
  })
})
