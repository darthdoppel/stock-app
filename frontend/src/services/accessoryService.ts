// accessoryService.ts

import { type Accessory } from '../components/types'

const BASE_URL = 'http://localhost:3000' // Ajusta la URL base según tu API

export async function fetchAccessories (): Promise<Accessory[]> {
  try {
    const response = await fetch(`${BASE_URL}/accessories`)
    const data = await response.json()
    return data
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
