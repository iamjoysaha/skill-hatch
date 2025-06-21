import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'

const UserHasBadges = sequelize.define('UserHasBadges', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  badge_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'badges',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true,
  tableName: 'user_has_badges',
  indexes: [
    {
      name: 'unique_user_badge',
      unique: true,
      fields: ['user_id', 'badge_id'],
    },
  ],
})

export default UserHasBadges