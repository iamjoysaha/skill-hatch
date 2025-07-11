import { sequelize } from '../config/database.js'
import { DataTypes, NOW } from 'sequelize'

const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    college_name: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    roll_no: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    account_type: {
        type: DataTypes.ENUM('student', 'mentor'),
        allowNull: false,
        defaultValue: 'student',
    },
    expertise: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive',
    },
    last_active_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'users',
    indexes: [
        { name: 'username_index', fields: ['username'], unique: true },
        { name: 'email_index', fields: ['email'], unique: true },
        { name: 'rollno_index', fields: ['roll_no'], unique: true },
        { name: 'status_index', fields: ['status'] },
        { name: 'account_type_index', fields: ['account_type'] },
    ]
})

export default Users