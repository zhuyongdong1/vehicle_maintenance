const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Vehicle = require('./Vehicle')

const WashRecord = sequelize.define('WashRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vehicle,
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
})

WashRecord.belongsTo(Vehicle, { foreignKey: 'vehicle_id' })
Vehicle.hasMany(WashRecord, { foreignKey: 'vehicle_id' })

module.exports = WashRecord 