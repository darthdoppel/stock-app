// AddEquipmentModal.tsx

import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from '@nextui-org/react'
import { toast } from 'sonner'
import { type Equipment } from '../types'

interface AddEquipmentModalProps {
  isOpen: boolean
  onOpenChange: () => void
  onEquipmentAdded: (newEquipment: Equipment) => void
}

const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({ isOpen, onOpenChange, onEquipmentAdded }) => {
  const [equipment, setEquipment] = useState<Equipment>({
    type: 'Notebook',
    brand: '',
    model: '',
    problemDescription: ''
    // Agregar otros campos si es necesario
  })

  const handleChange = (field: keyof Equipment, value: string) => {
    setEquipment(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(equipment)
      })

      if (!response.ok) {
        throw new Error('Hubo un error al añadir el equipo')
      }

      const newEquipment = await response.json()
      toast.success('Equipo añadido con éxito')
      onEquipmentAdded(newEquipment)
      onOpenChange()
    } catch (err) {
      toast.error('Error al añadir el equipo')
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Añadir Equipo</ModalHeader>
        <ModalBody>
          <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>
            <Select
              value={equipment.type}
              onChange={(e) => { handleChange('type', e.target.value) }}
              placeholder="Seleccione el tipo de equipo"
              className='mb-4'
            >
              {/* Añadir tus opciones aquí */}
              <SelectItem value="Notebook" key={'Notebook'}>Notebook</SelectItem>
              <SelectItem value="Celular" key={'Celular'}>Celular</SelectItem>
                <SelectItem value="Tablet" key={'Tablet'}>Tablet</SelectItem>
                <SelectItem value="Otros" key={'Otros'}>Otros</SelectItem>
            </Select>
            <Input
              isRequired
              value={equipment.brand}
              label="Marca"
              onChange={(e) => { handleChange('brand', e.target.value) }}
              placeholder="LG, Samsung, etc."
              className='mb-4'
            />
            <Input
              isRequired
              value={equipment.model}
              label="Modelo"
              onChange={(e) => { handleChange('model', e.target.value) }}
              placeholder="J7 Prime, S23+, etc."
              className='mb-4'
            />
            <Input
              isRequired
              label="Descripción del problema"
              value={equipment.problemDescription}
              onChange={(e) => { handleChange('problemDescription', e.target.value) }}
              placeholder="El equipo no enciende, etc."
              className='mb-4'
            />
            {/* Añade más campos si es necesario */}
            <ModalFooter>
              <Button onClick={onOpenChange}>Cerrar</Button>
              <Button type="submit" color="primary">Añadir</Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AddEquipmentModal
