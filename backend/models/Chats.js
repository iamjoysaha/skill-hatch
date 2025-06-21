import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'

const Chats = sequelize.define('Chats', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  // foreign keys
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  connection_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'connections',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true,
  tableName: 'chats',
  indexes: [
    { name: 'sender_id_index', fields: ['sender_id'] },
    { name: 'receiver_id_index', fields: ['receiver_id'] },
    { name: 'connection_id_index', fields: ['connection_id'] },
  ]
})

export default Chats