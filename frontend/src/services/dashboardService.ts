const BASE_URL = 'https://stock-app-api-rmyf.onrender.com'

export async function fetchDailyProfits (fromDate: Date, toDate: Date) {
  const startDate = fromDate.toISOString()
  const endDate = toDate.toISOString()

  try {
    const response = await fetch(`${BASE_URL}/dashboard/data?from=${startDate}&to=${endDate}`)

    if (!response.ok) {
      const errorResponse = await response.json()
      console.error('Detalles del error:', errorResponse)
      throw new Error('Error al obtener datos del dashboard')
    }

    const data = await response.json()
    const transformedData = transformDataForChart(data)

    return transformedData
  } catch (error) {
    console.error('Error al obtener los datos del dashboard:', error)
    throw error
  }
}

// Nueva función para obtener los datos de estado de las órdenes de trabajo
export async function fetchWorkOrdersByStatus (fromDate: Date, toDate: Date) {
  const startDate = fromDate.toISOString()
  const endDate = toDate.toISOString()

  try {
    const response = await fetch(`${BASE_URL}/dashboard/data?from=${startDate}&to=${endDate}`)

    if (!response.ok) {
      const errorResponse = await response.json()
      console.error('Detalles del error:', errorResponse)
      throw new Error('Error al obtener datos de estado de las órdenes de trabajo')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener los datos de estado de las órdenes de trabajo:', error)
    throw error
  }
}

function transformDataForChart (data: any) {
  if (data.dailyClients === undefined || data.dailyClients === null || !(Array.isArray(data.dailyClients))) {
    console.error('Error: dailyClients no está definido o no es un array.')
    return []
  }

  const { dailyProfits, dailySales, dailyClients } = data
  const allDatesSet = new Set<string>();

  // Recolecta todas las fechas posibles
  [...dailyProfits, ...dailySales, ...dailyClients].forEach(item => {
    const dateStr = `${item._id.year}-${item._id.month}-${item._id.day}`
    allDatesSet.add(dateStr)
  })

  const combinedData: any[] = []

  // Por cada fecha recolectada, combina los datos
  Array.from(allDatesSet).forEach(dateStr => {
    const [year, month, day] = dateStr.split('-').map(Number)

    const profitForDate = dailyProfits.find((profit: any) =>
      profit._id.year === year && profit._id.month === month && profit._id.day === day
    )
    const saleForDate = dailySales.find((sale: any) =>
      sale._id.year === year && sale._id.month === month && sale._id.day === day
    )
    const clientForDate = dailyClients.find((client: any) =>
      client._id.year === year && client._id.month === month && client._id.day === day
    )

    combinedData.push({
      date: dateStr,
      Sales: ((Boolean(saleForDate)) && 'totalSales' in saleForDate) ? saleForDate.totalSales : 0,
      Profits: ((Boolean(profitForDate)) && 'totalProfit' in profitForDate) ? profitForDate.totalProfit : 0,
      Clients: ((Boolean(clientForDate)) && 'totalClients' in clientForDate) ? clientForDate.totalClients : 0

    })
  })

  // Ordena los datos por fecha
  return combinedData.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateA.getTime() - dateB.getTime()
  })
}
