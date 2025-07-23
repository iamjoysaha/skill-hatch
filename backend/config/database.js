import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

// for localhost
const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
})

export {
    sequelize,
}