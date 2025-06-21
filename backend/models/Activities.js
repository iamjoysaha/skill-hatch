import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'

const Activities = sequelize.define('Activities', {
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
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true,
  tableName: 'activities',
  indexes: [
    {
      name: 'user_id_index',
      fields: ['user_id'],
    }
  ]
})

export default Activities