import dotenv from 'dotenv'
import { sequelize } from '../config/database.js'
import { 
    User, 
    Activity,
    BankInformation,
    Chat,
    Community,
    Connection,
    Contribution,
    Feedback,
    Roadmap,
} from '../models/index.js'

dotenv.config()

// create pre-existing data here!
const seedData = async () => {}

async function initializeDB() {
    try {
        await sequelize.authenticate()
        console.log('\n::: Database connection successfull!✅ :::\n')

        const shouldForceSync = process.env.DB_FORCE_SYNC === 'true'
        await sequelize.sync({ force: shouldForceSync })
        console.log(`\n:::: Database synced ${shouldForceSync ? 'with' : 'without'} force!✅ ::::\n`)

        if (shouldForceSync) {
            await seedData()
            console.log('Seeded Roles and Committees!\n')
        }
    }
    catch(error) {
        console.error(error)
        console.log('\n::: Database connection failed!❌ :::\n')
    }
}

export {
    initializeDB,
}