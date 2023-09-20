import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Tooltip
} from '@nextui-org/react'

import { toast } from 'sonner'
import { addAccessory } from '../../services/accessoryService'

import PlusCircle from '../../icons/PlusCircle'

export default function AddAccessoryModal () {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [accessory, setAccessory] = useState({
    name: '',
    brand: '',
    compatiblePhoneModel: '',
    price: 0,
    quantityInStock: 0,
    category: 'fundas',
    imageUrl: ''
  })

  const [error, setError] = useState('')
  const [category, setCategory] = useState('fundas')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAccessory(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (): Promise<void> => {
    // Verificar si la cantidad en stock es 0
    if (accessory.quantityInStock === 0) {
      setError('La cantidad en stock no puede ser 0.')
      return
    }
    const accessoryData = {
      ...accessory,
      category
    }
    try {
      const data = await addAccessory(accessoryData)
      toast.success('Accesorio agregado')
      console.log('Accesorio agregado:', data)
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
      <div className="flex justify-end p-4">
      <Tooltip content="Agregar accesorio nuevo" color="success">
        <Button onPress={onOpen} color="success" endContent={<PlusCircle />}>
        </Button>
      </Tooltip>
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar Accesorio</ModalHeader>
              <ModalBody>
              <div className="overflow-y-auto max-h-[700px]">

              {error !== '' && <p className="text-red-600">{error}</p>}
              <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}>

                  <Input className="mb-4" isRequired name="name" label="Nombre" placeholder="Introduce el nombre del accesorio" required onChange={handleChange} />

                  <Input className="mb-4" isRequired name="brand" label="Marca" placeholder="Introduce la marca del accesorio" onChange={handleChange} />

                  <Input className="mb-4" isRequired name="compatiblePhoneModel" label="Modelo de teléfono compatible" placeholder="Introduce el modelo de teléfono compatible" onChange={handleChange} />

                  <Input className="mb-4" isRequired type="number" name="price" label="Precio" placeholder="Introduce el precio" required onChange={handleChange} />

                  <Input
                    className="mb-4"
                    isRequired
                    type="number"
                    name="quantityInStock"
                    label="Cantidad en Stock"
                    placeholder="Introduce la cantidad en stock"
                    required
                    onChange={handleChange}
                  />

                <Select isRequired
                    value={category}
                    onChange={(e) => { setCategory(e.target.value) }}
                    label="Categoría"
                    placeholder="Seleccione una categoría"
                    className="max-w-xs mb-4"
                    >
                    <SelectItem key="fundas" value="fundas">
                        Fundas
                    </SelectItem>
                    <SelectItem key="protectores de pantalla" value="protectores de pantalla">
                        Protectores de Pantalla
                    </SelectItem>
                    <SelectItem key="auriculares" value="auriculares">
                        Auriculares
                    </SelectItem>
                    <SelectItem key="cargadores" value="cargadores">
                        Cargadores
                    </SelectItem>
                </Select>
                  <Input type="url" name="imageUrl" label="URL de la imagen" placeholder="Introduce la URL de la imagen del accesorio" onChange={handleChange} />
                  {/* Puedes agregar más campos según tus necesidades */}
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
