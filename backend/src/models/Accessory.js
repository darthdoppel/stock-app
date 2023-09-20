const mongoose = require('mongoose')

const accessorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['fundas', 'protectores de pantalla', 'auriculares', 'cargadores', 'cables', 'varios'] },
  brand: String,
  compatiblePhoneModel: String,
  price: { type: Number, required: true },
  quantityInStock: { type: Number, default: 0 },
  description: String,
  supplier: String,
  dateAdded: { type: Date, default: Date.now },
  imageUrl: String
})

const Accessory = mongoose.model('Accessory', accessorySchema)

module.exports = Accessory
