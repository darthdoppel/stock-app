import { type Accessory } from '../components/types'

const BASE_URL = 'https://stock-app-api-rmyf.onrender.com'

export interface Sale {
  _id: string
  date: Date
  accessoriesSold: Array<{
    accessory: Accessory
    quantity: number
  }>
  total: number
}

export async function fetchSales (
  page: number,
  perPage: number
): Promise<{ data: Sale[], total: number }> {
  try {
    const response = await fetch(
      `${BASE_URL}/sales?page=${page}&perPage=${perPage}`
    )
    const responseData = await response.json()
    return responseData // Devuelve la estructura { data, total }
  } catch (error) {
    console.error('Error al obtener las ventas:', error)
    throw error
  }
}

export async function deleteSale (id: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/sale/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Hubo un error al eliminar la venta.')
    }
  } catch (error) {
    console.error('Error al eliminar la venta:', error)
    throw error
  }
}

export async function createSale (
  saleDetails: {
    date: Date
    accessoriesSold: Array<{
      _id: string
      quantity: number
    }>
    total: number
  }
): Promise<Sale> {
  try {
    const response = await fetch(`${BASE_URL}/sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(saleDetails)
    })

    if (!response.ok) {
      console.error('Error al crear la venta - Respuesta HTTP:', response.status)
      const errorResponse = await response.json()
      console.error('Detalles del error:', errorResponse)
      throw new Error('Error al crear la venta')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al crear la venta:', error)
    throw error
  }
}

export async function updateAccessoryStock (
  id: string,
  newQuantity: number
): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/accessory/update-stock/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity: newQuantity })
    })

    if (!response.ok) {
      console.error('Error al actualizar el stock del accesorio - Respuesta HTTP:', response.status)
      const errorResponse = await response.json()
      console.error('Detalles del error:', errorResponse)
      throw new Error('Error al actualizar el stock del accesorio')
    }
  } catch (error) {
    console.error('Error al actualizar el stock del accesorio:', error)
    throw error
  }
}

export async function fetchTotalSalesAndAccessories (from: string, to: string): Promise<{ totalSales: number }> {
  try {
    const response = await fetch(`${BASE_URL}/sales/totals?from=${from}&to=${to}`)
    if (!response.ok) {
      throw new Error('Error al obtener el total de ventas.')
    }
    return await response.json()
  } catch (error) {
    console.error('Error al obtener el total de ventas:', error)
    throw error
  }
}
