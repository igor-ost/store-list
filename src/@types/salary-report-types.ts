
export type GetListSuccessResponse = {
  id: string
  orderId: string
  orderNumber: string
  productName: string
  workerId: string
  workerName: string
  workType: "sewing" | "cutting" | "buttons"
  quantity: number
  requiredProducts: number // Изделий требуемых по заказу
  requiredButtons: number // Требуется пуговок по заказу
  totalSewing: number // Пошивов по заказу
  totalCutting: number // Кроев по заказу
  totalButtons: number // Пуговок по заказу
  pricePerUnit: number
  totalPrice: number
  createdAt: string
}

export type GetListErrorResponse = {
    error:string;
    status:string
}

