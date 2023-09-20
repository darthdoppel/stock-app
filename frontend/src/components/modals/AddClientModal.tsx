import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tooltip
} from '@nextui-org/react'

import { toast } from 'sonner'
import { type Client } from '../types'

import PlusCircle from '../../icons/PlusCircle'
import { addClient } from '../../services/clientService'

interface AddClientModalProps {
  isOpen: boolean
  onOpenChange: () => void
  showButton?: boolean
  onClientAdded?: (client: Client) => void
}

export default function AddClientModal ({ isOpen, onOpenChange, showButton = true, onClientAdded }: AddClientModalProps) {
  const [client, setClient] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phoneNumber: '',
    address: ''
  })

  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setClient(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (): Promise<void> => {
    try {
      const data = await addClient(client as Omit<Client, '_id'>)
      toast.success('Cliente agregado')
      console.log('Cliente agregado:', data)

      onClientAdded?.(data) // Llama al callback si está definido

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
    <>
      {showButton && ( // Controla la visualización del botón con base en la prop
        <div className="flex justify-end p-4">
          <Tooltip content="Agregar cliente nuevo" color="success">
          <Button onPress={onOpenChange} color="success" endContent={<PlusCircle />}></Button>
          </Tooltip>
        </div>
      )}
      <Modal scrollBehavior='outside' size='lg' backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar Cliente</ModalHeader>
              <ModalBody>
                <div className="overflow-y-auto max-h-[500px]">

                  {error !== '' && <p className="text-red-600">{error}</p>}
                  <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>

                    <Input className="mb-4" isRequired name="firstName" label="Nombre" placeholder="Introduce el nombre del cliente" onChange={handleChange} />

                    <Input className="mb-4" isRequired name="lastName" label="Apellido" placeholder="Introduce el apellido del cliente" onChange={handleChange} />

                    {/* Aquí está el nuevo campo para el DNI */}
                    <Input className="mb-4" isRequired name="dni" label="DNI" placeholder="Introduce el DNI del cliente" onChange={handleChange} />

                    <Input className="mb-4" isRequired type="email" name="email" label="Email" placeholder="Introduce el email del cliente" onChange={handleChange} />

                    <Input className="mb-4" isRequired type="tel" name="phoneNumber" label="Teléfono" placeholder="Introduce el teléfono del cliente" onChange={handleChange} />

                    <Input name="address" label="Dirección" placeholder="Introduce la dirección del cliente" onChange={handleChange} />
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Cerrar
                      </Button>
                      <Button type="submit" color="primary">
                        Guardar
                      </Button>
                    </ModalFooter>
                  </form>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
