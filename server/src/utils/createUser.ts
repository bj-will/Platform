import readline from "readline";
import bcrypt from "bcryptjs";
import { db } from "../db/db";
import { users } from "../db/schema";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q: string): Promise<string> {
  return new Promise((resolve) => rl.question(q, resolve));
}

async function main() {
  try {
    const wallet = await ask("Enter username: ");
    const password = await ask("Enter password: ");
    const confirm = await ask("Confirm password: ");

    if (password !== confirm) {
      console.error("❌ Passwords do not match");
      process.exit(1);
    }

    const hash = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      wallet,
      passwordHash: hash,
    });

    console.log(`✅ User '${wallet}' created successfully`);
  } catch (err) {
    console.error("❌ Error creating user:", err);
  } finally {
    rl.close();
    process.exit(0);
  }
}

main();
