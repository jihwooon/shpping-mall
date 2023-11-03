import { RowDataPacket } from 'mysql2/promise'
import { MYSQL_CONNECTION } from '../../database/constants'
import { DeliveryRepository } from './delivery.repository'
import { userMock } from '../../../fixture/memberFixture'
import { dbDeliveriesMock } from '../../../fixture/deliveryFixture'
import { Test, TestingModule } from '@nestjs/testing'

describe('DeliveryRepository class', () => {
  let deliveryRepository: DeliveryRepository

  const DeliveryRepositoryMock = {
    execute: jest.fn(),
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryRepository,
        {
          provide: MYSQL_CONNECTION,
          useValue: DeliveryRepositoryMock,
        },
      ],
    }).compile()

    deliveryRepository = module.get<DeliveryRepository>(DeliveryRepository)
  })

  describe('findByMember method', () => {
    context('Member 정보가 주어지고 조회 값을 반환하면', () => {
      beforeEach(() => {
        DeliveryRepositoryMock.execute.mockResolvedValue([[dbDeliveriesMock] as RowDataPacket[], []])
      })
      it('배송지 정보를 리턴해야 한다', async () => {
        const deliveries = await deliveryRepository.findByMember(userMock())

        const expectedResults = dbDeliveriesMock.map((row) => ({
          id: row['delivery_id'],
          deliveryName: row['delivery_name'],
          deliveryFee: row['delivery_fee'],
          member: row['member_id'],
          createTime: row['create_time'],
          updateTime: row['update_time'],
          createBy: row['create_by'],
          modifiedBy: row['modified_by'],
        }))

        expect(deliveries).toStrictEqual(expectedResults)
      })
    })

    context('Member 정보가 주어지고 undefined를 반환하면', () => {
      beforeEach(() => {
        DeliveryRepositoryMock.execute.mockResolvedValue([[undefined] as RowDataPacket[], []])
      })
      it('빈 배열을 리턴해야 한다', async () => {
        const deliveries = await deliveryRepository.findByMember(userMock())

        expect(deliveries).toStrictEqual([])
      })
    })

    context('Member 정보가 주어지고 null를 반환하면', () => {
      beforeEach(() => {
        DeliveryRepositoryMock.execute.mockResolvedValue([[null] as RowDataPacket[], []])
      })
      it('빈 배열을 리턴해야 한다', async () => {
        const deliveries = await deliveryRepository.findByMember(userMock())

        expect(deliveries).toStrictEqual([])
      })
    })
  })
})
