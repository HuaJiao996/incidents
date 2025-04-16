import { drizzle } from "drizzle-orm/postgres-js";
import { reset, seed } from "drizzle-seed";
import postgres from "postgres";
import * as schema from "./src/database/schema";

async function main() {
  // 创建 postgres 客户端
  const client = postgres(process.env.DATABASE_URL!);
  // 使用客户端初始化 drizzle
  const db = drizzle(client);
  
  await reset(db, schema);

  await seed(db, { service: schema.service, serviceRoute: schema.serviceRoute }).refine(() => ({
    service: {
        count: 10,
        with: {
            serviceRoute: 10
        }
    }
  }));
  
  // 完成后关闭连接
  await client.end();
}

main().catch(console.error);
