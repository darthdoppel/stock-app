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
}

export interface Equipment {
  type: 'notebook' | 'celular' | 'tablet' | 'otros'
  brand: string
  model: string
  problemDescription: string
  repairCost: number
  estimatedProfit: number
  dateReceived: Date
  dateReturned?: Date
}

export interface WorkOrder {
  _id: string
  client: Client
  equipments: Equipment[]
  dateCreated: Date
  status: 'received' | 'in-progress' | 'completed' | 'delivered'
  orderNumber: number
}
