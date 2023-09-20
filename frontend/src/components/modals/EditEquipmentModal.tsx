import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from '@nextui-org/react'
import { toast } from 'sonner'
import { type Equipment } from '../types'
import { updateEquipment, getEquipment } from '../../services/equipmentService'

interface EditEquipmentModalProps {
  isOpen: boolean
  onOpenChange: () => void
  equipment: Equipment
  onEditSuccess: (updatedEquipment: Equipment) => void
}

const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({ isOpen, onOpenChange, equipment, onEditSuccess }) => {
  const [selectedType, setSelectedType] = useState<'Notebook' | 'Celular' | 'Tablet' | 'Otros' | undefined>(undefined)
  const [changes, setChanges] = useState<Partial<Equipment>>({})
  const [error, setError] = useState('')

  const equipmentTypeOptions = ['Notebook', 'Celular', 'Tablet', 'Otros']

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await getEquipment(equipment._id)
        setChanges(data)
        setSelectedType(data.type)
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
    if (equipment._id === null) {
      setError('ID del equipo no definido.')
      return
    }

    if (typeof selectedType === 'undefined') {
      setError('Tipo de equipo no seleccionado.')
      return
    }

    try {
      const updatedEquipment = await updateEquipment(equipment._id, { ...changes, type: selectedType })
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
          selectedKeys={selectedType !== undefined ? new Set([selectedType]) : undefined}
          onSelectionChange={(newSelection) => {
            const selectedValue = String([...newSelection][0])
            if (equipmentTypeOptions.includes(selectedValue)) {
              setSelectedType(selectedValue as 'Notebook' | 'Celular' | 'Tablet' | 'Otros')
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
