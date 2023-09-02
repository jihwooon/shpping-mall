export interface Repository<T, ID> {
  save(entity: T): Promise<void>
}
