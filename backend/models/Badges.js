import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'

const Badges = sequelize.define('Badges', {
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
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  experience_level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advance'),
    allowNull: false,
    defaultValue: 'beginner'
  },
  ratings: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
}, {
  timestamps: true,
  tableName: 'badges',
  indexes: [
    { name: 'experience_level_index', fields: ['experience_level'] },
    { name: 'points_index', fields: ['points'] },
    { name: 'ratings_index', fields: ['ratings'] } ]
})


export default Badges