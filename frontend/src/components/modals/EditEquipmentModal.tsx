import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from '@nextui-org/react'
import { toast } from 'sonner'
import { type Equipment } from '../types'

interface EditEquipmentModalProps {
  isOpen: boolean
  onOpenChange: () => void
  equipment: Equipment
  onEditSuccess: (updatedEquipment: Equipment) => void
}

const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({ isOpen, onOpenChange, equipment, onEditSuccess }) => {
  const [selectedType, setSelectedType] = useState('')
  const [changes, setChanges] = useState<Partial<Equipment>>({})
  const [error, setError] = useState('')

  const equipmentTypeOptions = ['Notebook', 'Celular', 'Tablet', 'Otros']

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(`http://localhost:3000/equipment/${equipment._id}`)
        const data = await response.json()

        console.log('Data obtenida:', data) // Añade este log

        setChanges(data)
        setSelectedType(data.type) // Actualizar el tipo seleccionado aquí
      } catch (error) {
        console.error('Error al cargar el equipo:', error)
      }
    }

    if (isOpen) {
      void fetchEquipment()
    }
  }, [isOpen, equipment._id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setChanges((prevChanges) => ({
      ...prevChanges,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/equipment/${equipment._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...changes, type: selectedType }) // Incluir el tipo seleccionado
      })

      if (!response.ok) {
        throw new Error('Hubo un error al enviar los datos')
      }

      const updatedEquipment = await response.json()
      toast.success('Equipo actualizado exitosamente')
      onEditSuccess(updatedEquipment)
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
        <ModalHeader>Editar Equipo</ModalHeader>
        <ModalBody>
          {error.length > 0 && <p className="text-red-600">{error}</p>}
          <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>

          <Select
              name="type"
              label="Tipo"
              placeholder="Seleccione el tipo de equipo"
              selectedKeys={new Set([selectedType])}
              onSelectionChange={(newSelection) => {
                const selectedValue = [...newSelection][0]
                if (typeof selectedValue === 'string') {
                  setSelectedType(selectedValue)
                }
              }}
>

              {equipmentTypeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </Select>

            <Input
              name="brand"
              label="Marca"
              placeholder="Marca del equipo"
              onChange={handleChange}
              value={changes.brand !== null && changes.brand !== '' ? changes.brand : equipment.brand}
              />
            <Input
              name="model"
              label="Modelo"
              placeholder="Modelo del equipo"
              onChange={handleChange}
              value={changes.model !== null && changes.model !== '' ? changes.model : equipment.model}
            />
            <Input
              name="problemDescription"
              label="Descripción del Problema"
              placeholder="Descripción del problema"
              onChange={handleChange}
              value={changes.problemDescription !== null && changes.problemDescription !== '' ? changes.problemDescription : equipment.problemDescription}
            />

            <ModalFooter>
              <Button color="danger" variant="flat" onClick={onOpenChange}>
                Cerrar
              </Button>
              <Button type="submit" color="primary">
                Guardar
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditEquipmentModal
