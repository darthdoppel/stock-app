const express = require('express')
const router = express.Router()
const Sale = require('../models/Sale') // Importar el modelo de ventas

router.post('/sale', async (req, res) => {
  try {
    const newSale = new Sale(req.body)
    const savedSale = await newSale.save()
    res.status(201).send(savedSale)
  } catch (error) {
    console.error('Error al guardar la venta:', error)
    res.status(500).send('Error al guardar la venta')
  }
})

router.get('/sales', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const perPage = parseInt(req.query.perPage) || 10

    const skip = (page - 1) * perPage
    const sales = await Sale.find()
      .skip(skip)
      .limit(perPage)
      .populate('accessoriesSold') // Poblar las referencias de accesorios vendidos

    const totalSales = await Sale.countDocuments()

    res.send({
      data: sales,
      total: totalSales
    })
  } catch (error) {
    console.error('Error al obtener las ventas:', error)
    res.status(500).send('Error al obtener las ventas')
  }
})

router.get('/sale/:id', async (req, res) => {
  try {
    const id = req.params.id
    const sale = await Sale.findById(id).populate('accessoriesSold')
    if (!sale) {
      res.status(404).send('Venta no encontrada')
      return
    }
    res.send(sale)
  } catch (error) {
    console.error('Error al obtener la venta:', error)
    res.status(500).send('Error al obtener la venta')
  }
})

router.delete('/sale/:id', async (req, res) => {
  try {
    const id = req.params.id
    const deletedSale = await Sale.findByIdAndDelete(id)
    if (!deletedSale) {
      res.status(404).send('Venta no encontrada')
      return
    }
    res.send(deletedSale)
  } catch (error) {
    console.error('Error al eliminar la venta:', error)
    res.status(500).send('Error al eliminar la venta')
  }
})

module.exports = router
