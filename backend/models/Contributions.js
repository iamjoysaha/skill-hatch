import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'

const Contributions = sequelize.define('Contributions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  // foreign keys
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
  },
}, {
  timestamps: true,
  tableName: 'contributions',
  indexes: [
    { name: 'student_id_index', fields: ['student_id'] },
    { name: 'mentor_id_index', fields: ['mentor_id'] },
    { name: 'unique_student_mentor', unique: true, fields: ['student_id', 'mentor_id'] }
  ],
  validate: {
    notSelfContribution() {
      if (this.student_id === this.mentor_id) {
        throw new Error('\nStudent and mentor cannot be the same user!\n')
      }
    }
  }
})

export default Contributions