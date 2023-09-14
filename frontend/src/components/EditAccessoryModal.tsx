import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Input,
  Select,
  SelectItem
} from '@nextui-org/react'
import { toast } from 'sonner'
import { type Accessory } from './types'

interface EditAccessoryModalProps {
  isOpen: boolean
  onOpenChange: () => void
  accessoryId: string
  onEditSuccess: (accessory: Accessory) => void // Aquí está el cambio
}

export default function EditAccessoryModal ({ isOpen, onOpenChange, accessoryId, onEditSuccess }: EditAccessoryModalProps) {
  const [accessory, setAccessory] = useState<Partial<Accessory>>({
    name: '',
    brand: '',
    compatiblePhoneModel: '',
    quantityInStock: 0,
    price: 0,
    imageUrl: ''
  })

  const [error, setError] = useState('')
  const [category, setCategory] = useState<string>('') // o cualquier valor predeterminado que desees

  useEffect(() => {
    // Cargar los datos del accesorio cuando el modal se abra
    const fetchAccessory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/accessory/${accessoryId}`)
        const data = await response.json()
        setAccessory(data)
        setCategory(data.category)
        console.log('ESTOOOO', data.category)
      } catch (error) {
        console.error('Error al cargar el accesorio:', error)
      }
    }

    if (isOpen) {
      void fetchAccessory()
    }
  }, [isOpen, accessoryId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAccessory((prev: Partial<Accessory>) => ({ ...prev, [name]: value }))
  }

  const categories = [
    {
      value: 'fundas',
      label: 'Fundas'
    },
    {
      value: 'protectores de pantalla',
      label: 'Protectores de Pantalla'
    },
    {
      value: 'auriculares',
      label: 'Auriculares'
    },
    {
      value: 'cargadores',
      label: 'Cargadores'
    }
  ]

  const handleSubmit = async (): Promise<void> => {
    if (accessory.quantityInStock === 0) {
      setError('La cantidad en stock no puede ser 0.')
      return
    }
    const accessoryData = {
      ...accessory,
      category
    }
    try {
      const response = await fetch(`http://localhost:3000/accessory/${accessoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(accessoryData)
      })

      if (!response.ok) {
        throw new Error('Hubo un error al enviar los datos')
      }

      const data = await response.json()
      toast.success('Accesorio actualizado')
      console.log('Accesorio actualizado:', data)

      onEditSuccess(data) // Llamar al callback después de una edición exitosa
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
    <>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Editar Accesorio</ModalHeader>
              <ModalBody>
              <div className="overflow-y-auto max-h-[400px]">

              {error !== '' && <p className="text-red-600">{error}</p>}
              <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>

                  <Input name="name" label="Nombre" placeholder="Introduce el nombre del accesorio" required onChange={handleChange} value={accessory.name} />
                  <Divider className="my-4" />
                  <Input name="brand" label="Marca" placeholder="Introduce la marca del accesorio" onChange={handleChange} value={accessory.brand} />
                  <Divider className="my-4" />
                  <Input name="compatiblePhoneModel" label="Modelo de teléfono compatible" placeholder="Introduce el modelo de teléfono compatible" onChange={handleChange} value={accessory.compatiblePhoneModel} />
                  <Divider className="my-4" />
                  <Input type="number" name="quantityInStock" label="Cantidad en Stock" placeholder="Introduce la cantidad en stock" required onChange={handleChange} value={accessory.quantityInStock?.toString()} />
                  <Divider className="my-4" />
                  <Input type="number" name="price" label="Precio" placeholder="Introduce el precio" required onChange={handleChange} value={accessory.price?.toString()} />
                  <Divider className="my-4" />

                  <Select
    label="Categoría"
    variant="bordered"
    placeholder="Seleccione una categoría"
    selectedKeys={new Set([category])}
    onSelectionChange={(newSelection) => {
      const selectedCategory = [...newSelection][0]
      if (typeof selectedCategory === 'string') {
        setCategory(selectedCategory)
      }
    }}

    className="max-w-xs"
>
    {categories.map((cat) => (
        <SelectItem key={cat.value} value={cat.value}>
            {cat.label}
        </SelectItem>
    ))}
</Select>

                <Divider className="my-4" />
                  <Input type="url" name="imageUrl" label="URL de la imagen" placeholder="Introduce la URL de la imagen del accesorio" onChange={handleChange} value={accessory.imageUrl} />
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Cerrar
                    </Button>
                    <Button type="submit" color="primary">
                      Guardar
                    </Button>
                  </ModalFooter>
                </form>
              </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
