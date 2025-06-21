import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'

const Tasks = sequelize.define('Tasks', {
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
  status: {
    type: DataTypes.ENUM('pending', 'completed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  roadmap_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roadmaps',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true,
  tableName: 'tasks',
  indexes: [
    { name: 'student_id_index', fields: ['student_id'] },
    { name: 'roadmap_id_index', fields: ['roadmap_id'] },
    { name: 'status_index', fields: ['status'] }
  ]
})

export default Tasks