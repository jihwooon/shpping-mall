export interface Repository<T, ID> {
  save(entity: T): Promise<void>
  findById(id: ID): Promise<T>
}