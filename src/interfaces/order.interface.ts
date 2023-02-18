export interface Order {
  id?: number
  user_id: number
  status: Status
}

export type Status = 'active' | 'completed'

export interface ProductToOrder {
  id?: number
  order_id: number
  product_id: number
  quantity: number
}
