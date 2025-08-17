import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'
import Connection from './Connection.js'
import User from './User.js'

const Feedback = sequelize.define('feedback_model', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  comment: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  // foreign keys
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  connection_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Connection,
      key: 'id',
    },
    onDelete: 'CASCADE',
  }
}, {
  timestamps: true,
  tableName: 'feedback',
  indexes: [
    { name: 'user_id_index', fields: ['user_id'] },
    { name: 'connection_id_index', fields: ['connection_id'] },
  ]
})

export default Feedback