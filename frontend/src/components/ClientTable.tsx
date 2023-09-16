import { useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Tooltip, Pagination } from '@nextui-org/react'
import { type Client } from './types'
import { EditIcon } from './EditIcon'
import { DeleteIcon } from './DeleteIcon'
import EditClientModal from './EditClientModal'
import DeleteClientModal from './DeleteClientModal'
import AddClientModal from './AddClientModal'
import { fetchClients, deleteClient } from '../services/clientService'

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await fetchClients(currentPage, itemsPerPage)
        if (Array.isArray(responseData.data)) {
          setClients(responseData.data)
        } else {
          console.error('La respuesta de la API no es un array:', responseData.data)
          setClients([]) // Establecer clients como un array vacío por defecto
        }
        setTotalClients(responseData.total)
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

  return (
    <div className="w-1/2 mx-auto pb-8">
      <div className="relative">
        {/* Botón para activar el modal de agregar cliente */}
        <div className="mb-4">

          <AddClientModal />
        </div>
        {isFetching && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <Spinner />
          </div>
        )}

        <Table aria-label="Clients table">
          <TableHeader>
            <TableColumn align="center">NOMBRE</TableColumn>
            <TableColumn align="center">APELLIDO</TableColumn>
            <TableColumn align="center">TELÉFONO</TableColumn>
            <TableColumn align="center">ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
          {Array.isArray(clients)
            ? clients.map((client) => (
              <TableRow key={client._id}>
                <TableCell>{client.firstName}</TableCell>
                <TableCell>{client.lastName}</TableCell>
                <TableCell>{client.phoneNumber}</TableCell>
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
      </div>
    </div>
  )
}
