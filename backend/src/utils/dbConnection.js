const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI

module.exports = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'stock-app'
    })
  } catch (error) {
    console.error('Error conectando a MongoDB', error)
  }
}
