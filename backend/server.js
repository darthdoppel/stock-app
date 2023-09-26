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
// const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
const corsOptions = {
  origin: ['https://stock-app-client.onrender.com', 'http://localhost:5173'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(accessoryRoutes)
app.use(saleRoutes)
app.use(clientRoutes)
app.use(equipmentRoutes)
app.use(workOrderRoutes)
app.use('/dashboard', dashboardRoutes)

// Agrega una regla para manejar las rutas de la aplicación React
/* app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'frontend', 'index.html')
  console.log(`Intentando enviar el archivo: ${filePath}`)
  res.sendFile(filePath)
})
*/

app.use(errorHandler)

app.listen(PORT, () => {
  connectToDatabase()
})
