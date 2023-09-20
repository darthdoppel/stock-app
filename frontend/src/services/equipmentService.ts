// equipmentService.ts

import { type Equipment } from '../components/types'

const BASE_URL = 'https://stock-app-api-rmyf.onrender.com'

export async function updateEquipment (equipmentId: string, updatedValues: Partial<Equipment>): Promise<Equipment> {
  try {
    const response = await fetch(`${BASE_URL}/equipment/${equipmentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedValues)
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      console.error('Error al actualizar el equipo:', errorResponse)
      throw new Error('Hubo un error al enviar los datos')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al actualizar el equipo:', error)
    throw error
  }
}
