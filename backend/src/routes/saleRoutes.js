const express = require('express')
const router = express.Router()
const Sale = require('../models/Sale') // Importar el modelo de ventas
const Accessory = require('../models/Accessory') // Importar el modelo de accesorios

router.post('/sale', async (req, res) => {
  try {
    const { date, accessoriesSold, total } = req.body

    // Registrar la venta
    const newSale = new Sale({
      date,
      accessoriesSold,
      total
    })

    const savedSale = await newSale.save()

    // Actualizar el stock de los accesorios vendidos
    for (const item of accessoriesSold) {
      const accessoryId = item._id // Supongo que el ID del accesorio vendido está en _id
      const quantitySold = item.quantity

      // Recuperar el accesorio de la base de datos
      const accessory = await Accessory.findById(accessoryId)
      if (!accessory) {
        console.error(`Accesorio con ID ${accessoryId} no encontrado.`)
        // Puedes manejar este error como consideres apropiado
      } else {
        // Actualizar el stock del accesorio
        accessory.quantityInStock -= quantitySold
        await accessory.save()
      }
    }

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

// Ruta para obtener el total de ventas en función del rango de fechas seleccionado
router.get('/sales/totals', async (req, res) => {
  try {
    const { from, to } = req.query // Obtén los valores del rango de fechas desde la consulta

    // Realiza la consulta a la base de datos para sumar las ventas en el rango de fechas
    const totalSalesValue = await Sale.aggregate([
      {
        $match: {
          date: { $gte: new Date(from), $lte: new Date(to) }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$total' }
        }
      }
    ])

    res.send({ totalSales: totalSalesValue[0]?.totalSales || 0 })
  } catch (error) {
    console.error('Error al obtener el total de ventas:', error)
    res.status(500).send('Error al obtener el total de ventas')
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
