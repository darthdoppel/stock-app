import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { toast } from 'sonner'
import { type Equipment } from '../types'
import { updateEquipment } from '../../services/equipmentService'

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
    let repairCost: number | undefined = equipment?.repairCost
    let materialCost: number | undefined = equipment?.materialCost

    if (changes.repairCost?.modified) {
      repairCost = parseFloat(changes.repairCost.value ?? '0')
      updates.repairCost = repairCost
    }

    if (changes.materialCost?.modified) {
      materialCost = parseFloat(changes.materialCost.value ?? '0')
      updates.materialCost = materialCost
    }

    // Calculamos la ganancia estimada si ambos valores están definidos
    if (typeof repairCost === 'number' && typeof materialCost === 'number') {
      updates.estimatedProfit = repairCost - materialCost
    }

    return updates
  }

  const calculateEstimatedProfit = () => {
    const repair = Number(changes.repairCost?.value ?? equipment.repairCost ?? 0)
    const material = Number(changes.materialCost?.value ?? equipment.materialCost ?? 0)
    return repair - material
  }

  const handleSubmit = async () => {
    try {
      if (equipment._id != null) {
        const updatedEquipment = await updateEquipment(equipment._id, getUpdatedValues())
        toast.success('Costos actualizados exitosamente')
        onEditSuccess(updatedEquipment)
        onOpenChange()
      } else {
        setError('El ID del equipo no está definido.')
      }
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
          <Input
            name="repairCost"
            label="Costo de Reparación"
            placeholder="Costo de reparación"
            type="number"
            onChange={handleChange}
            value={
              changes.repairCost?.modified
                ? changes.repairCost.value
                : equipment.repairCost?.toString() ?? ''
            }
          />
            <Input
              name="materialCost"
              label="Costo de Materiales"
              placeholder="Costo de materiales"
              type="number"
              onChange={handleChange}
              value={
                changes.materialCost?.modified
                  ? changes.materialCost.value
                  : equipment.materialCost?.toString() ?? ''
              }
            />
            <p className="mt-4"><strong>Ganancia Estimada:</strong> ${calculateEstimatedProfit().toFixed(2)}</p>

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
