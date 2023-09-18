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
    const page = parseInt(req.query.page) || 1 // Obtén el número de página de la consulta o usa 1 como valor predeterminado
    const perPage = parseInt(req.query.perPage) || 10 // Obtén la cantidad por página o usa 10 como valor predeterminado

    const skip = (page - 1) * perPage // Calcula el número de documentos para omitir
    const workOrders = await WorkOrder.find()
      .populate('client')
      .populate('equipments')
      .skip(skip) // Omite los documentos anteriores en función de la página
      .limit(perPage) // Limita la cantidad de documentos por página

    const totalWorkOrders = await WorkOrder.countDocuments() // Cuenta el número total de documentos en la colección

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
