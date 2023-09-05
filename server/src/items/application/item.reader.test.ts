import { NotFoundException } from '@nestjs/common'
import { ItemRepository } from '../domain/item.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { ITEMS } from '../../fixture/itemFixture'
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
    const ID = 1
    const NOT_FOUND_ID = 99999
    context('id가 주어지면', () => {
      beforeEach(() => {
        itemRepository.findById = jest.fn().mockImplementation(() => ITEMS)
      })

      it('item 객체를 리턴해야 한다', async () => {
        const item = await itemReader.getItem(ID)

        expect(item).toBe(ITEMS)
      })
    })

    context('잘못된 id가 주어지면', () => {
      beforeEach(() => {
        itemRepository.findById = jest.fn().mockResolvedValue(undefined)
      })

      it('NotFoundException을 던져야 한다', async () => {
        expect(itemReader.getItem(NOT_FOUND_ID)).rejects.toThrow(
          new NotFoundException(`${NOT_FOUND_ID}에 해당하는 상품을 찾을 수 없습니다.`, {
            cause: new Error(),
            description: 'NOT_FOUND',
          }),
        )
      })
    })
  })
})
