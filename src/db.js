import { Pool } from'pg';

const connectionString =
    process.env.DATABASE_URL || 'postgresql://postgres:hiphop@localhost:5432/timerdb';

export const pool = new Pool({ connectionString });