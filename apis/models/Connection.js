import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'
import User from './User.js'

const Connection = sequelize.define('connection_model', {
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
  accepted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // foreign keys
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  mentor_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true,
  tableName: 'connection',
  validate: {
    notSelfConnection() {
      if (this.student_id === this.mentor_id) {
        throw new Error('\nA student cannot connect with themselves!\n');
      }
    }
  }
})

export default Connection
