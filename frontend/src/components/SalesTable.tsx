import React, { useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination } from '@nextui-org/react'
import { type Accessory } from './types'

import { fetchSales } from '../services/saleService'
import { fetchAccessories } from '../services/accessoryService'

interface Sale {
  _id: string
  date: Date
  accessoriesSold: Array<{
    accessory: Accessory
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

  useEffect(() => {
    const fetchAccessoriesData = async () => {
      try {
        const data = await fetchAccessories(1, 100)
        setAccessories(data.data)
      } catch (error) {
        console.error('Error al obtener los accesorios:', error)
      }
    }

    void fetchAccessoriesData()
  }, [])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
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
                      const accessory = accessories.find((acc) => acc._id === item._id)
                      if (!accessory) {
                        console.warn('Accesorio no encontrado:', item._id)
                        return 'Accesorio no encontrado'
                      }
                      return index === 0
                        ? `${accessory.name} x${item.quantity}`
                        : `, ${accessory.name} x${item.quantity}`
                    })}
                  </TableCell>

                  <TableCell>{sale.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <Pagination
              isCompact
              showControls
              total={totalPages} // Usar el número total de páginas calculado
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
