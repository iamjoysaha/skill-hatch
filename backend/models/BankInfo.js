import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'

const BankInfo = sequelize.define('BankInfo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  mentor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
  }
}, {
  timestamps: true,
  tableName: 'bank_info',
  indexes: [
    {
      name: 'mentor_id_index',
      fields: ['mentor_id']
    }
  ]
})

export default BankInfo