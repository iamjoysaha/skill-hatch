import { Op } from 'sequelize'
import bcrypt from 'bcrypt'
import { Users } from '../models/index.js'

async function createUser({ socket_id, first_name, last_name, college_name, roll_no, email, username, password, account_type, expertise }) {
    try {
        let user = await Users.findOne({ where: { [Op.or]: [ { email }, { username }, roll_no ? { roll_no } : null].filter(Boolean)} })
        if(user) {
            return { success: false, message: 'User already exists!' }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user = await Users.create({ socket_id, first_name, last_name, college_name, roll_no, username, email, password: hashedPassword, account_type, expertise })
        return user ? 
            { success: true, message: 'Registration successful!', user } : 
            { success: false, message: 'Registration failed!'}
    }
    catch(error) {
        console.error(error)
        console.log('\n:::Exception occurred inside createUser! :::\n')
        return { success: false, message: 'Something went wrong!' }
    }
}

async function updateSocket({ user_id, socket_id }) {
    try {
        const user = await Users.findByPk(user_id)
        if (!user) 
            return { success: false, message: 'User not found!' }

        user.socket_id = socket_id
        await user.save()

        return { success: true, message: 'Socket ID updated!' }
    } 
    catch (error) {
        console.error(error)
        console.log('\n:::Exception occurred inside updateSocket! :::\n')
        return { success: false, message: 'Failed to update socket id!' }
    }
}

async function loginUser({ email, password }) {
    try {
        const user = await Users.findOne({ where: { email } })
        if (!user) 
            return { success: false, message: 'User not found!' }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) 
            return { success: false, message: 'Invalid password!' }

        return { success: true, message: 'Login successful!', user }
    } 
    catch (error) {
        console.error(error)
        console.log('\n:::Exception occurred inside loginUser! :::\n')
        return { success: false, message: 'Login failed!' }
    }
}


export {
    createUser,
    updateSocket,
    loginUser,
}