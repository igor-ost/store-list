import { OrderGeneral } from "./orders-types"
import { WorkersGeneral } from "./workers-types"


export type GetListSuccessResponse = {
  createdAt: string
  id: string
  orderId: string
  quantity: string
  workType: string
  workerId: number
  worker: WorkersGeneral
  order: OrderGeneral
}

export type GetListErrorResponse = {
    error:string;
    status:string
}

