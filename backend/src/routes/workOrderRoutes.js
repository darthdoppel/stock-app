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
    const page = parseInt(req.query.page) || 1
    const perPage = parseInt(req.query.perPage) || 10
    const filter = req.query.filter || ''
    const status = req.query.status || '' // Añadir esta línea

    const skip = (page - 1) * perPage

    // Crea un objeto vacío para las condiciones de búsqueda.
    const conditions = {}

    if (filter) {
      conditions.status = filter
    }

    // Si hay un valor de estado, añade la condición de estado
    if (status) {
      conditions.status = status // Añadir esta línea
    }

    const workOrders = await WorkOrder.find(conditions)
      .populate('client')
      .populate('equipments')
      .skip(skip)
      .limit(perPage)

    const totalWorkOrders = await WorkOrder.countDocuments(conditions)

    res.send({
      data: workOrders,
      total: totalWorkOrders
    })
  } catch (error) {
    console.error('Error al obtener las órdenes de trabajo:', error)
    res.status(500).send('Error al obtener las órdenes de trabajo')
  }
})

router.get('/work-order/:id', async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
      .populate('client')
      .populate('equipments')

    if (!workOrder) {
      return res.status(404).send('Orden de trabajo no encontrada')
    }

    res.send(workOrder)
  } catch (error) {
    console.error('Error al obtener la orden de trabajo:', error)
    res.status(500).send('Error al obtener la orden de trabajo')
  }
})

router.patch('/work-order/:id', async (req, res) => {
  console.log('Datos recibidos para actualización:', req.body)
  try {
    const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('client')
      .populate('equipments')

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

router.put('/work-order/:id/status', async (req, res) => {
  try {
    const { status } = req.body

    const workOrder = await WorkOrder.findById(req.params.id)
    if (!workOrder) {
      return res.status(404).send('Orden de trabajo no encontrada')
    }

    workOrder.status = status
    await workOrder.save()

    res.json(workOrder)
  } catch (error) {
    console.error('Error al actualizar el estado de la orden de trabajo:', error)
    res.status(500).send('Error al actualizar el estado de la orden de trabajo')
  }
})

router.get('/client/:clientId/work-orders', async (req, res) => {
  try {
    const clientId = req.params.clientId
    const workOrdersForClient = await WorkOrder.find({ client: clientId })
      .populate('client')
      .populate('equipments')

    res.send(workOrdersForClient)
  } catch (error) {
    console.error('Error al obtener las órdenes de trabajo del cliente:', error)
    res.status(500).send('Error al obtener las órdenes de trabajo del cliente')
  }
})

module.exports = router
