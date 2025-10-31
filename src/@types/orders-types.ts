import { CustomerGeneral } from "./customer-types";

export type CreateOrderRequest = {
    general: General,
    user_id? :string;
}

export type OrderGeneral = {
    id: string;
    order_number: string
    order_date: string
    customer_id: string
    customer: CustomerGeneral
    product_name: string
    image_urls:    string[]
    product_type: string
    size: string
    quantity: number,
    description: string
    status: string
    notes: string,
}
 type General = {
    order_number: string
    order_date: string
    customer_id: string
    product_name: string
    product_type: string
    size: string
    quantity: number,
    description: string
    status: string
    notes: string,
}

export type CreateOrderSuccessResponse = {
    id: string;
    email: string;
    name: string;
}
export type CreateOrderErrorResponse = {
    error:string;
    status:string
}


export type OrdersListSuccessResponse = OrderGeneral[]

export type OrdersListErrorResponse = {
    error:string;
    status:string
}



export type RemoveOrderSuccessResponse = {
    success: boolean
}
export type RemoveOrderErrorResponse = {
    error:string;
    status:string
}

export type OrdersGetByIdErrorResponse = {
    error:string;
    status:string
}
 
export interface OrderInfo {
  id: string
  order_number: string
  order_date: string
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  product_name: string
  quantity: number
  notes?: string
  image_urls: string[]
  customer: {
    name: string
    bin: string
  }
  orderFabrics?: Array<{
    id: string
    qty: number
    price: number
    fabric: {
      name: string
      type: string
      color: string
      unit: string
    }
  }>
  orderZippers?: Array<{
    id: string
    qty: number
    price: number
    zipper: {
      type: string
      color: string
      unit: string
    }
  }>
  orderThreads?: Array<{
    id: string
    qty: number
    price: number
    thread: {
      type: string
      color: string
      unit: string
    }
  }>
  orderButtons?: Array<{
    id: string
    qty: number
    price: number
    button: {
      type: string
      color: string
      unit: string
    }
  }>
  orderAccessories?: Array<{
    id: string
    qty: number
    price: number
    accessory: {
      name: string
      unit: string
    }
  }>
  orderVelcro?: Array<{
    id: string
    qty: number
    price: number
    velcro: {
      name: string
      unit: string
    }
  }>
}
export type OrdersGetByIdSuccessResponse = OrderInfo