
export type GetListSuccessResponse = {
  id: string
  orderId: string
  orderNumber: string
  productName: string
  workerId: string
  workerName: string
  workType: "sewing" | "cutting"
  quantity: number
  pricePerUnit: number
  totalPrice: number
  createdAt: string
}

export type GetListErrorResponse = {
    error:string;
    status:string
}

