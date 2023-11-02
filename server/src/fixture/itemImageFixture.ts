import { ItemImage } from '../item-images/domain/item-image.entity'
import { itemMock } from './itemFixture'

export const itemImageMock = (): ItemImage => {
  return {
    id: 1,
    createTime: new Date('2023-09-01T23:10:00.009Z'),
    updateTime: new Date('2023-09-01T23:10:00.009Z'),
    createBy: '생성자',
    modifiedBy: '수정자',
    imageName: 'e2e24aa3-5744-4cd0-b12f-e95dffdcd322.jpeg',
    imageUrl: 'uploads/e2e24aa3-5744-4cd0-b12f-e95dffdcd322.jpeg',
    isRepresentImage: false,
    originalImageName: '접수신청[시험선택] : 데이터자격시험 2023-08-07 11-49-11.jpg',
    item: itemMock(),
  }
}

export const itemImagesMock = (): ItemImage[] => {
  return [
    {
      id: 1,
      createTime: new Date('2023-09-01T23:10:00.009Z'),
      updateTime: new Date('2023-09-01T23:10:00.009Z'),
      createBy: '생성자',
      modifiedBy: '수정자',
      imageName: 'e2e24aa3-5744-4cd0-b12f-e95dffdcd322.jpeg',
      imageUrl: 'uploads/e2e24aa3-5744-4cd0-b12f-e95dffdcd322.jpeg',
      isRepresentImage: true,
      originalImageName: '접수신청[시험선택] : 데이터자격시험 2023-08-07 11-49-11.jpg',
      item: itemMock(),
    },
    {
      id: 2,
      createTime: new Date('2023-09-02T23:10:00.009Z'),
      updateTime: new Date('2023-09-02T23:10:00.009Z'),
      createBy: '생성자',
      modifiedBy: '수정자',
      imageName: '30b947f4-bc2e-4f28-9412-9c6f5e8c8bcd.jpeg',
      imageUrl: 'uploads/30b947f4-bc2e-4f28-9412-9c6f5e8c8bcd.jpeg',
      isRepresentImage: false,
      originalImageName: '1-1관계.jpg',
      item: itemMock(),
    },
  ]
}

export const dbItemImagesMock = [
  {
    item_image_id: itemImagesMock()[0].id,
    create_time: itemImagesMock()[0].createTime,
    update_time: itemImagesMock()[0].updateTime,
    create_by: itemImagesMock()[0].createBy,
    modified_by: itemImagesMock()[0].modifiedBy,
    image_name: itemImagesMock()[0].imageName,
    image_url: itemImagesMock()[0].imageUrl,
    is_req_image: itemImagesMock()[0].isRepresentImage,
    original_image_name: itemImagesMock()[0].originalImageName,
    item_id: itemMock().id,
  },
  {
    item_image_id: itemImagesMock()[1].id,
    create_time: itemImagesMock()[1].createTime,
    update_time: itemImagesMock()[1].updateTime,
    create_by: itemImagesMock()[1].createBy,
    modified_by: itemImagesMock()[1].modifiedBy,
    image_name: itemImagesMock()[1].imageName,
    image_url: itemImagesMock()[1].imageUrl,
    is_req_image: itemImagesMock()[1].isRepresentImage,
    original_image_name: itemImagesMock()[1].originalImageName,
    item_id: itemMock().id,
  },
]

export const filesMock = (): Express.Multer.File[] => [
  {
    originalname: 'file1.jpg',
    mimetype: 'text/jpg',
    path: 'something',
    buffer: Buffer.from('one,two,three'),
    fieldname: '',
    encoding: '',
    size: 0,
    stream: undefined,
    destination: '',
    filename: '',
  },
  {
    originalname: 'file2.jpg',
    mimetype: 'text/jpg',
    path: 'something',
    buffer: Buffer.from('one,two,three'),
    fieldname: '',
    encoding: '',
    size: 0,
    stream: undefined,
    destination: '',
    filename: '',
  },
]

export const fileMock = (): Express.Multer.File => ({
  originalname: 'file1.jpg',
  mimetype: 'text/jpg',
  path: 'something',
  buffer: Buffer.from('one,two,three'),
  fieldname: '',
  encoding: '',
  size: 0,
  stream: undefined,
  destination: '',
  filename: '',
})
