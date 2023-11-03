import { ItemRepository } from '../domain/item.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { itemMock } from '../../../fixture/itemFixture'
import { ItemReader } from './item.reader'
import { MYSQL_CONNECTION } from '../../database/constants'
import { Connection } from 'mysql2/promise'
import { when } from 'jest-when'
import { ItemNotFoundException } from '../error/item-not-found.exception'

describe('ItemReader class', () => {
  let itemReader: ItemReader
  let connect: Connection

  const ItemRepositoryMock = {
    findById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemReader,
        {
          provide: MYSQL_CONNECTION,
          useValue: connect,
        },
        {
          provide: ItemRepository,
          useValue: ItemRepositoryMock,
        },
      ],
    }).compile()

    itemReader = module.get<ItemReader>(ItemReader)
  })

  describe('findById method', () => {
    beforeEach(() => {
      when(ItemRepositoryMock.findById).calledWith(itemMock().id).mockReturnValue(itemMock())
    })
    context('상품 id가 주어지고 요청을 성공하면', () => {
      it('item 객체를 리턴해야 한다', async () => {
        const item = await itemReader.getItem(itemMock().id)

        expect(item).toStrictEqual(itemMock())
      })
    })

    context('상품 id가 주어지고 요청을 실패하면', () => {
      it('NotFoundException을 던져야 한다', async () => {
        const not_found_id = (itemMock().id = 99999)

        expect(itemReader.getItem(not_found_id)).rejects.toThrow(
          new ItemNotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`),
        )
      })
    })
  })
})
