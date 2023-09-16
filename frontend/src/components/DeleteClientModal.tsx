import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'

interface DeleteClientModalProps {
  isOpen: boolean
  onOpenChange: () => void
  onDeleteConfirm: () => void
}

const DeleteClientModal: React.FC<DeleteClientModalProps> = ({ isOpen, onOpenChange, onDeleteConfirm }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        <ModalHeader>Confirmar eliminación</ModalHeader>
        <ModalBody>
          ¿Estás seguro de que deseas eliminar este cliente?
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

export default DeleteClientModal
