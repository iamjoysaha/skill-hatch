import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'
import User from './User.js'

const Community = sequelize.define('community_model', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  link: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  image_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(255),
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
  tableName: 'community',
  indexes: [
    { name: 'user_id_index', fields: ['user_id'] },
  ]
})

export default Community