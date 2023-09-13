import { useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@nextui-org/react'
import { type Accessory } from './types'

export default function TableComponent () {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Esta función obtiene los accesorios del servidor
    const fetchAccessories = async () => {
      try {
        const response = await fetch('http://localhost:3000/accessories') // Ajusta la URL si es diferente
        const data = await response.json()
        setAccessories(data)
      } catch (error) {
        console.error('Error al obtener los accesorios:', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchAccessories()
  }, []) // El array vacío significa que este efecto se ejecuta solo una vez, similar a componentDidMount

  return (
    <div className="w-1/2 mx-auto">
      {loading
        ? (
        <div className="flex justify-center">
              <Spinner />
        </div>
          )
        : (
        <Table aria-label="Accessories table">
          <TableHeader>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn>CANTIDAD</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
            {accessories.map(accessory => (
              <TableRow key={accessory._id}>
                <TableCell>{accessory.name}</TableCell>
                <TableCell>{accessory.quantityInStock}</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          )}
    </div>
  )
}
