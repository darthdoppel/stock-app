import { useState, useEffect } from 'react'
import { Button, Image, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Tooltip, Pagination } from '@nextui-org/react'
import { type Accessory } from '../components/types'
import { EditIcon } from '../icons/EditIcon'
import { DeleteIcon } from '../icons/DeleteIcon'
import EditAccessoryModal from '../components/modals/EditAccessoryModal'
import DeleteAccessoryModal from '../components/modals/DeleteAccessoryModal'
import QuantitySelectionModal from '../components/modals/QuantitySelectionModal'
import { fetchAccessories, deleteAccessory } from '../services/accessoryService'
import { createSale } from '../services/saleService'
import AddAccessoryModal from '../components/modals/AddAccessoryModal'
import ShoppingCart from '../icons/ShoppingCart'
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
  const [filterValue, setFilterValue] = useState('')
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [totalAccessories, setTotalAccessories] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await fetchAccessories(currentPage, itemsPerPage, filterValue)
        setAccessories(responseData.data)
        setTotalAccessories(responseData.total)
        setTotalPages(Math.ceil(responseData.total / itemsPerPage))
      } catch (error) {
        console.error('Error al obtener los accesorios:', error)
      } finally {
        setIsFetching(false)
      }
    }

    void fetchData()
  }, [currentPage, itemsPerPage, filterValue])

  const handleEditClick = (id: string) => {
    setEditingAccessoryId(id)
  }

  const handleSortClick = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
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

  const handleSelectionChange = (selectedItems: string[]) => {
    const newSelectedItems = new Set(selectedItems)

    setSelectedItems(newSelectedItems)

    const selectedArray = [...newSelectedItems]

    selectedArray.forEach((id) => {
      // Si el ID seleccionado no está en el estado quantities, lo inicializamos con 1
      if (quantities[id] === undefined) {
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
    const itemsToSell = [...selectedItems].map((id) => ({
      _id: id as string, // Añadir una afirmación de tipo para indicar que id es de tipo string
      quantity: quantities[id as string] // Afirmación de tipo
    }))

    // Actualizar el estado del stock en el frontend
    const updatedAccessories = [...accessories]
    itemsToSell.forEach(item => {
      const accessoryIndex = updatedAccessories.findIndex(acc => acc._id === item._id)
      if (accessoryIndex !== -1) {
        updatedAccessories[accessoryIndex].quantityInStock -= item.quantity
      }
    })
    setAccessories(updatedAccessories)

    // Calcular el total sumando los precios de los accesorios vendidos
    const total = itemsToSell.reduce((acc, item) => {
      const accessory = accessories.find(acc => acc._id === item._id)
      if (accessory != null) {
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
      await createSale(saleDetails)
      toast.success('Actualizando stock...')
      toast.success('Venta registrada')
      toast.success(`Total: ${total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`)
      setSelectedItems(new Set())
      setQuantities({})
    } catch (error) {
      console.error('Error al registrar la venta:', error)
      toast.error('Error al registrar la venta')
    }
  }

  const sortedAccessories = [...accessories].sort((a, b) => {
    if (sortField == null) return 0

    const fieldA = a[sortField as keyof Accessory]
    const fieldB = b[sortField as keyof Accessory]

    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
    }

    if (typeof fieldA === 'number' && typeof fieldB === 'number') {
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA
    }

    // Si no podemos comparar los campos, no hacemos nada
    return 0
  })

  const filteredAndSortedAccessories = sortedAccessories.filter(accessory =>
    accessory.name.toLowerCase().includes(filterValue.toLowerCase())
  )

  return (
<div className="w-full mx-auto pb-8 px-4 md:px-8 lg:px-16"> {/* Added horizontal padding */}
       <div className="relative">
       <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">

       {/* Campo de búsqueda */}
       <div className="order-1 md:order-none mb-2 md:mb-0 w-full md:w-1/2">
          <Input
            isClearable
            type="text"
            value={filterValue}
            onChange={e => { setFilterValue(e.target.value) }}
            placeholder="Funda, cargador, etc..."
            label="Buscar"
            variant="bordered"
            onClear={() => { setFilterValue('') }}
          />
        </div>

     {/* Botones */}
     <div className="order-2 flex items-center justify-between space-x-4 w-full md:w-auto">
          <Button
            color="primary"
            size="md"
            variant="solid"
            onClick={() => { void handleSellClick() }}
            isDisabled={selectedItems.size === 0}
          >
            Vender <ShoppingCart />
          </Button>
          <AddAccessoryModal />
        </div>
  </div>

<div className="w-full mx-auto pb-8">
        <Table
            color="primary"
            selectionMode="multiple"
            aria-label="Accessories table"
            onSelectionChange={handleSelectionChange as any}
            selectionBehavior='replace'
            className="w-full mb-4 mx-auto"
            isStriped
             >

<TableHeader>
    <TableColumn
        align="center"
        onClick={() => { handleSortClick('name') }}
        className="cursor-pointer hover:text-blue-500"
    >
        NOMBRE <span className="inline-block hover:visible invisible"></span>
    </TableColumn>
    <TableColumn
        align="center"
        onClick={() => { handleSortClick('category') }}
        className="cursor-pointer hover:text-blue-500"
    >
        CATEGORIA <span className="inline-block hover:visible invisible"></span>
    </TableColumn>
    <TableColumn
        align="center"
        onClick={() => { handleSortClick('quantityInStock') }}
        className="cursor-pointer hover:text-blue-500"
    >
        STOCK <span className="inline-block hover:visible invisible"></span>
    </TableColumn>
    <TableColumn
        align="center"
        onClick={() => { handleSortClick('price') }}
        className="cursor-pointer hover:text-blue-500"
    >
        PRECIO <span className="inline-block hover:visible invisible"></span>
    </TableColumn>
    <TableColumn align="center">
        ACCIONES
    </TableColumn>
</TableHeader>

          <TableBody>

            {filteredAndSortedAccessories.map((accessory) => (
              <TableRow key={accessory._id}>
                <TableCell className="flex items-center justify-start">
                <Image
                  width={50}
                  height={50}
                  alt={accessory.name}
                  src={accessory.imageUrl}
                  className="mr-2"
                />
                <div className="p-2">
                  {accessory.name}
                </div>
              </TableCell>

              <TableCell className='capitalize text-left'>{accessory.category}</TableCell>
              <TableCell className='text-left'>{accessory.quantityInStock}</TableCell>
              <TableCell className='text-left'>{accessory.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</TableCell>

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
                        {`Cantidad: ${quantities[accessory._id] ?? 1}`}

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

        <span className="text-default-400 text-small">
            <br /> Total {totalAccessories} accesorios
        </span>

        </div>

        {/* Paginación fuera del contenedor con desplazamiento horizontal */}
          <div className="mt-4 flex justify-center">
            {totalPages > 1 && (
              <Pagination
                isCompact
                showControls
                total={totalPages} // Utilizamos el número total de páginas
                page={currentPage}
                onChange={handlePageChange}
              />
            )}
          </div>

        {isFetching && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <Spinner color="success" size='lg'/>
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
