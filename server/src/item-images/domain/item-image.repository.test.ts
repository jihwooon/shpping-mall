import { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { Test, TestingModule } from '@nestjs/testing'
import { MYSQL_CONNECTION } from '../../database/constants'
import { ItemImageRepository } from './item-image.repository'
import { dbItemImagesMock, itemImageMock } from '../../../fixture/itemImageFixture'
import { itemMock } from '../../../fixture/itemFixture'

describe('ItemImageRepository class', () => {
  let itemImageRepository: ItemImageRepository

  const ItemImageRepositoryMock = {
    execute: jest.fn(),
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemImageRepository,
        {
          provide: MYSQL_CONNECTION,
          useValue: ItemImageRepositoryMock,
        },
      ],
    }).compile()

    itemImageRepository = module.get<ItemImageRepository>(ItemImageRepository)
  })

  describe('save method', () => {
    context('ItemImage 정보가 저장에 성공하면', () => {
      beforeEach(() => {
        ItemImageRepositoryMock.execute.mockResolvedValue([{ insertId: 1 }] as ResultSetHeader[])
      })
      it('생성 된 insertId를 리턴해야 한다', async () => {
        const insertId = await itemImageRepository.save(itemImageMock())

        expect(insertId).toEqual(1)
      })
    })

    context('ItemImage 정보가 저장에 실패하면', () => {
      beforeEach(() => {
        ItemImageRepositoryMock.execute.mockResolvedValue([{ insertId: 0 }] as ResultSetHeader[])
      })
      it('undefined를 리턴해야 한다', async () => {
        const insertId = await itemImageRepository.save(itemImageMock())

        expect(insertId).toEqual(undefined)
      })
    })
  })

  describe('update method', () => {
    context('id가 주어지고 itemImage 정보가 변경에 성공하면', () => {
      beforeEach(async () => {
        ItemImageRepositoryMock.execute.mockResolvedValue([{ affectedRows: 1 }] as ResultSetHeader[])
      })
      it('true를 리턴해야 한다', async () => {
        const items = await itemImageRepository.update(itemImageMock().id, itemImageMock())

        expect(items).toEqual(true)
      })
    })

    context('잘못된 id와 수정 할 itemImage 객체가 주어지면', () => {
      beforeEach(async () => {
        ItemImageRepositoryMock.execute.mockResolvedValue([{ affectedRows: 0 }] as ResultSetHeader[])
      })
      it('false를 리턴해야 한다', async () => {
        const items = await itemImageRepository.update(itemImageMock().id, itemImageMock())

        expect(items).toEqual(false)
      })
    })
  })

  describe('findByItemOrderByItemImageIdAsc method', () => {
    context('id가 주어지면', () => {
      beforeEach(async () => {
        ItemImageRepositoryMock.execute.mockResolvedValue([dbItemImagesMock as RowDataPacket[], []])
      })
      it('itemImage 배열 값을 리턴해야 한다', async () => {
        const items = await itemImageRepository.findByItemOrderByItemImageIdAsc(itemMock().id)

        const expectedResults = dbItemImagesMock.map((row) => ({
          id: row['item_image_id'],
          imageName: row['image_name'],
          imageUrl: row['image_url'],
          isRepresentImage: row['is_req_image'],
          originalImageName: row['original_image_name'],
          createTime: row['create_time'],
          updateTime: row['update_time'],
          createBy: row['create_by'],
          modifiedBy: row['modified_by'],
          item: row['item_id'],
        }))

        expect(items).toStrictEqual(expectedResults)
      })
    })

    context('undefined가 주어지면', () => {
      beforeEach(async () => {
        ItemImageRepositoryMock.execute.mockResolvedValue([undefined as RowDataPacket[], []])
      })
      it('빈 배열을 리턴해야 한다', async () => {
        const items = await itemImageRepository.findByItemOrderByItemImageIdAsc(itemMock().id)

        expect(items).toStrictEqual([])
      })
    })

    context('null이 주어지면', () => {
      beforeEach(async () => {
        ItemImageRepositoryMock.execute.mockResolvedValue([null as RowDataPacket[], []])
      })
      it('빈 배열을 리턴해야 한다', async () => {
        const items = await itemImageRepository.findByItemOrderByItemImageIdAsc(itemMock().id)

        expect(items).toStrictEqual([])
      })
    })
  })
})
