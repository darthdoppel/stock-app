import { useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination } from '@nextui-org/react'
import { type Accessory } from '../components/types'

import { fetchSales } from '../services/saleService'
import { fetchAccessories } from '../services/accessoryService'

interface Sale {
  _id: string
  date: Date
  accessoriesSold: Array<{
    _id: string // Aquí se almacena el ID del accesorio vendido
    quantity: number
  }>
  total: number
}

export default function SalesTable () {
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [sales, setSales] = useState<Sale[]>([])
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [totalPages, setTotalPages] = useState(1) // Número total de páginas

  useEffect(() => {
    const fetchAccessoriesData = async () => {
      try {
        const data = await fetchAccessories(1, 100, '')
        setAccessories(data.data)
      } catch (error) {
        console.error('Error al obtener los accesorios:', error)
      }
    }

    void fetchAccessoriesData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSales(currentPage, itemsPerPage)
        setSales(data.data)
        setTotalPages(Math.ceil(data.total / itemsPerPage)) // Calcular el número total de páginas
      } catch (error) {
        console.error('Error al obtener las ventas:', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <div className="w-1/2 mx-auto">
      {loading
        ? (
          <div className="flex justify-center">
            <Spinner color="success" size='lg'/>
          </div>
          )
        : (
          <>
            <Table aria-label="Sales table">
              <TableHeader>
                <TableColumn>FECHA</TableColumn>
                <TableColumn>ACCESORIOS VENDIDOS</TableColumn>
                <TableColumn>TOTAL</TableColumn>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                    {sale.accessoriesSold.map((item, index) => {
                      const accessory = accessories.find((acc) => acc._id.toString() === item._id.toString())

                      if (accessory == null) {
                        console.error('Accesorio no encontrado para el ID:', item._id)
                        return 'Accesorio no válido'
                      }

                      return index === 0
                        ? `${accessory.name} x${item.quantity}`
                        : `, ${accessory.name} x${item.quantity}`
                    })}

                    </TableCell>

                    <TableCell>
                      {sale.total.toLocaleString('es-AR', {
                        style: 'currency',
                        currency: 'ARS',
                        minimumFractionDigits: sale.total % 1 === 0 ? 0 : 2
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <Pagination
                isCompact
                showControls
                total={totalPages}
                page={currentPage}
                onChange={(newPage) => {
                  handlePageChange(newPage)
                }}
              />
            )}
          </>
          )}
    </div>
  )
}
