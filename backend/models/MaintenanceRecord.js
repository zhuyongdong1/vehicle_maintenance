const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Vehicle = require('./Vehicle')

const MaintenanceRecord = sequelize.define('MaintenanceRecord', {
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
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
})

MaintenanceRecord.belongsTo(Vehicle, { foreignKey: 'vehicle_id' })
Vehicle.hasMany(MaintenanceRecord, { foreignKey: 'vehicle_id' })

module.exports = MaintenanceRecord 