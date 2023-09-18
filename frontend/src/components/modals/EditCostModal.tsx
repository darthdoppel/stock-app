import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { toast } from 'sonner'

interface Equipment {
  _id: string
  repairCost: number
  estimatedProfit: number
  materialCost: number
}

interface EditCostModalProps {
  isOpen: boolean
  onOpenChange: () => void
  equipment: Equipment
  onEditSuccess: (updatedEquipment: Equipment) => void
}

const EditCostModal: React.FC<EditCostModalProps> = ({ isOpen, onOpenChange, equipment, onEditSuccess }) => {
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
    let repairCost = equipment.repairCost
    let materialCost = equipment.materialCost

    if (changes.repairCost?.modified) {
      repairCost = parseFloat(changes.repairCost.value || '0')
      updates.repairCost = repairCost
    }

    if (changes.materialCost?.modified) {
      materialCost = parseFloat(changes.materialCost.value || '0')
      updates.materialCost = materialCost
    }

    // Calculamos la ganancia estimada
    updates.estimatedProfit = repairCost - materialCost
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
      toast.success('Costos actualizados exitosamente')
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
        <ModalHeader>Editar Costos</ModalHeader>
        <ModalBody>
          {(error.length > 0) && <p className="text-red-600">{error}</p>}
          <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>
            <Input name="repairCost" label="Costo de Reparación" placeholder="Costo de reparación" type="number" onChange={handleChange} value={changes.repairCost?.modified ? changes.repairCost.value : equipment.repairCost?.toString()} />
            <Input name="materialCost" label="Costo de Materiales" placeholder="Costo de materiales" type="number" onChange={handleChange} value={changes.materialCost?.modified ? changes.materialCost.value : equipment.materialCost?.toString()} />
            <p className="mt-4"><strong>Ganancia Estimada:</strong> ${(equipment.repairCost - equipment.materialCost).toFixed(2)}</p>

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

export default EditCostModal
