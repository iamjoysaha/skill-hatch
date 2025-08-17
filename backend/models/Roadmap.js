import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'
import User from './User.js'

const Roadmap = sequelize.define('roadmap_model', {
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
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  tasks: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  earned_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  total_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  badge: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  level: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'beginner',
  },
  status: {
    type: DataTypes.ENUM('completed', 'pending'),
    allowNull: false,
    defaultValue: 'pending',
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
  tableName: 'roadmap',
  indexes: [ 
    { name: 'user_id_index', fields: ['user_id'] },
  ]
})

export default Roadmap