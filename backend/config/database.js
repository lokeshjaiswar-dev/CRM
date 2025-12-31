import sql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = sql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.SQL_PORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

export default pool;