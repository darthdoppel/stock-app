import React, { useState } from 'react'
import { Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, useDisclosure, Input, Tooltip } from '@nextui-org/react'
import { toast } from 'sonner'
import PlusCircle from '../../icons/PlusCircle'
import AddClientModal from './AddClientModal'
import { type Equipment, type Client } from '../types' // Asegúrate de importar el tipo Equipment desde tu archivo types.ts

type WorkOrderForm = Pick<Client, 'dni'>

export default function AddWorkOrderModal () {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [workOrder, setWorkOrder] = useState<WorkOrderForm>({ dni: '' })
  const [error, setError] = useState('')
  const [isClientModalOpen, setClientModalOpen] = useState(false)
  const [searchedClient, setSearchedClient] = useState<Client | null>(null)
  const [equipments, setEquipments] = useState<Array<{ type: string, brand: string, model: string, problemDescription: string }>>([])

  // Opciones del enum "type"
  const equipmentTypeOptions = ['Notebook', 'Celular', 'Tablet', 'Otros']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setWorkOrder(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (): Promise<void> => {
    try {
      // Obtener el ID del cliente basado en el DNI
      const clientResponse = await fetch(`http://localhost:3000/client/dni/${workOrder.dni}`)

      if (!clientResponse.ok) {
        throw new Error('No se encontró el cliente con ese DNI.')
      }

      const clientData = await clientResponse.json()

      // Crear un array de identificadores de equipos
      const equipmentIds = []

      // Iterar sobre los equipos y guardar sus datos en la base de datos
      for (const equipment of equipments) {
        const response = await fetch('http://localhost:3000/equipment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(equipment)
        })

        if (!response.ok) {
          throw new Error('Hubo un error al guardar los equipos')
        }

        const data = await response.json()
        equipmentIds.push(data._id) // Agregar el ID del equipo guardado
      }

      // Creamos un objeto que incluya la información de la orden de trabajo y los equipos
      const requestData = {
        ...workOrder,
        client: clientData._id, // Usar el ID del cliente en la solicitud de la orden de trabajo
        equipments: equipmentIds
      }

      // Enviar la solicitud para crear la orden de trabajo
      const response = await fetch('http://localhost:3000/work-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error('Hubo un error al enviar los datos')
      }

      const data = await response.json()
      toast.success('Orden de trabajo agregada')
      console.log('Orden de trabajo agregada:', data)

      onOpenChange()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Ocurrió un error desconocido.')
      }
    }
  }

  const handleAddEquipment = () => {
    setEquipments((prevEquipments) => [
      ...prevEquipments,
      { type: 'notebook', brand: '', model: '', problemDescription: '' } // Valor predeterminado 'notebook'
    ])
  }

  const handleEquipmentTypeChange = (index: number, value: string) => {
    const updatedEquipments = [...equipments]
    updatedEquipments[index] = {
      ...updatedEquipments[index],
      type: value // Actualiza el tipo de equipo
    }
    setEquipments(updatedEquipments)
  }

  const handleEquipmentChange = (index: number, field: keyof Equipment, value: string) => {
    const updatedEquipments = [...equipments]
    updatedEquipments[index] = {
      ...updatedEquipments[index], // Mantén las propiedades existentes
      [field]: value // Actualiza la propiedad específica
    }
    setEquipments(updatedEquipments)
  }

  const handleRemoveEquipment = (index: number) => {
    const updatedEquipments = [...equipments]
    updatedEquipments.splice(index, 1)
    setEquipments(updatedEquipments)
  }

  const handleCloseClientModal = () => {
    setClientModalOpen(false)
  }

  const handleSearchClient = async () => {
    try {
      const clientResponse = await fetch(`http://localhost:3000/client/dni/${workOrder.dni}`)
      if (!clientResponse.ok) {
        throw new Error('No se encontró el cliente con ese DNI.')
      }
      const clientData = await clientResponse.json()
      setSearchedClient(clientData)
    } catch (err: any) { // <-- Cambio aquí
      if (err instanceof Error) {
        toast.error((err.message.length > 0) || 'Error al buscar el cliente.')
      } else {
        toast.error('Error al buscar el cliente.')
      }
      if (err.message === 'No se encontró el cliente con ese DNI.') {
        toast.error('No se encontró el cliente con ese DNI.') // Mostramos el mensaje de error
        setClientModalOpen(true) // Abre el modal de agregar cliente
      }
      setSearchedClient(null)
    }
  }

  const handleClientAdded = (newClient: Client) => {
    setSearchedClient(newClient)
    setWorkOrder(prev => ({ ...prev, dni: newClient.dni }))
    void handleSearchClient() // Realiza la búsqueda para mostrar el cliente
    handleCloseClientModal() // Cierra el modal AddClientModal
  }

  return (
    <>
      <div className="flex justify-end p-4">
        <Tooltip content="Agregar nueva orden de trabajo" color="success">
          <Button onPress={onOpen} color="success" endContent={<PlusCircle />}></Button>
        </Tooltip>
      </div>
      <Modal size="xl" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar Orden de Trabajo</ModalHeader>
              <ModalBody>
                <div className="overflow-y-auto max-h-[500px]">
                  {error !== '' && <p className="text-red-600">{error}</p>}
                  <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>
                    <Input variant="bordered" isRequired name="dni" label="DNI del Cliente" placeholder="Introduce el DNI del cliente" onChange={handleChange} />
                    <Button className="mt-4" onClick={() => { void handleSearchClient() }}>Buscar cliente</Button>
                    {searchedClient !== null && (
                      <div className="mt-4">
                        <p><strong>Nombre:</strong> {searchedClient.firstName} {searchedClient.lastName}</p>
                        <p><strong>Teléfono:</strong> {searchedClient.phoneNumber}</p>
                        <p><strong>Email:</strong> {searchedClient.email}</p>
                      </div>
                    )}
                    <Divider className="my-4" />

                {equipments.map((equipment, index) => (
                <div key={index}>
                <Select
                      value={equipment.type}
                      onChange={(e) => { handleEquipmentTypeChange(index, e.target.value) }}
                      label="Seleccione el tipo de equipo"
                      placeholder="Seleccione una opción"
                      >
                      {equipmentTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                      </Select>
                  <Input
                    value={equipment.brand}
                    onChange={(e) => { handleEquipmentChange(index, 'brand', e.target.value) }}
                    placeholder="Marca del equipo"
                  />
                  <Input
                    value={equipment.model}
                    onChange={(e) => { handleEquipmentChange(index, 'model', e.target.value) }}
                    placeholder="Modelo del equipo"
                  />
                  <Input
                    value={equipment.problemDescription}
                    onChange={(e) => { handleEquipmentChange(index, 'problemDescription', e.target.value) }}
                    placeholder="Descripción del problema"
                    className="mb-4"
                  />
                  <Button className="mb-4" color="danger" onClick={() => { handleRemoveEquipment(index) }}>
                    Eliminar
                  </Button>
                </div>
                ))}

                    <Button color="primary" onClick={handleAddEquipment}>
                      Añadir equipo
                    </Button>
                    <Divider className="my-4" />

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

      <AddClientModal
        isOpen={isClientModalOpen}
        onOpenChange={handleCloseClientModal}
        showButton={false}
        onClientAdded={handleClientAdded}
      />
    </>
  )
}
