import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'

const Connections = sequelize.define('Connections', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },
  is_connected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  requested_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
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
  tableName: 'connections',
  indexes: [
    { name: 'student_id_index', fields: ['student_id'] },
    { name: 'mentor_id_index', fields: ['mentor_id'] },
    { name: 'unique_connection', unique: true, fields: ['student_id', 'mentor_id'] }
  ],
  validate: {
    notSelfConnection() {
      if (this.student_id === this.mentor_id) {
        throw new Error('\nA student cannot connect with themselves!\n');
      }
    }
  }
})

export default Connections
