const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config({ path: './.env.local' })
const Accessory = require('./src/models/Accessory')

const app = express()
const PORT = 3000
const MONGODB_URI = process.env.MONGODB_URI

// Conexión a MongoDB usando Mongoose
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'stock-app'
})
  .then(() => {
    console.log('Conectado a MongoDB')
  })
  .catch(err => {
    console.error('Error conectando a MongoDB', err)
  })

// Middleware para parsear JSON
app.use(express.json())
// Middleware para permitir CORS
app.use(cors())

app.post('/accessory', async (req, res) => {
  try {
    const newAccessory = new Accessory(req.body)
    const savedAccessory = await newAccessory.save()
    res.status(201).send(savedAccessory)
  } catch (error) {
    console.error('Error al guardar el accesorio:', error)
    res.status(500).send('Error al guardar el accesorio')
  }
})

app.get('/accessories', async (req, res) => {
  try {
    const accessories = await Accessory.find()
    res.send(accessories)
  } catch (error) {
    console.error('Error al obtener accesorios:', error)
    res.status(500).send('Error al obtener accesorios')
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
