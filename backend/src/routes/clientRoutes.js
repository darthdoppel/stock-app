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
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).send('DNI ya registrado')
    }
    res.status(500).send('Error al guardar el cliente')
  }
})

router.get('/clients', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1 // Obtén el número de página de la consulta o usa 1 como valor predeterminado
    const perPage = parseInt(req.query.perPage) || 10 // Obtén la cantidad por página o usa 10 como valor predeterminado

    const skip = (page - 1) * perPage // Calcula el número de documentos para omitir
    const clients = await Client.find()
      .skip(skip) // Omite los documentos anteriores en función de la página
      .limit(perPage) // Limita la cantidad de documentos por página

    const totalClients = await Client.countDocuments() // Cuenta el número total de documentos en la colección

    res.send({
      data: clients,
      total: totalClients
    })
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
