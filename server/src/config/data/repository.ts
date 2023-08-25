export interface Repository<T, ID> {
  save(entity: T): Promise<void>
  findById(id: ID): Promise<T>
  // update(entity: T, id: ID): Promise<boolean>
  // delete(entity: T) : Promise<void>
  // deleteById(id: ID) : Promise<void>
}
