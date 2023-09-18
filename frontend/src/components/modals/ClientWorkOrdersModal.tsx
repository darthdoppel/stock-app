import React from 'react'
import { Chip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { type WorkOrder } from '../types' // Asegúrate de importar el tipo correcto

interface ClientWorkOrdersModalProps {
  isOpen: boolean
  onOpenChange: () => void
  workOrders: WorkOrder[]
}

const renderStatusChip = (status: string) => {
  switch (status) {
    case 'pending':
      return <Chip color="warning" variant="solid" size="sm">Pendiente</Chip>
    case 'in-progress':
      return <Chip color="primary" variant="solid" size="sm">En progreso</Chip>
    case 'completed':
      return <Chip color="success" variant="solid" size="sm">Completado</Chip>
    case 'cancelled':
      return <Chip color="danger" variant="solid" size="sm">Cancelado</Chip>
    default:
      return <Chip color="default" variant="solid" size="sm">{status}</Chip>
  }
}

const ClientWorkOrdersModal: React.FC<ClientWorkOrdersModalProps> = ({ isOpen, onOpenChange, workOrders }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        <ModalHeader>Órdenes de Trabajo del Cliente</ModalHeader>
        <ModalBody>
          {workOrders.length === 0
            ? (
            <div>No hay órdenes de trabajo para este cliente</div>
              )
            : (
            <Table>
              <TableHeader>
                {/* Añade las columnas que necesitas para las órdenes de trabajo */}
                <TableColumn className="w-1/6">Número de Orden</TableColumn>
                <TableColumn>Fecha</TableColumn>
                <TableColumn>Estado</TableColumn>
                {/* ... otras columnas ... */}
              </TableHeader>
              <TableBody>
                {workOrders.map(order => (
                  <TableRow key={order._id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{new Date(order.dateCreated).toLocaleDateString()}</TableCell>
                    <TableCell>{renderStatusChip(order.status)}</TableCell>

                    {/* ... otras celdas ... */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              )}
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

export default ClientWorkOrdersModal
