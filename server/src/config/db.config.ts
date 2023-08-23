import {
  Connection,
  createConnection,
} from 'mysql2/promise'

const connectionPromise = createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'test',
})

export async function doQuery<R>(
  doWork: (connection: Connection) => Promise<R>,
): Promise<R> {
  const connection = await connectionPromise
  return doWork(connection)
}

export default doQuery
