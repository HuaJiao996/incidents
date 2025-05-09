import { timestamp } from "drizzle-orm/pg-core"

export const withAtTimestemp = <T extends Record<string, any>>(table: T) => {
    return {
        ...table,
        createdAt: timestamp().defaultNow().notNull(),
        updatedAt: timestamp().defaultNow().notNull(),
    }
}