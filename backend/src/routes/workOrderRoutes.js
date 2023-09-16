const express = require('express')
const router = express.Router()
const WorkOrder = require('../models/WorkOrder')

router.post('/work-order', async (req, res) => {
  try {
    // No incluir el campo 'orderNumber' en req.body
    const newWorkOrder = new WorkOrder(req.body)
    const savedWorkOrder = await newWorkOrder.save()
    res.status(201).send(savedWorkOrder)
  } catch (error) {
    console.error('Error al crear la orden de trabajo:', error)
    res.status(500).send('Error al crear la orden de trabajo')
  }
})

router.get('/work-orders', async (req, res) => {
  try {
    const workOrders = await WorkOrder.find().populate('client').populate('equipments')
    res.send(workOrders)
  } catch (error) {
    console.error('Error al obtener las órdenes de trabajo:', error)
    res.status(500).send('Error al obtener las órdenes de trabajo')
  }
})

router.patch('/work-order/:id', async (req, res) => {
  try {
    const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedWorkOrder) {
      res.status(404).send('Orden de trabajo no encontrada')
    } else {
      res.send(updatedWorkOrder)
    }
  } catch (error) {
    console.error('Error al editar la orden de trabajo:', error)
    res.status(500).send('Error al editar la orden de trabajo')
  }
})

router.delete('/work-order/:id', async (req, res) => {
  try {
    const deletedWorkOrder = await WorkOrder.findByIdAndDelete(req.params.id)
    if (!deletedWorkOrder) {
      res.status(404).send('Orden de trabajo no encontrada')
    } else {
      res.send({ message: 'Orden de trabajo eliminada correctamente' })
    }
  } catch (error) {
    console.error('Error al eliminar la orden de trabajo:', error)
    res.status(500).send('Error al eliminar la orden de trabajo')
  }
})

module.exports = router
