import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { type WorkOrder, type Equipment } from '../types'
import EditEquipmentModal from './EditEquipmentModal'
import { EditIcon } from '../../icons/EditIcon'

interface WorkOrderDetailsModalProps {
  isOpen: boolean
  onOpenChange: () => void
  workOrder: WorkOrder
  onEquipmentEdit: (editedEquipment: Equipment) => void // Add this
}

const WorkOrderDetailsModal: React.FC<WorkOrderDetailsModalProps> = ({ isOpen, onOpenChange, workOrder }) => {
  const [isEditEquipmentModalOpen, setIsEditEquipmentModalOpen] = useState(false)
  const [currentEquipment, setCurrentEquipment] = useState<null | Equipment>(null)

  const openEditEquipmentModal = (equipment: React.SetStateAction<Equipment | null>) => {
    setCurrentEquipment(equipment)
    setIsEditEquipmentModalOpen(true)
  }

  return (
    <>
      <Modal size='2xl' isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Detalles de la Orden de Trabajo</ModalHeader>
        <ModalBody>
          {/* Aquí puedes mostrar más detalles de la orden de trabajo si lo necesitas */}
          <Table>
          <TableHeader>
              <TableColumn>Tipo de Equipo</TableColumn>
              <TableColumn>Marca</TableColumn>
              <TableColumn>Modelo</TableColumn>
              <TableColumn>Descripción del Problema</TableColumn>
              <TableColumn>Acciones</TableColumn>
          </TableHeader>

            <TableBody>
            {workOrder.equipments.map(equipment => (
          <TableRow key={equipment._id}>
            <TableCell>{equipment.type}</TableCell>
            <TableCell>{equipment.brand}</TableCell>
            <TableCell>{equipment.model}</TableCell>
            <TableCell>{equipment.problemDescription}</TableCell>
            <TableCell>
              <Button onClick={() => { openEditEquipmentModal(equipment) }}>
                <EditIcon />
              </Button>
            </TableCell>
          </TableRow>
            ))}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="flat" onClick={onOpenChange}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

          {currentEquipment && (
              <EditEquipmentModal
              isOpen={isEditEquipmentModalOpen}
              onOpenChange={() => { setIsEditEquipmentModalOpen(!isEditEquipmentModalOpen) }}
              equipment={currentEquipment}
              onEditSuccess={(editedEquipment) => {
                console.log('Equipo editado con éxito')
                const updatedEquipments = workOrder.equipments.map(equipment =>
                  equipment._id === editedEquipment._id ? editedEquipment : equipment
                )
                // Actualiza la orden de trabajo localmente con los equipos actualizados.
                workOrder.equipments = updatedEquipments
                setCurrentEquipment(null) // Opcional: para resetear el equipo seleccionado.
              }}
            />

          )}

        </>

  )
}

export default WorkOrderDetailsModal
