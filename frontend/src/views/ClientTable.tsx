import { useState, useEffect, type SetStateAction } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Spinner, Tooltip, Pagination } from '@nextui-org/react'
import { type Client, type WorkOrder } from '../components/types'
import { EditIcon } from '../icons/EditIcon'
import { DeleteIcon } from '../icons/DeleteIcon'
import { EyeIcon } from '../icons/EyeIcon'
import EditClientModal from '../components/modals/EditClientModal'
import DeleteClientModal from '../components/modals/DeleteClientModal'
import AddClientModal from '../components/modals/AddClientModal'
import ClientWorkOrdersModal from '../components/modals/ClientWorkOrdersModal'
import { fetchClients, deleteClient } from '../services/clientService'
import { fetchClientWorkOrders } from '../services/workOrderService'

export default function ClientTable () {
  const [clients, setClients] = useState<Client[]>([])
  const [editingClientId, setEditingClientId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [isFetching, setIsFetching] = useState(true)
  const [totalClients, setTotalClients] = useState(0)
  const [filterValue, setFilterValue] = useState('')

  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false)
  const [clientWorkOrders, setClientWorkOrders] = useState<WorkOrder[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await fetchClients(currentPage, itemsPerPage)
        setClients(responseData.data) // Acceso directo a data
        setTotalClients(responseData.total) // Acceso directo a total
        setTotalPages(Math.ceil(responseData.total / itemsPerPage))
      } catch (error) {
        console.error('Error al obtener los clientes:', error)
      } finally {
        setIsFetching(false)
      }
    }

    void fetchData()
  }, [currentPage, itemsPerPage])

  const handleEditClick = (id: string) => {
    setEditingClientId(id)
  }

  const handleEditSuccess = (editedClient: Client) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client._id === editedClient._id ? editedClient : client
      )
    )
    setEditingClientId(null)
  }

  const handleDeleteIconClick = (id: string) => {
    setDeletingClientId(id)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteClient(id)
      const newClients = clients.filter((client) => client._id !== id)
      setClients(newClients)
    } catch (error) {
      console.error('Error al eliminar el cliente:', error)
    } finally {
      setIsDeleteModalOpen(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setIsFetching(true)
    setCurrentPage(newPage)
  }

  const handleInputChange = (event: { target: { value: SetStateAction<string> } }) => {
    setFilterValue(event.target.value)
  }

  const lowerFilterValue = (filterValue.length > 0) ? filterValue.toLowerCase() : ''

  const filteredClients = clients.filter(client =>
    ((client.firstName.length > 0) && client.firstName.toLowerCase().includes(lowerFilterValue)) ||
    ((client.lastName.length > 0) && client.lastName.toLowerCase().includes(lowerFilterValue)) ||
    ((client.dni.length > 0) && client.dni.toString().toLowerCase().includes(lowerFilterValue))
  )

  const handleViewWorkOrdersClick = async (clientId: string) => {
    try {
      const orders = await fetchClientWorkOrders(clientId)
      setClientWorkOrders(orders)
      setIsWorkOrderModalOpen(true)
    } catch (error) {
      console.error('Error al obtener las órdenes de trabajo:', error)
    }
  }

  return (
    <div className="w-1/2 mx-auto pb-8">
      <div className="relative">
        {/* Botón para activar el modal de agregar cliente */}
        <div className="flex justify-between items-center mb-4">
          <Input
            isClearable
            type="text"
            value={filterValue}
            onChange={handleInputChange}
            placeholder="Nombre, Apellido, DNI..."
            label="Buscar"
            variant="bordered"
            onClear={() => { setFilterValue('') }}
            className="w-1/2"
          />
        </div>

        {isFetching && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <Spinner color="success" size='lg'/>
          </div>
        )}

    {filteredClients.length === 0
      ? (
              <div>No hay clientes que coincidan con la búsqueda</div>
        )
      : (
        <Table aria-label="Clients table">
        <TableHeader>
          <TableColumn align="center"><>{'NOMBRE'}</></TableColumn>
          <TableColumn align="center"><>{'APELLIDO'}</></TableColumn>
          <TableColumn align="center"><>{'DNI'}</></TableColumn>
          <TableColumn align="center"><>{'TELÉFONO'}</></TableColumn>
          <TableColumn align="center"><>{'DIRECCIÓN'}</></TableColumn>
          <TableColumn align="center"><>{'ACCIONES'}</></TableColumn>
        </TableHeader>

          <TableBody>
          {Array.isArray(filteredClients)
            ? filteredClients.map((client) => (
          <TableRow key={client._id}>
            <TableCell><>{client.firstName}</></TableCell>
              <TableCell><>{client.lastName}</></TableCell>
              <TableCell><>{client.dni}</></TableCell>
              <TableCell><>{client.phoneNumber}</></TableCell>
              <TableCell><>{client.address}</></TableCell>
              <TableCell>
            <div className="relative flex items-center gap-2">
              <Tooltip content="Editar">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => { handleEditClick(client._id) }}>
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Eliminar">
                <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => { handleDeleteIconClick(client._id) }}>
                  <DeleteIcon />
                </span>
              </Tooltip>
              <Tooltip content="Ver órdenes de trabajo">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => {
                void handleViewWorkOrdersClick(client._id)
              }}>
                    <EyeIcon />
                  </span>

              </Tooltip>

        </div>
      </TableCell>
    </TableRow>
            ))
            : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No hay clientes
              </TableCell>
            </TableRow>
              )}
          </TableBody>
        </Table>
        )}

        <span className="text-default-400 text-small">
          <br /> Total {totalClients} clientes
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

        {(editingClientId != null) && (
          <EditClientModal
            isOpen={editingClientId !== null}
            onOpenChange={() => { setEditingClientId(null) }}
            clientId={editingClientId}
            onEditSuccess={(editedClient) => { handleEditSuccess(editedClient) }}
          />
        )}

        <DeleteClientModal
          isOpen={isDeleteModalOpen}
          onOpenChange={() => { setIsDeleteModalOpen(false) }}
          onDeleteConfirm={() => {
            if (deletingClientId != null) {
              void handleDeleteClick(deletingClientId)
            }
            setIsDeleteModalOpen(false)
          }}
        />

          <ClientWorkOrdersModal
            isOpen={isWorkOrderModalOpen}
            onOpenChange={() => { setIsWorkOrderModalOpen(false) }}
            workOrders={clientWorkOrders}
          />

      </div>
    </div>
  )
}
