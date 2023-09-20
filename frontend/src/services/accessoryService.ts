// accessoryService.ts

import { type Accessory } from '../components/types'

const BASE_URL = 'https://stock-app-api-rmyf.onrender.com'

export async function fetchAccessories (
  page: number,
  perPage: number,
  search: string
): Promise<{ data: Accessory[], total: number }> {
  try {
    const response = await fetch(
      `${BASE_URL}/accessories?page=${page}&perPage=${perPage}&search=${search}`
    )
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error al obtener los accesorios:', error)
    throw error
  }
}

export async function deleteAccessory (id: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/accessory/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Hubo un error al eliminar el accesorio.')
    }
  } catch (error) {
    console.error('Error al eliminar el accesorio:', error)
    throw error
  }
}

export async function updateAccessoryStock (id: string, newQuantity: number): Promise<void> {
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
