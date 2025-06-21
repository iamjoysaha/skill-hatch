import { Sequelize } from 'sequelize'

// for localhost
const sequelize = new Sequelize({
    database: 'skill_hatch',
    username: 'root',
    password: 'root',
    host: 'localhost',
    dialect: 'mysql',
})

export {
    sequelize,
}