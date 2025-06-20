const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plate_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  vin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  owner_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  owner_phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  owner_address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
})

module.exports = Vehicle 