import { useState, useEffect } from 'react'
import { Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Tooltip, Pagination, Select, SelectItem } from '@nextui-org/react'
import { type WorkOrder } from '../components/types' // Asegúrate de definir este tipo
import { DeleteIcon } from '../icons/DeleteIcon'
import { EyeIcon } from '../icons/EyeIcon'
import DeleteWorkOrderModal from '../components/modals/DeleteWorkOrderModal' // Asegúrate de tener este componente
import AddWorkOrderModal from '../components/modals/AddWorkOrderModal' // Asegúrate de tener este componente
import WorkOrderDetailsModal from '../components/modals/WorkOrderDetailsModal'
import { fetchWorkOrders, deleteWorkOrder, updateWorkOrderStatus } from '../services/workOrderService' // Asegúrate de tener este servicio
import { WorkOrderStatusDropdown } from '../components/WorkOrderStatusDropdown' // Asegúrate de tener este componente

export default function WorkOrderTable () {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingWorkOrderId, setDeletingWorkOrderId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [isFetching, setIsFetching] = useState(true)
  const [totalWorkOrders, setTotalWorkOrders] = useState(0)
  const [viewingWorkOrderId, setViewingWorkOrderId] = useState<string | null>(null)

  const [filterStatus, setFilterStatus] = useState('')

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

  const orderStatuses = [
    { label: 'Todos', value: '' },
    { label: 'Pendiente', value: 'pending' },
    { label: 'En progreso', value: 'in-progress' },
    { label: 'Completado', value: 'completed' },
    { label: 'Cancelado', value: 'cancelled' }
  ]

  const renderStatusChip = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return <Chip color="warning" variant="solid" size="sm">Pendiente</Chip>
      case 'En progreso':
        return <Chip color="primary" variant="solid" size="sm">En progreso</Chip>
      case 'Completado':
        return <Chip color="success" variant="solid" size="sm">Completado</Chip>
      case 'Cancelado':
        return <Chip color="danger" variant="solid" size="sm">Cancelado</Chip>
      default:
        return <Chip color="default" variant="solid" size="sm">{status}</Chip>
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true) // Antes de hacer la solicitud

      try {
        // Pasa currentPage y itemsPerPage como argumentos a fetchWorkOrders
        const responseData = await fetchWorkOrders(currentPage, itemsPerPage, filterStatus)

        if (Array.isArray(responseData.data)) {
          // Accede a la propiedad 'data' de la respuesta
          setWorkOrders(responseData.data)
          setTotalWorkOrders(responseData.total)
          setTotalPages(Math.ceil(responseData.total / itemsPerPage))
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
  }, [currentPage, itemsPerPage, filterStatus])

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

  const handleStatusChange = (workOrderId: string, newStatus: string) => {
    updateWorkOrderStatus(workOrderId, newStatus)
      .then(updatedWorkOrder => {
        setWorkOrders((prevWorkOrders) =>
          prevWorkOrders.map((workOrder) =>
            workOrder._id === workOrderId
              ? { ...workOrder, status: updatedWorkOrder.status }
              : workOrder
          )
        )
      })
      .catch(error => {
        console.error('Error al actualizar el estado de la orden de trabajo:', error)
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario.
      })
  }

  const handleViewDetailsClick = (id: string) => {
    setViewingWorkOrderId(id)
  }

  const foundOrder = workOrders.find(order => order._id === viewingWorkOrderId)

  const handleFilterChange = (value: string) => {
    setFilterStatus(value)
    setCurrentPage(1) // Restablece la página actual a 1 cada vez que cambias el filtro
  }

  return (
    <div className="w-full mx-auto pb-8 px-4 md:px-8 lg:px-16"> {/* Added horizontal padding */}
      <div className="relative">

      <div className="flex justify-between items-center mb-4">
          <Select
            label="Filtrar por estado"
            value={filterStatus}
            onChange={(e) => { handleFilterChange(e.target.value) }}
            className="w-1/4" // Establece el ancho del Select al 25% del contenedor padre

          >
            {orderStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </Select>

          <AddWorkOrderModal />
        </div>

<Table aria-label="Work Orders table" >
  <TableHeader>
  <TableColumn align="center" className="w-1/12">NÚMERO DE ORDEN</TableColumn>

    <TableColumn align="center">CLIENTE</TableColumn>
    <TableColumn align="center">FECHA</TableColumn>
    <TableColumn align="center">ESTADO</TableColumn>
    <TableColumn align="center">ACCIONES</TableColumn>
  </TableHeader>
  <TableBody>
    {Array.isArray(workOrders)
      ? workOrders.map((workOrder) => (
          <TableRow key={workOrder._id}>
          <TableCell>{workOrder.orderNumber}</TableCell>
            <TableCell>
  {workOrder.client.firstName} {workOrder.client.lastName}
</TableCell>
            <TableCell>{new Date(workOrder.dateCreated).toLocaleDateString()}</TableCell>
            <TableCell>{renderStatusChip(translateStatus(workOrder.status))}</TableCell>
            <TableCell>
              <div className="relative flex items-center gap-2">

              <Tooltip content="Ver detalles">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => { handleViewDetailsClick(workOrder._id) }}>
                <EyeIcon />
              </span>
            </Tooltip>
                <Tooltip color="danger" content="Eliminar">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => { handleDeleteIconClick(workOrder._id) }}>
                    <DeleteIcon />
                  </span>
                </Tooltip>
                <Tooltip content="Cambiar estado">
                    <div>
                        <WorkOrderStatusDropdown
                              status={workOrder.status}
                              onStatusChange={(newStatus) => { handleStatusChange(workOrder._id, newStatus) }}
                          />
                    </div>
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
                        <div className="mt-4 flex justify-center"> {/* Added margin-top and center alignment */}

          <Pagination
            isCompact
            showControls
            total={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            className='mt-4'
          />
          </div>
        )}

            {isFetching && (
                      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <Spinner color="success" size='lg'/>
                      </div>
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

            {Boolean(viewingWorkOrderId) && (
              <WorkOrderDetailsModal
              isOpen={viewingWorkOrderId !== null}
              onOpenChange={() => { setViewingWorkOrderId(null) }}
              workOrder={foundOrder ?? null}
              />
            )}

      </div>
    </div>
  )
}
