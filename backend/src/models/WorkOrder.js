const mongoose = require('mongoose')

const workOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
  dateCreated: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' }
})

// Middleware para generar el número de orden único antes de guardar
workOrderSchema.pre('save', async function (next) {
  try {
    if (!this.orderNumber) {
      // Consultar la última orden de trabajo para obtener su número de orden
      const lastOrder = await this.constructor.findOne({}, {}, { sort: { orderNumber: -1 } })
      let newOrderNumber = 1 // Valor predeterminado para la primera orden
      if (lastOrder && lastOrder.orderNumber) {
        // Si hay una última orden, incrementar el número
        newOrderNumber = parseInt(lastOrder.orderNumber, 10) + 1
      }
      this.orderNumber = newOrderNumber.toString() // Asignar el número de orden único
    }
    next()
  } catch (error) {
    next(error)
  }
})

const WorkOrder = mongoose.model('WorkOrder', workOrderSchema)

module.exports = WorkOrder
