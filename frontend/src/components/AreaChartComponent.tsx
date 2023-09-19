import React, { useState } from 'react'
import { Card, AreaChart, TabGroup, TabList, Tab } from '@tremor/react'
import { Spinner } from '@nextui-org/react'

export interface ChartData {
  date: string
  Sales: number
  Clients: number
  Profits: number
}

interface AreaChartComponentProps {
  data: ChartData[]
  categories: string[]
  isLoading: boolean
}

const AreaChartComponent: React.FC<AreaChartComponentProps> = ({ data, categories, isLoading }) => {
  console.log('Renderizando AreaChartComponent con isLoading:', isLoading)

  const [selectedCategory, setSelectedCategory] = useState(categories[0])

  const getColorForCategory = (category: string): Array<'gray' | 'slate' | 'zinc' | 'neutral' | 'stone' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'> => {
    switch (category) {
      case 'Sales':
        return ['indigo']
      case 'Clients':
        return ['cyan']
      case 'Profits':
        return ['green']
      default:
        return ['gray']
    }
  }

  const dataFormatter = (number: number): string => {
    if (selectedCategory === 'Clients') {
      return Intl.NumberFormat('us').format(number)
    } else {
      return '$ ' + Intl.NumberFormat('us').format(number)
    }
  }

  return (
    <Card>
      {/* Tabs */}
      <TabGroup index={categories.indexOf(selectedCategory)} onIndexChange={(idx) => { setSelectedCategory(categories[idx]) }}>
        <TabList color="gray" variant="solid">
          {categories.map(category => <Tab key={category}>{category}</Tab>)}
        </TabList>
      </TabGroup>

      {/* Spinner */}
      {isLoading && (
        <div className="flex justify-center mt-4">
          <Spinner size="lg" color="secondary" />
        </div>
      )}

      {/* Area Chart */}
      {!isLoading && (
        <AreaChart
          className="mt-4"
          data={data}
          index="date"
          categories={[selectedCategory]}
          colors={getColorForCategory(selectedCategory)}
          valueFormatter={dataFormatter}
        />
      )}
    </Card>
  )
}

export default AreaChartComponent
