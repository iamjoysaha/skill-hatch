import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'

const Feedbacks = sequelize.define('Feedbacks', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  // foreign keys
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tasks',
      key: 'id',
    },
    onDelete: 'CASCADE',
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
  mentor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  }
}, {
  timestamps: true,
  tableName: 'feedbacks',
  indexes: [
    { name: 'student_id_index', fields: ['student_id'] },
    { name: 'mentor_id_index', fields: ['mentor_id'] },
    { name: 'task_id_index', fields: ['task_id'] }
  ]
})

export default Feedbacks