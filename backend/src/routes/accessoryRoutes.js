const express = require('express')
const router = express.Router()
const Accessory = require('../models/Accessory')

router.post('/accessory', async (req, res) => {
  try {
    const newAccessory = new Accessory(req.body)
    const savedAccessory = await newAccessory.save()
    res.status(201).send(savedAccessory)
  } catch (error) {
    console.error('Error al guardar el accesorio:', error)
    res.status(500).send('Error al guardar el accesorio')
  }
})

router.get('/accessories', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1 // Obtén el número de página de la consulta o usa 1 como valor predeterminado
    const perPage = parseInt(req.query.perPage) || 10 // Obtén la cantidad por página o usa 10 como valor predeterminado

    const skip = (page - 1) * perPage // Calcula el número de documentos para omitir
    const accessories = await Accessory.find()
      .skip(skip) // Omite los documentos anteriores en función de la página
      .limit(perPage) // Limita la cantidad de documentos por página

    const totalAccessories = await Accessory.countDocuments() // Cuenta el número total de documentos en la colección

    res.send({
      data: accessories,
      total: totalAccessories
    })
  } catch (error) {
    console.error('Error al obtener accesorios:', error)
    res.status(500).send('Error al obtener accesorios')
  }
})

router.get('/accessory/:id', async (req, res) => {
  try {
    const id = req.params.id
    const accessory = await Accessory.findById(id)
    if (!accessory) {
      res.status(404).send('Accesorio no encontrado')
      return
    }
    res.send(accessory)
  } catch (error) {
    console.error('Error al obtener el accesorio:', error)
    res.status(500).send('Error al obtener el accesorio')
  }
})

// Ruta para editar un accesorio
router.patch('/accessory/:id', async (req, res) => {
  try {
    const id = req.params.id
    const updatedAccessory = await Accessory.findByIdAndUpdate(id, req.body, { new: true }) // El tercer argumento { new: true } devolverá el documento actualizado
    if (!updatedAccessory) {
      res.status(404).send('Accesorio no encontrado')
      return
    }
    res.send(updatedAccessory)
  } catch (error) {
    console.error('Error al editar el accesorio:', error)
    res.status(500).send('Error al editar el accesorio')
  }
})

// Ruta para eliminar un accesorio
router.delete('/accessory/:id', async (req, res) => {
  try {
    const id = req.params.id
    const deletedAccessory = await Accessory.findByIdAndDelete(id)
    if (!deletedAccessory) {
      res.status(404).send('Accesorio no encontrado')
      return
    }
    res.send(deletedAccessory)
  } catch (error) {
    console.error('Error al eliminar el accesorio:', error)
    res.status(500).send('Error al eliminar el accesorio')
  }
})

router.put('/update-stock/:id', async (req, res) => {
  try {
    const id = req.params.id
    const { quantity } = req.body

    // Actualizar el stock en la base de datos
    const accessory = await Accessory.findById(id)
    if (!accessory) {
      res.status(404).send('Accesorio no encontrado')
      return
    }

    accessory.quantityInStock = quantity
    await accessory.save()

    res.status(200).send('Stock actualizado con éxito')
  } catch (error) {
    console.error('Error al actualizar el stock del accesorio:', error)
    res.status(500).send('Error al actualizar el stock del accesorio')
  }
})

module.exports = router
