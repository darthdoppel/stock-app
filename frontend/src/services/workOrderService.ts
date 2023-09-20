import { fetchClientByDNI } from './clientService'

const BASE_URL = 'https://stock-app-api-rmyf.onrender.com'

export async function fetchWorkOrders (
  page: number,
  perPage: number
): Promise<{ data: any[], total: number }> {
  try {
    const response = await fetch(
      `${BASE_URL}/work-orders?page=${page}&perPage=${perPage}`
    )
    const responseData: { data: any[], total: number } = await response.json()
    return responseData
  } catch (error) {
    console.error('Error al obtener las órdenes de trabajo:', error)
    throw error
  }
}

export async function createWorkOrder (workOrderData: any): Promise<any> {
  try {
    // Asegúrate de que workOrderData no contenga el campo 'orderNumber'
    delete workOrderData.orderNumber

    const response = await fetch(`${BASE_URL}/work-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workOrderData)
    })

    if (!response.ok) {
      throw new Error('Error al crear la orden de trabajo.')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al crear la orden de trabajo:', error)
    throw error
  }
}

export async function editWorkOrder (id: string, workOrderData: any): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/work-order/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workOrderData)
    })

    if (!response.ok) {
      throw new Error('Error al editar la orden de trabajo.')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al editar la orden de trabajo:', error)
    throw error
  }
}

export async function deleteWorkOrder (id: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/work-order/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Error al eliminar la orden de trabajo.')
    }
  } catch (error) {
    console.error('Error al eliminar la orden de trabajo:', error)
    throw error
  }
}

export async function updateWorkOrderStatus (id: string, newStatus: string): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/work-order/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })

    if (!response.ok) {
      throw new Error('Error al actualizar el estado de la orden de trabajo.')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al actualizar el estado de la orden de trabajo:', error)
    throw error
  }
}

export async function fetchClientWorkOrders (clientId: string): Promise<any[]> {
  try {
    const response = await fetch(`${BASE_URL}/client/${clientId}/work-orders`)
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error al obtener las órdenes de trabajo del cliente:', error)
    throw error
  }
}

export async function addEquipment (equipmentData: { type: string, brand: string, model: string, problemDescription: string }): Promise<string> {
  const response = await fetch(`${BASE_URL}/equipment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(equipmentData)
  })

  if (!response.ok) {
    const errorResponse = await response.json()
    console.error('Detalles del error:', errorResponse)
    throw new Error('Hubo un error al guardar los equipos')
  }

  const data = await response.json()
  return data._id // Retornamos el ID del equipo guardado
}

export async function addWorkOrder (workOrderData: { dni: string, equipments: string[] }): Promise<any> {
  const requestData = {
    ...workOrderData,
    client: await fetchClientByDNI(workOrderData.dni) // Usar el ID del cliente en la solicitud de la orden de trabajo
  }

  const response = await fetch(`${BASE_URL}/work-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })

  if (!response.ok) {
    const errorResponse = await response.json()
    console.error('Detalles del error:', errorResponse)
    throw new Error('Hubo un error al enviar los datos')
  }

  return await response.json()
}
