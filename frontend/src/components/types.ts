export interface Accessory {
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

export interface Client {
  _id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  address: string
  dateAdded: Date
  dni: string
}

export interface AccessoryData {
  name: string
  brand: string
  compatiblePhoneModel: string
  price: number
  quantityInStock: number
  category: string
  imageUrl?: string // Asumo que este campo es opcional, ajusta según sea necesario
  // ... cualquier otro campo que pueda ser parte de accessoryData
}

export interface Equipment {
  _id: string
  type: 'Notebook' | 'Celular' | 'Tablet' | 'Otros'
  brand: string
  model: string
  problemDescription: string
  repairCost?: number
  estimatedProfit?: number
  dateReceived?: Date
  dateReturned?: Date
  materialCost?: number
}

export interface WorkOrder {
  _id: string
  client: Client
  equipments: Equipment[]
  dateCreated: Date
  status: 'received' | 'in-progress' | 'completed' | 'delivered'
  orderNumber: number
}

export interface ApiResponse<T> {
  data: T
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
}

export interface DailyData {
  _id: {
    year: number
    month: number
    day: number
  }
  totalSales?: number
  totalProfit?: number
  totalClients?: number
}

export interface WorkOrderStatus {
  _id: string
  count: number
}

export interface DashboardResponse {
  dailyProfits: DailyData[]
  dailySales: DailyData[]
  dailyClients: DailyData[]
  workOrdersByStatus: WorkOrderStatus[]
}
