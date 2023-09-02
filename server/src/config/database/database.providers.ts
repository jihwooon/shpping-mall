import { createConnection } from 'mysql2/promise'
import * as dotenv from 'dotenv'
import { MYSQL_CONNECTION } from './constants'

dotenv.config()

export const databaseProviders = [
  {
    provide: MYSQL_CONNECTION,
    useFactory: async () => {
      const connection = await createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_ROOT_USER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: parseInt(process.env.MYSQL_PORT),
      })
      return connection
    },
  },
]
