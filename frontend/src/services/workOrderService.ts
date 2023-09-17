const BASE_URL = 'http://localhost:3000'

export async function fetchWorkOrders (): Promise<any[]> {
  try {
    const response = await fetch(`${BASE_URL}/work-orders`)
    const responseData = await response.json()
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
