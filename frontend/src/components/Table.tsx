import { useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'

interface Accessory {
  _id: string
  name: string
  category: string
  brand: string
  compatiblePhoneModel: string
  price: number
  quantityInStock: number
  description: string
  supplier: string
  dateAdded: Date
  imageUrl: string
}

export default function TableComponent () {
  const [accessories, setAccessories] = useState<Accessory[]>([])

  useEffect(() => {
    // Esta función obtiene los accesorios del servidor
    const fetchAccessories = async () => {
      try {
        const response = await fetch('http://localhost:3000/accessories') // Ajusta la URL si es diferente
        const data = await response.json()
        setAccessories(data)
      } catch (error) {
        console.error('Error al obtener los accesorios:', error)
      }
    }

    void fetchAccessories()
  }, []) // El array vacío significa que este efecto se ejecuta solo una vez, similar a componentDidMount

  return (
        <Table aria-label="Accessories table" className="w-1/2 mx-auto">
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
                        <TableCell>
                            {/* Aquí puedes agregar botones o acciones específicas para cada accesorio */}
                            Acciones
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
  )
}
