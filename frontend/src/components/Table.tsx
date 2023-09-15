import { useState, useEffect } from 'react'
import { Button, Image, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Tooltip, Pagination } from '@nextui-org/react'
import { type Accessory } from './types'
import { EditIcon } from './EditIcon'
import { DeleteIcon } from './DeleteIcon'
import EditAccessoryModal from './EditAccessoryModal'
import DeleteAccessoryModal from './DeleteAccessoryModal'
import QuantitySelectionModal from './QuantitySelectionModal'
import { fetchAccessories, deleteAccessory } from '../services/accessoryService'
import { createSale } from '../services/saleService'

import { toast } from 'sonner'

export default function TableComponent () {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [editingAccessoryId, setEditingAccessoryId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingAccessoryId, setDeletingAccessoryId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1) // Agrega el estado currentPage
  const [itemsPerPage] = useState(10) // Número de elementos por página
  const [totalPages, setTotalPages] = useState(1)
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [isFetching, setIsFetching] = useState(true)
  const [editingQuantityAccessoryId, setEditingQuantityAccessoryId] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  console.log(selectedItems, typeof selectedItems)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await fetchAccessories(currentPage, itemsPerPage)
        setAccessories(responseData.data)
        setTotalPages(Math.ceil(responseData.total / itemsPerPage))
      } catch (error) {
        console.error('Error al obtener los accesorios:', error)
      } finally {
        setIsFetching(false) // Aquí termina la carga
      }
    }

    void fetchData()
  }, [currentPage, itemsPerPage])

  const handleEditClick = (id: string) => {
    setEditingAccessoryId(id)
  }

  const handleEditSuccess = (editedAccessory: Accessory) => {
    setAccessories((prevAccessories) =>
      prevAccessories.map((accessory) =>
        accessory._id === editedAccessory._id ? editedAccessory : accessory
      )
    )
    setEditingAccessoryId(null)
  }

  const handleDeleteIconClick = (id: string) => {
    setDeletingAccessoryId(id)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteAccessory(id)
      const newAccessories = accessories.filter((accessory) => accessory._id !== id)
      setAccessories(newAccessories)
    } catch (error) {
      console.error('Error al eliminar el accesorio:', error)
    } finally {
      setIsDeleteModalOpen(false)
    }
  }

  // Define la función handlePageChange para manejar el cambio de página
  const handlePageChange = (newPage: number) => {
    setIsFetching(true) // Establece isFetching a true al cambiar de página
    setCurrentPage(newPage)
  }

  const handleSelectionChange = (selectedItems: any) => {
    const newSelectedItems = new Set(selectedItems)

    setSelectedItems(newSelectedItems)

    const selectedArray = [...newSelectedItems]
    console.log(selectedArray)

    selectedArray.forEach((id: string) => {
      // Si el ID seleccionado no está en el estado quantities, lo inicializamos con 1
      if (!quantities[id]) {
        setQuantities((prev) => ({ ...prev, [id]: 1 }))
      }
    })
  }

  const handleOpenQuantityModal = (id: string) => {
    setEditingQuantityAccessoryId(id)
  }

  const handleQuantityConfirm = (quantity: number) => {
    if (editingQuantityAccessoryId != null) {
      setQuantities((prevQuantities: Record<string, number>) => ({
        ...prevQuantities,
        [editingQuantityAccessoryId]: quantity
      }))
    }
    setEditingQuantityAccessoryId(null)
  }

  const handleSellClick = async () => {
    // Convertir el Set de selectedItems y el objeto quantities a un array de accesorios
    const itemsToSell = [...selectedItems].map(id => ({
      _id: id,
      quantity: quantities[id]
    }))

    // Calcular el total sumando los precios de los accesorios vendidos
    const total = itemsToSell.reduce((acc, item) => {
      const accessory = accessories.find(acc => acc._id === item._id)
      if (accessory) {
        return acc + accessory.price * item.quantity
      }
      return acc
    }, 0)

    try {
      // Crear el objeto de venta con total y fecha
      const saleDetails = {
        date: new Date(),
        accessoriesSold: itemsToSell,
        total
      }

      // Enviar la venta a la API
      const newSale = await createSale(saleDetails)
      console.log('Venta registrada:', newSale)
      toast.success('Venta registrada')
      setSelectedItems(new Set())
      setQuantities({})
    } catch (error) {
      console.error('Error al registrar la venta:', error)
      toast.error('Error al registrar la venta')
    }
  }

  return (
    <div className="w-1/2 mx-auto pb-8">
       <div className="relative">

       <Button
          color="primary"
          size="sm"
          variant="solid"
          onClick={handleSellClick}
          isDisabled={selectedItems.size === 0}
          className="mb-4 p-3"
        >
          Vender
        </Button>

        <Table
            selectionMode="multiple"
            aria-label="Accessories table"
            selected={Array.from(selectedItems)} // Convierte el conjunto a un arreglo
            onSelectionChange={handleSelectionChange}
          >

          <TableHeader>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn>CATEGORÍA</TableColumn>
            <TableColumn>CANTIDAD (STOCK)</TableColumn>
            <TableColumn>PRECIO C/U</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
            {accessories.map((accessory) => (
              <TableRow key={accessory._id}>
                <TableCell className="flex items-center">
                  <Image
                    width={50}
                    height={50}
                    alt={accessory.name}
                    src={accessory.imageUrl}
                    className="mr-2" // Agrega margen a la derecha para separar la imagen y el nombre
                  />
                  <div className="p-2"> {/* Agrega relleno (padding) alrededor de la imagen y el nombre */}
                    {accessory.name}
                  </div>
                </TableCell>

                <TableCell className='capitalize'>{accessory.category}</TableCell>
                <TableCell>{accessory.quantityInStock}</TableCell>
                <TableCell>{accessory.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">

                  {selectedItems.has(accessory._id) && (
                      <>
                        <Tooltip content="Seleccionar Cantidad">
                          <span
                            className="text-lg text-primary-400 cursor-pointer active:opacity-50"
                            onClick={() => { handleOpenQuantityModal(accessory._id) }}
                          >
                            🛒
                          </span>
                        </Tooltip>
                        {`Cantidad: ${quantities[accessory._id] || 1}`}
                      </>
                  )}

                    <Tooltip content="Editar">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => { handleEditClick(accessory._id) }}>
                        <EditIcon />
                      </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Eliminar">
                    <span
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => { handleDeleteIconClick(accessory._id) }}
                    >
                      <DeleteIcon />
                    </span>

                    </Tooltip>

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
            <Pagination
              isCompact
              showControls
              total={totalPages} // Utilizamos el número total de páginas
              page={currentPage}
              onChange={handlePageChange}
            />
        )}

        {isFetching && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <Spinner />
        </div>
        )}

        {(editingAccessoryId != null) && (
          <EditAccessoryModal
            isOpen={editingAccessoryId !== null} // true si hay un ID, false en caso contrario
            onOpenChange={() => { setEditingAccessoryId(null) }} // al cerrar, resetea el ID
            accessoryId={editingAccessoryId}
            onEditSuccess={(editedAccessory) => { handleEditSuccess(editedAccessory) }}
          />
        )}

          <DeleteAccessoryModal
            isOpen={isDeleteModalOpen}
            onOpenChange={() => { setIsDeleteModalOpen(false) }}
            onDeleteConfirm={() => {
              if (deletingAccessoryId != null) {
                void handleDeleteClick(deletingAccessoryId)
              }
              setIsDeleteModalOpen(false)
            }}
          />

          <QuantitySelectionModal
            isOpen={editingQuantityAccessoryId !== null}
            onOpenChange={() => { setEditingQuantityAccessoryId(null) }}
            onQuantityConfirm={handleQuantityConfirm}
          />

        </div>

    </div>
  )
}
