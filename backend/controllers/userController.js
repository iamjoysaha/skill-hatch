import { Op } from 'sequelize'
import bcrypt from 'bcrypt'
import { Users } from '../models/index.js'

async function createUser({ first_name, last_name, college_name, roll_no, email, username, password, account_type, expertise }) {
    try {
        let user = await Users.findOne({ where: { [Op.or]: [ { email }, { username } ] } })
        if(user)
            return { success: false, message: 'User already exists!' }
        
        const hashedPassword = await bcrypt.hash(password, 10)

        user = await Users.create({ first_name, last_name, college_name, roll_no, username, email, password: hashedPassword, account_type, expertise })
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

async function loginUser({ email, password }) {
    try {
        const user = await Users.findOne({ where: { email } })
        if (!user) 
            return { success: false, message: 'User not found!' }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) 
            return { success: false, message: 'Invalid password!' }

        await user.update({ last_active_at: new Date(), status: 'active' })
        return { success: true, message: 'Login successful!', user }
    } 
    catch (error) {
        console.error(error)
        console.log('\n:::Exception occurred inside loginUser! :::\n')
        return { success: false, message: 'Login failed!' }
    }
}

async function getUserByEmail({ email }) {
    if (!email || typeof email !== 'string') {
        return { success: false, message: 'Invalid email provided' }
    }

    try {
        const user = await Users.findOne({ where: { email } })
        if (!user)
        return { success: false, message: 'User not found for this email' }

        return { success: true, message: 'User found!', user }
    } 
    catch (error) {
        console.error(error)
        console.log('\n:::Exception occurred inside getUserByEmail! :::\n')
        return { success: false, message: 'User lookup failed!' }
    }
}

async function getAllUsers() {
    try {
        const users = await Users.findAll()
        if (!users.length)
            return { success: false, message: 'Users not found!' }

        return { success: true, users }
    } 
    catch (error) {
        console.error(error)
        console.log('\n:::Exception occurred inside getAllUsers! :::\n')
        return { success: false, message: 'Failed to fetch users!' }
    }
}

async function getUsersByAccountType(account_type) {
    try {
        const users = await Users.findAll()
        if (!users.length)
            return { success: false, message: 'Users not found!' }

        return { success: true, users }
    } 
    catch (error) {
        console.error(error)
        console.log('\n:::Exception occurred inside getUsersByAccount! :::\n')
        return { success: false, message: 'Failed to fetch users!' }
    }
}

async function updateLastActive(user_id) {
    if (!user_id)
        return { success: false, message: 'User ID is required' }

    try {
        const user = await Users.findByPk(user_id);
        if (!user)
            return { success: false, message: 'User not found' }

        const now = new Date()
        await user.update({ last_active_at: now, status: 'active' })
        return { success: true, message: 'User activity updated!', user }
    } 
    catch (error) {
        console.error(error)
        console.log('\n:::Exception occurred inside updateLastActive! :::\n')
        return { success: false, message: 'Failed to update user activity' }
    }
}

export {
    createUser,
    loginUser,
    getUserByEmail,
    getAllUsers,
    getUsersByAccountType,
    updateLastActive,
}