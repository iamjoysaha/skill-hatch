import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'
import User from './User.js'

const Activity = sequelize.define('activity_model', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  activity: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
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
}, {
  timestamps: true,
  tableName: 'activity',
  indexes: [
    { name: 'user_id_index', fields: ['user_id'] }
  ]
})

export default Activity