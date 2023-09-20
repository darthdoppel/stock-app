import React, { useState } from 'react'
import { Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, useDisclosure, Input, Tooltip } from '@nextui-org/react'
import { toast } from 'sonner'
import PlusCircle from '../../icons/PlusCircle'
import AddClientModal from './AddClientModal'
import { type Equipment, type Client } from '../types' // Asegúrate de importar el tipo Equipment desde tu archivo types.ts
import { fetchClientByDNI } from '../../services/clientService'
import { addEquipment, addWorkOrder } from '../../services/workOrderService'

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
      const equipmentIds = []

      for (const equipment of equipments) {
        const equipmentId = await addEquipment(equipment)
        equipmentIds.push(equipmentId)
      }

      const data = await addWorkOrder({ ...workOrder, equipments: equipmentIds })

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
      const clientData = await fetchClientByDNI(workOrder.dni)
      setSearchedClient(clientData)
    } catch (err: any) {
      if (err instanceof Error && err.message !== '') {
        toast.error(err.message !== '' ? err.message : 'Error al buscar el cliente.')
      } else {
        toast.error('Error al buscar el cliente.')
      }

      // Verifica si el mensaje de error indica que el cliente no se encontró y muestra un mensaje para agregar uno nuevo.
      if (err instanceof Error && err.message.includes('Cliente no encontrado')) {
        toast.message('No se encontró el cliente con ese DNI. Puede agregar uno nuevo.')
        setClientModalOpen(true) // Abre el modal de agregar cliente
      } else {
        setSearchedClient(null)
      }
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
