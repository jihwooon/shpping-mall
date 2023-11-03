import { userMock } from './memberFixture'
import { Delivery } from '../delivery/domain/delivery.entity'

export const deliveryMock = (): Delivery => {
  return {
    id: 1,
    deliveryName: '마포구 물류센터',
    deliveryFee: 3000,
    member: userMock(),
    createTime: new Date('2023-08-23T23:10:00.009Z'),
    updateTime: new Date('2023-10-01T23:10:00.009Z'),
    createBy: '생성자',
    modifiedBy: '수정자',
  }
}

export const deliveriesMock = (): Delivery[] => {
  return [
    {
      id: 1,
      deliveryName: '마포구 물류센터',
      deliveryFee: 3000,
      member: userMock(),
      createTime: new Date('2023-08-23T23:10:00.009Z'),
      updateTime: new Date('2023-10-01T23:10:00.009Z'),
      createBy: '생성자',
      modifiedBy: '수정자',
    },
    {
      id: 2,
      deliveryName: '동탄 물류센터 무료배송',
      deliveryFee: 0,
      member: userMock(),
      createTime: new Date('2022-10-02T23:10:00.009Z'),
      updateTime: new Date('2023-09-01T23:10:00.009Z'),
      createBy: '생성자',
      modifiedBy: '수정자',
    },
  ]
}

export const dbDeliveriesMock = [
  {
    delivery_id: deliveriesMock()[0].id,
    delivery_name: deliveriesMock()[0].deliveryName,
    delivery_fee: deliveriesMock()[0].deliveryFee,
    member_id: userMock().memberId,
    create_time: deliveriesMock()[0].createTime,
    update_time: deliveriesMock()[0].updateTime,
    create_by: deliveriesMock()[0].createBy,
    modified_by: deliveriesMock()[0].modifiedBy,
  },
  {
    delivery_id: deliveriesMock()[1].id,
    delivery_name: deliveriesMock()[1].deliveryName,
    delivery_fee: deliveriesMock()[1].deliveryFee,
    member_id: userMock().memberId,
    create_time: deliveriesMock()[1].createTime,
    update_time: deliveriesMock()[1].updateTime,
    create_by: deliveriesMock()[1].createBy,
    modified_by: deliveriesMock()[1].modifiedBy,
  },
]
