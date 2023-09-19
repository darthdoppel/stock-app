const dashboardService = require('../services/dashboardService')

exports.getDashboardData = async (req, res) => {
  try {
    const fromDate = new Date(req.query.from)
    const toDate = new Date(req.query.to)

    const dailyProfits = await dashboardService.getDailyProfits(fromDate, toDate)
    const dailySales = await dashboardService.getDailySales(fromDate, toDate)
    const dailyClients = await dashboardService.getDailyClients(fromDate, toDate)
    const workOrdersByStatus = await dashboardService.getWorkOrdersByStatus(fromDate, toDate)

    // Aquí puedes combinar los datos si es necesario y enviarlos en la respuesta.
    res.json({
      dailyProfits,
      dailySales,
      dailyClients,
      workOrdersByStatus
    })
  } catch (error) {
    console.error('Error al obtener los datos del dashboard:', error)
    res.status(500).send('Error al obtener los datos del dashboard')
  }
}
