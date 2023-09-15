const express = require('express')
const cors = require('cors')
require('dotenv').config({ path: './.env.local' })
const accessoryRoutes = require('./src/routes/accessoryRoutes')
const saleRoutes = require('./src/routes/saleRoutes')
const errorHandler = require('./src/middleware/errorHandler')
const connectToDatabase = require('./src/utils/dbConnection')

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())

app.use(accessoryRoutes)
app.use(saleRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
  connectToDatabase()
})
