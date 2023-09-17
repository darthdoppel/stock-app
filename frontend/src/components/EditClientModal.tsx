import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, Input } from '@nextui-org/react'
import { toast } from 'sonner'
import { type Client } from './types'

interface EditClientModalProps {
  isOpen: boolean
  onOpenChange: () => void
  clientId: string
  onEditSuccess: (client: Client) => void
}

export default function EditClientModal ({ isOpen, onOpenChange, clientId, onEditSuccess }: EditClientModalProps) {
  const [client, setClient] = useState<Partial<Client>>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    address: '',
    dni: '' // Agregar el campo dni
  })

  const [error, setError] = useState('')

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`http://localhost:3000/client/${clientId}`)
        const data = await response.json()
        setClient(data)
      } catch (error) {
        console.error('Error al cargar el cliente:', error)
      }
    }

    if (isOpen) {
      void fetchClient()
    }
  }, [isOpen, clientId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setClient((prev: Partial<Client>) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/client/${clientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(client)
      })

      if (!response.ok) {
        throw new Error('Hubo un error al enviar los datos')
      }

      const data = await response.json()
      toast.success('Cliente actualizado')
      onEditSuccess(data)
      onOpenChange()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Ocurrió un error desconocido.')
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Editar Cliente</ModalHeader>
            <ModalBody>
              {error !== '' && <p className="text-red-600">{error}</p>}
              <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>
                <Input name="firstName" label="Nombre" placeholder="Introduce el nombre del cliente" required onChange={handleChange} value={client.firstName} />
                <Divider className="my-4" />
                <Input name="lastName" label="Apellido" placeholder="Introduce el apellido del cliente" required onChange={handleChange} value={client.lastName} />
                <Divider className="my-4" />
                 {/* Aquí está el nuevo campo para el DNI */}
                <Input name="dni" label="DNI" placeholder="Introduce el DNI del cliente" required onChange={handleChange} value={client.dni} />
                <Divider className="my-4" />
                <Input name="phone" label="Teléfono" placeholder="Introduce el teléfono del cliente" required onChange={handleChange} value={client.phoneNumber} />
                <Divider className="my-4" />
                <Input type="email" name="email" label="Email" placeholder="Introduce el email del cliente" required onChange={handleChange} value={client.email} />
                <Divider className="my-4" />
                <Input name="address" label="Dirección" placeholder="Introduce la dirección del cliente" onChange={handleChange} value={client.address} />
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button type="submit" color="primary">
                    Guardar
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
