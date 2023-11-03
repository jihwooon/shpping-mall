import { userMock } from '../../../fixture/memberFixture'
import { Delivery } from './delivery.entity'
import { deliveryMock } from '../../../fixture/deliveryFixture'

describe('Delivery', () => {
  let delivery: Delivery

  describe('객체가 주어지면', () => {
    beforeEach(() => {
      delivery = new Delivery(deliveryMock())
    })

    it('값을 리턴해야 리턴해야 한다', () => {
      expect(delivery.id).toEqual(1)
      expect(delivery.deliveryName).toEqual('마포구 물류센터')
      expect(delivery.deliveryFee).toEqual(3000)
      expect(delivery.member).toEqual(userMock())
      expect(delivery.createTime).toEqual(new Date('2023-08-23T23:10:00.009Z'))
      expect(delivery.updateTime).toEqual(new Date('2023-10-01T23:10:00.009Z'))
      expect(delivery.createBy).toEqual('생성자')
      expect(delivery.modifiedBy).toEqual('수정자')
    })
  })

  describe('객체가 빈 값이 주어지면', () => {
    beforeEach(() => {
      delivery = new Delivery({})
    })

    it('default 값을 리턴해야 한다', () => {
      expect(delivery.id).toEqual(0)
      expect(delivery.deliveryName).toEqual('')
      expect(delivery.deliveryFee).toEqual(0)
      expect(delivery.createBy).toEqual('')
      expect(delivery.modifiedBy).toEqual('')
    })
  })
})
