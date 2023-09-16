import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, useDisclosure, Input, Tooltip } from '@nextui-org/react'
import { toast } from 'sonner'
import PlusCircle from './PlusCircle'
import { type Equipment } from './types' // Asegúrate de importar el tipo Equipment desde tu archivo types.ts

export default function AddWorkOrderModal () {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [workOrder, setWorkOrder] = useState({})
  const [error, setError] = useState('')
  const [equipments, setEquipments] = useState<Array<{ type: string, brand: string, model: string, problemDescription: string }>>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setWorkOrder(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (): Promise<void> => {
    try {
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
    setEquipments(prevEquipments => [...prevEquipments, { type: '', brand: '', model: '', problemDescription: '' }])
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

  return (
    <>
      <div className="flex justify-end p-4">
        <Tooltip content="Agregar nueva orden de trabajo" color="success">
          <Button onPress={onOpen} color="success" endContent={<PlusCircle />}></Button>
        </Tooltip>
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-1">Agregar Orden de Trabajo</ModalHeader>
        <ModalBody>
          <div className="overflow-y-auto max-h-[500px]">
            {error !== '' && <p className="text-red-600">{error}</p>}
            <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>

              <Input isRequired name="client" label="Cliente" placeholder="Introduce el ID del cliente" onChange={handleChange} />
              <Divider className="my-4" />
              {equipments.map((equipment, index) => (
                <div key={index}>
                  <Input
                    value={equipment.type}
                    onChange={(e) => { handleEquipmentChange(index, 'type', e.target.value) }}
                    placeholder="Tipo de equipo"
                  />
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
                  />
                  <Button color="danger" onClick={() => { handleRemoveEquipment(index) }}>
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

    </>
  )
}
