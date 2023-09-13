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

module.exports = router
