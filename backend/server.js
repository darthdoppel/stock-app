const express = require('express')
const cors = require('cors')
require('dotenv').config({ path: './.env.local' })
const accessoryRoutes = require('./src/routes/accessoryRoutes')
const saleRoutes = require('./src/routes/saleRoutes')
const clientRoutes = require('./src/routes/clientRoutes')
const equipmentRoutes = require('./src/routes/equipmentRoutes')
const workOrderRoutes = require('./src/routes/workOrderRoutes')
const dashboardRoutes = require('./src/routes/dashboardRoutes')
const errorHandler = require('./src/middleware/errorHandler')
const connectToDatabase = require('./src/utils/dbConnection')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use(accessoryRoutes)
app.use(saleRoutes)
app.use(clientRoutes)
app.use(equipmentRoutes)
app.use(workOrderRoutes)
app.use('/dashboard', dashboardRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
  connectToDatabase()
})
