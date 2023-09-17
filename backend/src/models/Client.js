const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // Puedes hacerlo único si quieres que no haya emails repetidos, y sparse para permitir valores nulos
  dni: { type: String, unique: true, required: true }, // Añadiendo el campo DNI y haciendo que sea único y requerido
  address: String,
  notes: String, // Cualquier nota adicional sobre el cliente
  dateAdded: { type: Date, default: Date.now }
})

const Client = mongoose.model('Client', clientSchema)

module.exports = Client
