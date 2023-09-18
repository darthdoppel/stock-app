import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, Tooltip } from '@nextui-org/react'
import { type WorkOrder, type Equipment } from '../types'
import EditEquipmentModal from './EditEquipmentModal'
import EditCostModal from './EditCostModal'
import { EditIcon } from '../../icons/EditIcon'

interface WorkOrderDetailsModalProps {
  isOpen: boolean
  onOpenChange: () => void
  workOrder: WorkOrder
  onEquipmentEdit: (editedEquipment: Equipment) => void
}

const WorkOrderDetailsModal: React.FC<WorkOrderDetailsModalProps> = ({ isOpen, onOpenChange, workOrder }) => {
  const [isEditEquipmentModalOpen, setIsEditEquipmentModalOpen] = useState(false)
  const [isEditCostModalOpen, setIsEditCostModalOpen] = useState(false)
  const [currentEquipment, setCurrentEquipment] = useState<null | Equipment>(null)

  const openEditEquipmentModal = (equipment: React.SetStateAction<Equipment | null>) => {
    setCurrentEquipment(equipment)
    setIsEditEquipmentModalOpen(true)
  }

  const openEditCostModal = (equipment: React.SetStateAction<Equipment | null>) => {
    setCurrentEquipment(equipment)
    setIsEditCostModalOpen(true)
  }

  return (
    <>
      <Modal size='2xl' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Detalles de la Orden de Trabajo</ModalHeader>
          <ModalBody>
            {workOrder.equipments.map((equipment) => (
              <Card key={equipment._id} className="mb-4">
                <CardBody>
                  <p className="mb-2"><strong>Tipo:</strong> {equipment.type}</p>
                  <p className="mb-2"><strong>Marca:</strong> {equipment.brand}</p>
                  <p className="mb-2"><strong>Modelo:</strong> {equipment.model}</p>
                  <p className="mb-2"><strong>Descripción del Problema:</strong> {equipment.problemDescription}</p>
                  <p className="mb-2">
                    <strong>Costo de Materiales:</strong>&nbsp;
                    {
                      isNaN(equipment.materialCost)
                        ? 'No especificado'
                        : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(equipment.materialCost)
                    }
                  </p>

                    <p className="mb-2">
                      <strong>Costo al Cliente:</strong>&nbsp;
                      {
                        isNaN(equipment.repairCost)
                          ? 'No especificado'
                          : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(equipment.repairCost)
                      }
                    </p>
                    <p className="mb-2">
                      <strong>Ganancia Estimada:</strong>&nbsp;
                      {
                        isNaN(equipment.estimatedProfit)
                          ? 'No especificado'
                          : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(equipment.estimatedProfit)
                      }
                    </p>

                  <div className="inline-block mt-6">
                    <Tooltip content="Editar detalles del equipo">
                      <Button className="text-xs py-1 px-2 mr-2" onClick={() => { openEditEquipmentModal(equipment) }}>
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Editar costos">
                      <Button className="text-xs py-1 px-2" onClick={() => { openEditCostModal(equipment) }}>
                        $$
                      </Button>
                    </Tooltip>
                  </div>

                  {/* Aquí puedes añadir otro botón para abrir el modal de edición de costos */}
                </CardBody>
              </Card>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="flat" onClick={onOpenChange}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {currentEquipment && (
        <>
          <EditEquipmentModal
            isOpen={isEditEquipmentModalOpen}
            onOpenChange={() => { setIsEditEquipmentModalOpen(!isEditEquipmentModalOpen) }}
            equipment={currentEquipment}
            onEditSuccess={(editedEquipment) => {
              console.log('Equipo editado con éxito')
              const updatedEquipments = workOrder.equipments.map((equipment) =>
                equipment._id === editedEquipment._id ? editedEquipment : equipment
              )
              workOrder.equipments = updatedEquipments
              setCurrentEquipment(null) // Opcional: para resetear el equipo seleccionado.
            }}
          />
          <EditCostModal
            isOpen={isEditCostModalOpen}
            onOpenChange={() => { setIsEditCostModalOpen(!isEditCostModalOpen) }}
            equipment={currentEquipment}
            onEditSuccess={(editedEquipment) => {
              console.log('Costos editados con éxito')
              const updatedEquipments = workOrder.equipments.map((equipment) =>
                equipment._id === editedEquipment._id ? editedEquipment : equipment
              )
              workOrder.equipments = updatedEquipments
              setCurrentEquipment(null)
            }}
          />
      </>
      )}
    </>
  )
}

export default WorkOrderDetailsModal
