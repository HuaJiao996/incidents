import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
export const databaseClient = new PrismaClient({ adapter })
export  * from './generated/prisma/client'
export  * from './generated/prisma/models'
