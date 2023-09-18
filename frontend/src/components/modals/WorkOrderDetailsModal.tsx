import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { type WorkOrder } from '../types'

interface WorkOrderDetailsModalProps {
  isOpen: boolean
  onOpenChange: () => void
  workOrder: WorkOrder
}

const WorkOrderDetailsModal: React.FC<WorkOrderDetailsModalProps> = ({ isOpen, onOpenChange, workOrder }) => {
  return (
    <Modal size='2xl'isOpen={isOpen} onOpenChange={onOpenChange}>
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
            </TableHeader>

            <TableBody>
              {workOrder.equipments.map(equipment => (
                <TableRow key={equipment._id}>
                    <TableCell>{equipment.type}</TableCell>
                    <TableCell>{equipment.brand}</TableCell>
                    <TableCell>{equipment.model}</TableCell>
                    <TableCell>{equipment.problemDescription}</TableCell>
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
  )
}

export default WorkOrderDetailsModal
