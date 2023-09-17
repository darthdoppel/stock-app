import { type Client } from '../components/types'

const BASE_URL = 'http://localhost:3000'

export async function fetchClients (
  page: number,
  perPage: number
): Promise<{ data: Client[], total: number }> {
  try {
    const response = await fetch(
      `${BASE_URL}/clients?page=${page}&perPage=${perPage}`
    )
    const responseData: { data: Client[], total: number } = await response.json()
    return responseData
  } catch (error) {
    console.error('Error al obtener los clientes:', error)
    throw error
  }
}

export async function deleteClient (id: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/client/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Hubo un error al eliminar el cliente.')
    }
  } catch (error) {
    console.error('Error al eliminar el cliente:', error)
    throw error
  }
}

export async function addClient (clientData: Omit<Client, '_id'>): Promise<Client> {
  try {
    const response = await fetch(`${BASE_URL}/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clientData)
    })

    if (!response.ok) {
      console.error('Error al agregar el cliente - Respuesta HTTP:', response.status)
      const errorResponse = await response.json()
      console.error('Detalles del error:', errorResponse)
      throw new Error('Error al agregar el cliente')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al agregar el cliente:', error)
    throw error
  }
}

export async function updateClient (id: string, updatedData: Partial<Client>): Promise<Client> {
  try {
    const response = await fetch(`${BASE_URL}/client/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })

    if (!response.ok) {
      console.error('Error al actualizar el cliente - Respuesta HTTP:', response.status)
      const errorResponse = await response.json()
      console.error('Detalles del error:', errorResponse)
      throw new Error('Error al actualizar el cliente')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al actualizar el cliente:', error)
    throw error
  }
}
