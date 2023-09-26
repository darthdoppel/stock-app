import { type Client } from '../components/types'

const BASE_URL = 'https://stock-app-api-rmyf.onrender.com'

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

export async function fetchClientById (id: string): Promise<Client> {
  try {
    const response = await fetch(`${BASE_URL}/client/${id}`)
    if (!response.ok) {
      throw new Error('Error fetching client by id')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching client by id:', error)
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

export async function fetchClientByDNI (dni: string): Promise<Client | null> {
  try {
    const response = await fetch(`${BASE_URL}/client/dni/${dni}`)
    if (!response.ok) {
      const errorResponse = await response.json()
      console.error('Detalles del error:', errorResponse)
      if (response.status === 404) {
        // Cliente no encontrado, devolver null
        return null
      }
      throw new Error(`Error al obtener el cliente con DNI ${dni}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error al obtener el cliente por DNI:', error)
    throw error
  }
}

export async function fetchTotalClientsCount (from?: Date, to?: Date): Promise<number> {
  const startDate = (from != null) ? from.toISOString() : new Date().toISOString() // Si 'from' no está definido, usamos la fecha actual
  const endDate = (to != null) ? to.toISOString() : new Date().toISOString() // Si 'to' no está definido, usamos la fecha actual

  try {
    const response = await fetch(`${BASE_URL}/clients/total?from=${startDate}&to=${endDate}`)
    if (!response.ok) {
      throw new Error('Error al obtener el total de clientes.')
    }
    const { total } = await response.json()
    return total
  } catch (error) {
    console.error('Error al obtener el total de clientes:', error)
    throw error
  }
}

export async function updateClientById (id: string, updatedData: Partial<Client>): Promise<Client> {
  try {
    const response = await fetch(`${BASE_URL}/client/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
    if (!response.ok) {
      throw new Error('Error updating client')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating client:', error)
    throw error
  }
}
