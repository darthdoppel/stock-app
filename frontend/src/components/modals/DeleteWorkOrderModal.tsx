import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'

interface DeleteWorkOrderModalProps {
  isOpen: boolean
  onOpenChange: () => void
  onDeleteConfirm: () => void
}

const DeleteWorkOrderModal: React.FC<DeleteWorkOrderModalProps> = ({ isOpen, onOpenChange, onDeleteConfirm }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        <ModalHeader>Confirmar eliminación</ModalHeader>
        <ModalBody>
          ¿Estás seguro de que deseas eliminar esta orden de trabajo?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="flat" onClick={onOpenChange}>
            Cancelar
          </Button>
          <Button color="danger" onClick={onDeleteConfirm}>
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteWorkOrderModal
