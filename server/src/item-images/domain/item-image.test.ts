import { ItemImage } from './item-image.entity'
import { itemImageMock } from '../../../fixture/itemImageFixture'

describe('ItemImage', () => {
  let itemImage: ItemImage

  beforeEach(() => {
    itemImage = new ItemImage(itemImageMock())
  })

  context('객체가 주어지면', () => {
    it('값을 리턴해야 한다', () => {
      expect(itemImage.id).toEqual(itemImageMock().id)
      expect(itemImage.modifiedBy).toEqual(itemImageMock().modifiedBy)
      expect(itemImage.createBy).toEqual(itemImageMock().createBy)
      expect(itemImage.createTime).toEqual(itemImageMock().createTime)
      expect(itemImage.updateTime).toEqual(itemImageMock().updateTime)
      expect(itemImage.imageName).toEqual(itemImageMock().imageName)
      expect(itemImage.imageUrl).toEqual(itemImageMock().imageUrl)
      expect(itemImage.isRepresentImage).toEqual(itemImageMock().isRepresentImage)
      expect(itemImage.originalImageName).toEqual(itemImageMock().originalImageName)
      expect(itemImage.item).toEqual(itemImageMock().item)
    })
  })

  context('객체가 빈 값이 주어지면', () => {
    beforeEach(() => {
      itemImage = new ItemImage({})
    })
    it('default 값을 리턴해야 한다', () => {
      expect(itemImage.id).toEqual(0)
      expect(itemImage.imageName).toEqual('')
      expect(itemImage.imageUrl).toEqual('')
      expect(itemImage.isRepresentImage).toEqual(false)
      expect(itemImage.originalImageName).toEqual('')
    })
  })
})
