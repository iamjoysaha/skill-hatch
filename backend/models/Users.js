import { sequelize } from '../config/database.js'
import { DataTypes, NOW } from 'sequelize'

const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    socket_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '',
        unique: true,
    },
    first_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    full_name: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.first_name} ${this.last_name}`;
        }
    },
    college_name: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
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
    },
    expertise: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
    },
    last_active_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    tableName: 'users',
    indexes: [
        { name: 'username_index', fields: ['username'], unique: true },
        { name: 'socket_id_index', fields: ['socket_id'], unique: true },
        { name: 'email_index', fields: ['email'], unique: true },
        { name: 'status_index', fields: ['status'] },
        { name: 'account_type_index', fields: ['account_type'] },
    ]
})

export default Users