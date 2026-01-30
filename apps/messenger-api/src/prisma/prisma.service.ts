import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient {
  constructor() {
    const isProd = process.env.NODE_ENV === 'production';

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isProd
        ? {
            rejectUnauthorized: false,
          }
        : false,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
  }
}
