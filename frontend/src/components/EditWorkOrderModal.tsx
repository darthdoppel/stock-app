import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, Input, Select } from '@nextui-org/react'
import { toast } from 'sonner'
import { type WorkOrder, Client, Equipment } from './types'

interface EditWorkOrderModalProps {
  isOpen: boolean
  onOpenChange: () => void
  workOrderId: string
  onEditSuccess: (workOrder: WorkOrder) => void
}

export default function EditWorkOrderModal ({ isOpen, onOpenChange, workOrderId, onEditSuccess }: EditWorkOrderModalProps) {
  const [workOrder, setWorkOrder] = useState<Partial<WorkOrder>>({})
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchWorkOrder = async () => {
      try {
        const response = await fetch(`http://localhost:3000/workorder/${workOrderId}`)
        const data = await response.json()
        setWorkOrder(data)
      } catch (error) {
        console.error('Error al cargar la orden de trabajo:', error)
      }
    }

    if (isOpen) {
      void fetchWorkOrder()
    }
  }, [isOpen, workOrderId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setWorkOrder((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/workorder/${workOrderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workOrder)
      })

      if (!response.ok) {
        throw new Error('Hubo un error al enviar los datos')
      }

      const data = await response.json()
      toast.success('Orden de trabajo actualizada')
      onEditSuccess(data)
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
        {(onClose) => (
          <>
            <ModalHeader>Editar Orden de Trabajo</ModalHeader>
            <ModalBody>
              {error !== '' && <p className="text-red-600">{error}</p>}
              <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>
                {/* Aquí puedes agregar más campos para editar los detalles de la orden de trabajo */}
                <Input name="status" label="Estado" placeholder="Introduce el estado de la orden de trabajo" required onChange={handleChange} value={workOrder.status} />
                <Divider className="my-4" />
                {/* Puedes agregar más campos según las propiedades de WorkOrder */}
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button type="submit" color="primary">
                    Guardar
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
