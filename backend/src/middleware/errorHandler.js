module.exports = (error, req, res, next) => {
  console.error('Error:', error.message)
  res.status(500).send('Error interno del servidor')
}
