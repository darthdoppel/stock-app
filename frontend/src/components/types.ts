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
