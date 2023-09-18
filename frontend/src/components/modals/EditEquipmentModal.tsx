import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { toast } from 'sonner'

interface Equipment {
  _id: string
  type: string
  brand: string
  model: string
  problemDescription: string
  // ... puedes agregar más campos si tu modelo de Equipment los tiene
}

interface EditEquipmentModalProps {
  isOpen: boolean
  onOpenChange: () => void
  equipment: Equipment
  onEditSuccess: (updatedEquipment: Equipment) => void
}

const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({ isOpen, onOpenChange, equipment, onEditSuccess }) => {
  const [changes, setChanges] = useState<Record<string, { value: string | undefined, modified: boolean }>>({})
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setChanges((prev) => ({
      ...prev,
      [name]: {
        value,
        modified: true
      }
    }))
  }

  const getUpdatedValues = () => {
    const updates: Partial<Equipment> = {}
    for (const key in changes) {
      if (changes[key].modified) {
        updates[key] = changes[key].value
      }
    }
    return updates
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/equipment/${equipment._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(getUpdatedValues())
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
          {(error.length > 0) && <p className="text-red-600">{error}</p>}
          <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>
            <Input name="type" label="Tipo" placeholder="Tipo de equipo" onChange={handleChange} value={changes.type?.modified ? changes.type.value : equipment.type}
 />
            <Input name="brand" label="Marca" placeholder="Marca del equipo" onChange={handleChange} value={changes.brand?.modified ? changes.brand.value : equipment.brand} />
            <Input name="model" label="Modelo" placeholder="Modelo del equipo" onChange={handleChange} value={changes.model?.modified ? changes.model.value : equipment.model} />
            <Input name="problemDescription" label="Descripción del Problema" placeholder="Descripción del problema" onChange={handleChange} value={changes.problemDescription?.modified ? changes.problemDescription.value : equipment.problemDescription} />

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
