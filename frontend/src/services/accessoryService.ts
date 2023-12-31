// accessoryService.ts

import { type Accessory, type AccessoryData } from '../components/types'

const BASE_URL = 'https://stock-app-api-rmyf.onrender.com'

export async function addAccessory (accessoryData: AccessoryData): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/accessory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(accessoryData)
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      const errorMessage = (errorResponse?.message !== undefined && errorResponse?.message !== null)
        ? errorResponse.message
        : 'Hubo un error al enviar los datos'

      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error('Error al agregar el accesorio:', error)
    throw error
  }
}

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

export async function fetchAccessoryById (id: string): Promise<Accessory> {
  try {
    const response = await fetch(`${BASE_URL}/accessory/${id}`)
    if (!response.ok) {
      const errorResponse = await response.json()
      const errorMessage = (errorResponse?.message !== undefined && errorResponse?.message !== null)
        ? errorResponse.message
        : 'Error fetching accessory by id'

      throw new Error(errorMessage)
    }
    const accessory = await response.json()
    return accessory
  } catch (error) {
    console.error('Error fetching accessory by id:', error)
    throw error
  }
}

export async function updateAccessory (id: string, accessoryData: Partial<Accessory>): Promise<Accessory> {
  try {
    const response = await fetch(`${BASE_URL}/accessory/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(accessoryData)
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      const errorMessage = (errorResponse?.message !== undefined && errorResponse?.message !== null)
        ? errorResponse.message
        : 'Error updating accessory'

      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating accessory:', error)
    throw error
  }
}
