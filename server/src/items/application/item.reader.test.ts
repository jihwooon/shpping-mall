import { NotFoundException } from '@nestjs/common'
import { ItemRepository } from '../domain/item.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { itemMock } from '../../fixture/itemFixture'
import { ItemReader } from './item.reader'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'

describe('ItemReader class', () => {
  let itemReader: ItemReader
  let itemRepository: ItemRepository
  let connect: Connection

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemRepository,
        ItemReader,
        {
          provide: MYSQL_CONNECTION,
          useValue: connect,
        },
      ],
    }).compile()

    itemReader = module.get<ItemReader>(ItemReader)
    itemRepository = module.get<ItemRepository>(ItemRepository)
  })

  describe('findById method', () => {
    context('id가 주어지면', () => {
      beforeEach(() => {
        itemRepository.findById = jest.fn().mockImplementation(() => itemMock())
      })

      it('item 객체를 리턴해야 한다', async () => {
        const item = await itemReader.getItem(itemMock().id)

        expect(item).toStrictEqual(itemMock())
      })
    })

    context('잘못된 id가 주어지면', () => {
      beforeEach(() => {
        itemRepository.findById = jest.fn().mockResolvedValue(undefined)
      })

      it('NotFoundException을 던져야 한다', async () => {
        const not_found_id = (itemMock().id = 99999)
        expect(itemReader.getItem(not_found_id)).rejects.toThrow(
          new NotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`, {
            cause: new Error(),
            description: 'NOT_FOUND',
          }),
        )
      })
    })
  })
})
