const mongoose = require('mongoose')

const equipmentSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['notebook', 'celular', 'tablet', 'otros'] },
  brand: { type: String, required: true },
  model: String,
  problemDescription: { type: String, required: true },
  repairCost: Number, // Costo estimado de la reparación∫∫
  estimatedProfit: Number, // Ganancia estimada
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // Referencia al cliente dueño del equipo
  dateReceived: { type: Date, default: Date.now }, // Fecha en que se recibió el equipo
  dateReturned: Date // Fecha en que el cliente recogió el equipo,
})

const Equipment = mongoose.model('Equipment', equipmentSchema)

module.exports = Equipment
