import { useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Tooltip, Pagination } from '@nextui-org/react'
import { type WorkOrder } from './types' // Asegúrate de definir este tipo
import { EditIcon } from './EditIcon'
import { DeleteIcon } from './DeleteIcon'
import EditWorkOrderModal from './EditWorkOrderModal' // Asegúrate de tener este componente
import DeleteWorkOrderModal from './DeleteWorkOrderModal' // Asegúrate de tener este componente
import AddWorkOrderModal from './AddWorkOrderModal' // Asegúrate de tener este componente
import { fetchWorkOrders, deleteWorkOrder } from '../services/workOrderService' // Asegúrate de tener este servicio

export default function WorkOrderTable () {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [editingWorkOrderId, setEditingWorkOrderId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingWorkOrderId, setDeletingWorkOrderId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [isFetching, setIsFetching] = useState(true)
  const [totalWorkOrders, setTotalWorkOrders] = useState(0)

  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'in-progress':
        return 'En progreso'
      case 'completed':
        return 'Completado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await fetchWorkOrders()

        if (Array.isArray(responseData)) {
          setWorkOrders(responseData)
          setTotalWorkOrders(responseData.length) // Esto establece el total basándose en la respuesta actual
          setTotalPages(Math.ceil(responseData.length / itemsPerPage)) // Ajustado para trabajar con la respuesta actual
        } else {
          console.error('La respuesta de la API no es un array:', responseData)
          setWorkOrders([])
        }
      } catch (error) {
        console.error('Error al obtener las órdenes de trabajo:', error)
      } finally {
        setIsFetching(false)
      }
    }

    void fetchData()
  }, [currentPage, itemsPerPage])

  const handleEditClick = (id: string) => {
    setEditingWorkOrderId(id)
  }

  const handleEditSuccess = (editedWorkOrder: WorkOrder) => {
    setWorkOrders((prevWorkOrders) =>
      prevWorkOrders.map((workOrder) =>
        workOrder._id === editedWorkOrder._id ? editedWorkOrder : workOrder
      )
    )
    setEditingWorkOrderId(null)
  }

  const handleDeleteIconClick = (id: string) => {
    setDeletingWorkOrderId(id)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteWorkOrder(id)
      const newWorkOrders = workOrders.filter((workOrder) => workOrder._id !== id)
      setWorkOrders(newWorkOrders)
    } catch (error) {
      console.error('Error al eliminar la orden de trabajo:', error)
    } finally {
      setIsDeleteModalOpen(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setIsFetching(true)
    setCurrentPage(newPage)
  }

  return (
    <div className="w-1/2 mx-auto pb-8">
      <div className="relative">
        {/* Botón para activar el modal de agregar orden de trabajo */}
        <div className="mb-4">
          <AddWorkOrderModal />
        </div>
        {isFetching && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <Spinner />
          </div>
        )}

<Table aria-label="Work Orders table">
  {/* Define las columnas que necesitas para las órdenes de trabajo */}
  <TableHeader>
    <TableColumn align="center">NÚMERO DE ORDEN</TableColumn>
    <TableColumn align="center">CLIENTE</TableColumn>
    <TableColumn align="center">FECHA</TableColumn>
    <TableColumn align="center">ESTADO</TableColumn>
    <TableColumn align="center">EQUIPOS</TableColumn>
    <TableColumn align="center">ACCIONES</TableColumn>
  </TableHeader>
  <TableBody>
    {Array.isArray(workOrders)
      ? workOrders.map((workOrder) => (
          <TableRow key={workOrder._id}>
          <TableCell>{workOrder.orderNumber}</TableCell>
            <TableCell>{workOrder.client.firstName} {workOrder.client.lastName}</TableCell>
            <TableCell>{new Date(workOrder.dateCreated).toLocaleDateString()}</TableCell>
            <TableCell>{translateStatus(workOrder.status)}</TableCell>
            <TableCell>{(workOrder.equipments.map(eq => eq.type)).join(', ')}</TableCell>
            <TableCell>
              <div className="relative flex items-center gap-2">
                <Tooltip content="Editar">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => { handleEditClick(workOrder._id) }}>
                    <EditIcon />
                  </span>
                </Tooltip>
                <Tooltip color="danger" content="Eliminar">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => { handleDeleteIconClick(workOrder._id) }}>
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
      ))
      : (
        <TableRow>
          <TableCell colSpan={5} align="center">
            No hay órdenes de trabajo
          </TableCell>
        </TableRow>
        )}
  </TableBody>
</Table>

        <span className="text-default-400 text-small">
          <br /> Total {totalWorkOrders} órdenes de trabajo
        </span>

        {totalPages > 1 && (
          <Pagination
            isCompact
            showControls
            total={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            className='mt-4'
          />
        )}

        {(editingWorkOrderId != null) && (
          <EditWorkOrderModal
            isOpen={editingWorkOrderId !== null}
            onOpenChange={() => { setEditingWorkOrderId(null) }}
            workOrderId={editingWorkOrderId}
            onEditSuccess={(editedWorkOrder) => { handleEditSuccess(editedWorkOrder) }}
          />
        )}

        <DeleteWorkOrderModal
          isOpen={isDeleteModalOpen}
          onOpenChange={() => { setIsDeleteModalOpen(false) }}
          onDeleteConfirm={() => {
            if (deletingWorkOrderId != null) {
              void handleDeleteClick(deletingWorkOrderId)
            }
            setIsDeleteModalOpen(false)
          }}
        />
      </div>
    </div>
  )
}
