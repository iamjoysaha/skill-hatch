import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'

const Roadmaps = sequelize.define('Roadmaps', {
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
  experience_level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advance'),
    allowNull: false,
    defaultValue: 'beginner'
  },
  // foreign keys
  student_id: {
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
  tableName: 'roadmaps',
  indexes: [ { name: 'student_id_index', fields: ['student_id'] }, 
             { name: 'experience_level_index', fields: ['experience_level'] }
    ]
})

export default Roadmaps