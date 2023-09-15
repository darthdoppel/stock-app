import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'

interface QuantitySelectionModalProps {
  isOpen: boolean
  onOpenChange: () => void
  onQuantityConfirm: (quantity: number) => void
}

const QuantitySelectionModal: React.FC<QuantitySelectionModalProps> = ({ isOpen, onOpenChange, onQuantityConfirm }) => {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

  const handleQuantityChange = (value: string) => {
    setSelectedQuantity(Math.min(15, Math.max(1, Number(value))))
  }

  const handleConfirmClick = () => {
    onQuantityConfirm(selectedQuantity)
    onOpenChange()
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        <ModalHeader>Seleccionar Cantidad</ModalHeader>
        <ModalBody>
          <Input
            type="number"
            min="1"
            max="15"
            value={selectedQuantity}
            onChange={(e) => { handleQuantityChange(e.target.value) }}
            className="w-20"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="flat" onClick={onOpenChange}>
            Cancelar
          </Button>
          <Button color="secondary" onClick={handleConfirmClick}>
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default QuantitySelectionModal
