import { useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Tooltip } from '@nextui-org/react'
import { type Accessory } from './types'
import { EditIcon } from './EditIcon'
import { DeleteIcon } from './DeleteIcon'
import EditAccessoryModal from './EditAccessoryModal'
import DeleteAccessoryModal from './DeleteAccessoryModal'
import { fetchAccessories, deleteAccessory } from '../services/accessoryService'

export default function TableComponent () {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAccessoryId, setEditingAccessoryId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingAccessoryId, setDeletingAccessoryId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAccessories() // Utiliza la función del servicio para obtener los accesorios
        setAccessories(data)
      } catch (error) {
        console.error('Error al obtener los accesorios:', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

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
      await deleteAccessory(id) // Utiliza la función del servicio para eliminar el accesorio
      const newAccessories = accessories.filter((accessory) => accessory._id !== id)
      setAccessories(newAccessories)
    } catch (error) {
      console.error('Error al eliminar el accesorio:', error)
    } finally {
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <div className="w-1/2 mx-auto">
      {loading
        ? (
        <div className="flex justify-center">
              <Spinner />
        </div>
          )
        : (
          <>
        <Table aria-label="Accessories table">
          <TableHeader>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn>CATEGORÍA</TableColumn>
            <TableColumn>CANTIDAD</TableColumn>
            <TableColumn>PRECIO</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
            {accessories.map(accessory => (
              <TableRow key={accessory._id}>
                <TableCell>{accessory.name}</TableCell>
                <TableCell className='capitalize'>{accessory.category}</TableCell>
                <TableCell>{accessory.quantityInStock}</TableCell>
                <TableCell>{accessory.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
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

        </>
          )}
    </div>
  )
}
