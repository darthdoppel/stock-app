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
    const accessories = await Accessory.find()
    res.send(accessories)
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

module.exports = router
