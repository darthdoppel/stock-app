const express = require('express')
const router = express.Router()
const Client = require('../models/Client')

router.post('/client', async (req, res) => {
  try {
    const newClient = new Client(req.body)
    const savedClient = await newClient.save()
    res.status(201).send(savedClient)
  } catch (error) {
    console.error('Error al guardar el cliente:', error)
    res.status(500).send('Error al guardar el cliente')
  }
})

router.get('/clients', async (req, res) => {
  try {
    const clients = await Client.find()
    res.send(clients)
  } catch (error) {
    console.error('Error al obtener clientes:', error)
    res.status(500).send('Error al obtener clientes')
  }
})

router.get('/client/:id', async (req, res) => {
  try {
    const id = req.params.id
    const client = await Client.findById(id)
    if (!client) {
      res.status(404).send('Cliente no encontrado')
      return
    }
    res.send(client)
  } catch (error) {
    console.error('Error al obtener el cliente:', error)
    res.status(500).send('Error al obtener el cliente')
  }
})

router.patch('/client/:id', async (req, res) => {
  try {
    const id = req.params.id
    const updatedClient = await Client.findByIdAndUpdate(id, req.body, { new: true })
    if (!updatedClient) {
      res.status(404).send('Cliente no encontrado')
      return
    }
    res.send(updatedClient)
  } catch (error) {
    console.error('Error al editar el cliente:', error)
    res.status(500).send('Error al editar el cliente')
  }
})

router.delete('/client/:id', async (req, res) => {
  try {
    const id = req.params.id
    const deletedClient = await Client.findByIdAndDelete(id)
    if (!deletedClient) {
      res.status(404).send('Cliente no encontrado')
      return
    }
    res.send(deletedClient)
  } catch (error) {
    console.error('Error al eliminar el cliente:', error)
    res.status(500).send('Error al eliminar el cliente')
  }
})

module.exports = router
