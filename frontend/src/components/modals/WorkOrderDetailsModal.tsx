import React, { useState } from 'react'
import { Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, Tooltip } from '@nextui-org/react'
import { type WorkOrder, type Equipment } from '../types'
import EditEquipmentModal from './EditEquipmentModal'
import EditCostModal from './EditCostModal'
import { EditIcon } from '../../icons/EditIcon'
import AddEquipmentModal from './AddEquipmentModal'

interface WorkOrderDetailsModalProps {
  isOpen: boolean
  onOpenChange: () => void
  workOrder: WorkOrder | null
  onEquipmentEdit?: (editedEquipment: Equipment) => void
}

const WorkOrderDetailsModal: React.FC<WorkOrderDetailsModalProps> = ({ isOpen, onOpenChange, workOrder }) => {
  const [isEditEquipmentModalOpen, setIsEditEquipmentModalOpen] = useState(false)
  const [isEditCostModalOpen, setIsEditCostModalOpen] = useState(false)
  const [currentEquipment, setCurrentEquipment] = useState<null | Equipment>(null)
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false)

  const openEditEquipmentModal = (equipment: React.SetStateAction<Equipment | null>) => {
    setCurrentEquipment(equipment)
    setIsEditEquipmentModalOpen(true)
  }

  const openEditCostModal = (equipment: React.SetStateAction<Equipment | null>) => {
    setCurrentEquipment(equipment)
    setIsEditCostModalOpen(true)
  }

  const handleAddEquipment = (newEquipment: Equipment) => {
    if (workOrder != null) {
      workOrder.equipments.push(newEquipment) // Añade el nuevo equipo a la orden
    }
    setIsAddEquipmentModalOpen(false) // Cierra el modal de agregar equipo
  }

  const equipments = workOrder?.equipments

  return (
    <>
      <Modal size='2xl' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Detalles de la Orden de Trabajo</ModalHeader>
          <ModalBody>
          {
            ((equipments != null) && equipments.length > 0)
              ? (
                  equipments.map((equipment) => (
                  <Card key={equipment._id} className="mb-4">
                <CardBody>
                  <p className="mb-2"><strong>Tipo:</strong> {equipment.type}</p>
                  <p className="mb-2"><strong>Marca:</strong> {equipment.brand}</p>
                  <p className="mb-2"><strong>Modelo:</strong> {equipment.model}</p>
                  <p className="mb-2"><strong>Descripción del Problema:</strong> {equipment.problemDescription}</p>

                  <Divider className="my-4" />

                  <p className="mb-2">
                    <strong>Costo de Materiales:</strong>&nbsp;
                    {
                      equipment.materialCost === undefined || isNaN(equipment.materialCost)
                        ? 'No especificado'
                        : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(equipment.materialCost)
                    }

                  </p>

                  <p className="mb-2">
                      <strong>Costo al Cliente:</strong>&nbsp;
                      {
                        equipment.repairCost === undefined || isNaN(equipment.repairCost)
                          ? 'No especificado'
                          : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(equipment.repairCost)
                      }
                  </p>

                  <p className="mb-2">
                      <strong>Ganancia Estimada:</strong>&nbsp;
                      {
                        equipment.estimatedProfit === undefined || isNaN(equipment.estimatedProfit)
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
                  ))
                )
              : <p className="text-center">No hay equipos registrados para esta orden.</p>
          }
          </ModalBody>
          <ModalFooter>
              <Button color="secondary" onClick={() => { setIsAddEquipmentModalOpen(true) }}>
                  Añadir Equipo
              </Button>
              <Button color="primary" variant="flat" onClick={onOpenChange}>
                  Cerrar
              </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>

      <AddEquipmentModal
              isOpen={isAddEquipmentModalOpen}
              onOpenChange={() => { setIsAddEquipmentModalOpen(!isAddEquipmentModalOpen) }}
              onEquipmentAdded={handleAddEquipment}
          />

      {(currentEquipment != null) && (
        <>
          <EditEquipmentModal
            isOpen={isEditEquipmentModalOpen}
            onOpenChange={() => { setIsEditEquipmentModalOpen(!isEditEquipmentModalOpen) }}
            equipment={currentEquipment}
            onEditSuccess={(editedEquipment) => {
              if (workOrder != null) {
                const updatedEquipments = workOrder.equipments.map((equipment) =>
                  equipment._id === editedEquipment._id ? editedEquipment : equipment
                )
                workOrder.equipments = updatedEquipments
              }
              setCurrentEquipment(null) // Opcional: para resetear el equipo seleccionado.
            }}
          />

          <EditCostModal
            isOpen={isEditCostModalOpen}
            onOpenChange={() => { setIsEditCostModalOpen(!isEditCostModalOpen) }}
            equipment={currentEquipment}
            onEditSuccess={(editedEquipment) => {
              if (workOrder != null) {
                const updatedEquipments = workOrder.equipments.map((equipment) =>
                  equipment._id === editedEquipment._id ? editedEquipment : equipment
                )
                workOrder.equipments = updatedEquipments
              }
              setCurrentEquipment(null)
            }}
          />
      </>
      )}
    </>
  )
}

export default WorkOrderDetailsModal
