import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'
import User from './User.js'

const BankInformation = sequelize.define('bank_information_model', {
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
  // foreign keys
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE',
  }
}, {
  timestamps: true,
  tableName: 'bank_information',
})

export default BankInformation