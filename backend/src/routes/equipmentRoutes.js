const express = require('express')
const router = express.Router()
const Equipment = require('../models/Equipment')

router.post('/equipment', async (req, res) => {
  try {
    const newEquipment = new Equipment(req.body)
    const savedEquipment = await newEquipment.save()
    res.status(201).send(savedEquipment)
  } catch (error) {
    console.error('Error al guardar el equipo:', error)
    res.status(500).send('Error al guardar el equipo')
  }
})

router.get('/equipments', async (req, res) => {
  try {
    const equipments = await Equipment.find().populate('clientId')
    res.send(equipments)
  } catch (error) {
    console.error('Error al obtener equipos:', error)
    res.status(500).send('Error al obtener equipos')
  }
})

router.get('/equipment/:id', async (req, res) => {
  try {
    const id = req.params.id
    const equipment = await Equipment.findById(id).populate('clientId')
    if (!equipment) {
      res.status(404).send('Equipo no encontrado')
      return
    }
    res.send(equipment)
  } catch (error) {
    console.error('Error al obtener el equipo:', error)
    res.status(500).send('Error al obtener el equipo')
  }
})

router.patch('/equipment/:id', async (req, res) => {
  try {
    const id = req.params.id
    const updatedEquipment = await Equipment.findByIdAndUpdate(id, req.body, { new: true })
    if (!updatedEquipment) {
      res.status(404).send('Equipo no encontrado')
      return
    }
    res.send(updatedEquipment)
  } catch (error) {
    console.error('Error al editar el equipo:', error)
    res.status(500).send('Error al editar el equipo')
  }
})

router.delete('/equipment/:id', async (req, res) => {
  try {
    const id = req.params.id
    const deletedEquipment = await Equipment.findByIdAndDelete(id)
    if (!deletedEquipment) {
      res.status(404).send('Equipo no encontrado')
      return
    }
    res.send(deletedEquipment)
  } catch (error) {
    console.error('Error al eliminar el equipo:', error)
    res.status(500).send('Error al eliminar el equipo')
  }
})

module.exports = router
