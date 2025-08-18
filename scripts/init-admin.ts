import { randomBytes } from "crypto";
import { databaseClient } from "@incidents/database";

import { auth } from "@incidents/auth";

async function main() {
  const email = process.env.INIT_ADMIN_EMAIL || "admin@localhost";

  const exists = await databaseClient.user.findUnique({ where: { email } });
  if (exists) {
    console.log("[init-admin] Admin already exists, skipping.");
    return;
  }

  const tempPassword = randomBytes(12).toString("base64url");
  await auth.api.createUser({
    body: {
      email,
      password: tempPassword,
      name: "Initial Admin",
      role: "admin",
    },
  });

  // 只打印一次，Docker logs 能看到
  console.warn(`[init-admin] *********************************************************
[init-admin] Initial admin created: ${email}
[init-admin] TEMPORARY PASSWORD (store once): ${tempPassword}
[init-admin] *********************************************************`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => databaseClient.$disconnect());