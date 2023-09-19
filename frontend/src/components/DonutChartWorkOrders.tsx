/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Card, Title, DonutChart } from '@tremor/react'
import { fetchWorkOrdersByStatus } from '../services/dashboardService'
import { Spinner } from '@nextui-org/react'
import { type WorkOrderStatus } from './types'

interface DonutChartWorkOrdersProps {
  fromDate: Date
  toDate: Date
}

const DonutChartWorkOrders: React.FC<DonutChartWorkOrdersProps> = ({ fromDate, toDate }) => {
  const [workOrdersByStatus, setWorkOrdersByStatus] = useState<WorkOrderStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData () {
      setIsLoading(true)
      try {
        const data = await fetchWorkOrdersByStatus(fromDate, toDate)
        if (Array.isArray(data.workOrdersByStatus)) {
          setWorkOrdersByStatus(data.workOrdersByStatus)
        } else {
          setWorkOrdersByStatus([])
        }
      } catch (error) {
        console.error('Error al obtener los datos de workOrdersByStatus:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [fromDate, toDate])

  const totalWorkOrders = workOrdersByStatus.reduce((acc, wo) => acc + wo.count, 0)

  const statusTranslations: Record<string, string> = {
    pending: 'Pendiente',
    cancelled: 'Cancelado',
    completed: 'Completado',
    'in-progress': 'En Progreso'
  }

  return (
    <Card className="max-w-lg">
      <Title>Órdenes de trabajo: {totalWorkOrders}</Title>
      {isLoading
        ? (
        <div className="flex justify-center mt-6">
          <Spinner size="lg" color='secondary' />
        </div>
          )
        : (
        <DonutChart
          className="mt-6"
          data={workOrdersByStatus.map(wo => ({
            ...wo,
            _id: statusTranslations[wo._id] ?? wo._id
          }))}
          category="count"
          index="_id"
          valueFormatter={value => value.toString()}
          colors={['slate', 'violet', 'indigo', 'rose']}
        />
          )}
    </Card>
  )
}

export default DonutChartWorkOrders
