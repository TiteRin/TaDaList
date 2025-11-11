import "@testing-library/jest-dom";
import {config} from "dotenv";
import {afterAll, beforeAll} from "vitest";
import path from "node:path";
import * as fs from "node:fs";
import {execSync} from "node:child_process";

config({path: '.env.test', override: true})

// beforeAll(async () => {
//     const testDbPath = path.join(process.cwd(), 'prisma', '.test.db');
//     if (fs.existsSync(testDbPath)) {
//         fs.unlinkSync(testDbPath);
//     }
//
//     try {
//         execSync('npx prisma migrate deploy', {
//             cwd: process.cwd(),
//             stdio: 'pipe'
//         });
//     } catch (error) {
//         console.error('Migration error:', error);
//     }
// })
//
// afterAll(async () => {
//     const testDbPath = path.join(process.cwd(), 'prisma', '.test.db');
//
//     if (fs.existsSync(testDbPath)) {
//         fs.unlinkSync(testDbPath);
//     }
// });