const mongoose = require('mongoose')

const saleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  accessoriesSold: [{
    accessory: { type: mongoose.Schema.Types.ObjectId, ref: 'Accessory' },
    quantity: { type: Number, required: true }
  }],
  total: { type: Number, required: true }
  // Otros campos según tus necesidades
})

const Sale = mongoose.model('Sale', saleSchema)

module.exports = Sale
