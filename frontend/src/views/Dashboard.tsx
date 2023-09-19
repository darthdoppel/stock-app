import { useState, useEffect } from 'react'
import { fetchTotalSalesAndAccessories } from '../services/saleService'
import { fetchTotalClientsCount } from '../services/clientService'
import { fetchDailyProfits } from '../services/dashboardService'
import AreaChartComponent, { type ChartData } from '../components/AreaChartComponent'
import DonutChartWorkOrders from '../components/DonutChartWorkOrders'
import {
  Card,
  Grid,
  Title,
  Col,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  Text,
  Metric,
  DateRangePicker
} from '@tremor/react'

export default function Dashboard () {
  const [totalSales, setTotalSales] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [totalClientsCount, setTotalClientsCount] = useState<number | null>(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date()
  })
  const [performanceData, setPerformanceData] = useState<ChartData[]>([])

  useEffect(() => {
    async function fetchData () {
      setLoading(true)
      try {
        const salesData = await fetchTotalSalesAndAccessories(dateRange.from.toISOString(), dateRange.to.toISOString())
        setTotalSales(salesData.totalSales)

        const totalClientsData = await fetchTotalClientsCount(dateRange.from, dateRange.to)
        setTotalClientsCount(totalClientsData)

        const combinedChartData = await fetchDailyProfits(dateRange.from, dateRange.to)
        setPerformanceData(combinedChartData)
      } catch (error) {
        console.error('Error al obtener los datos del dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    void fetchData()
  }, [dateRange])

  return (
    <main className="p-12">
      <Title>Dashboard</Title>

      <DateRangePicker
        className="max-w-sm mx-auto"
        enableSelect={false}
        onValueChange={(value) => {
          if ((value.from != null) && (value.to != null)) {
            setDateRange({ from: value.from, to: value.to })
          }
        }}
        placeholder="Seleccionar rango de fechas" // Traducción de "Select range"
        selectPlaceholder="Seleccionar" // Traducción de "Select"
      />

      <TabGroup className="mt-6">
        <TabList>
          <Tab>Dashboard</Tab>
        </TabList>
        <TabPanels>

        <TabPanel>
            <div className="relative">
              {/* Componentes */}
              <Grid numItemsMd={4} className="gap-6 mt-6">
                <Col>
                  <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo">
                    <Text>Total ventas</Text>
                    <Metric>
  {totalSales !== null ? `ARS ${new Intl.NumberFormat('es-AR').format(totalSales)}` : 'N/A'}
</Metric>

                  </Card>
                </Col>
                <Col>
                  <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo">
                    <Text>Total clientes nuevos</Text>
                    <Metric>{totalClientsCount ?? 'Loading...'}</Metric>
                  </Card>
                </Col>
                <Col numColSpan={2}>
                  <DonutChartWorkOrders fromDate={dateRange.from} toDate={dateRange.to} />
                </Col>
              </Grid>
            <div className="w-full mt-6">
              <AreaChartComponent
                data={performanceData}
                categories={['Sales', 'Clients', 'Profits']}
                isLoading={loading} // Pasa el estado de carga
              />
            </div>

          </div>
        </TabPanel>

        </TabPanels>
      </TabGroup>
    </main>
  )
}