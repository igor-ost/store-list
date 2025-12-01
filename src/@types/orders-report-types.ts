// Material types
export interface Material {
  id: string
  color?: string
  name?: string
  type: string
  qty: number
  price: number | null
}

export interface WorkLog {
  id: string
  workType: "sewing" | "cutting" | "buttons"
  quantity: number
  createdAt: string
  workerName: string
}

// Main order report response type
export interface OrderReport {
  id: string
  orderNumber: string
  clientName: string
  clientBin: string
  productName: string
  status: "pending" | "in-progress" | "completed" | "overproduced"
  quantity: number
  completedProducts: number
  productionProgress: number
  cuttingPrice: number
  sewingPrice: number
  totalCost: number
  createdAt: string
  quantityButtons: number
  totalSewing: number
  totalCutting: number
  totalButtons: number
  zippers: Material[]
  threads: Material[]
  buttons: Material[]
  fabrics: Material[]
  accessories: Material[]
  velcro: Material[]
  workLogs: WorkLog[]
}

export interface OrdersReportFilters {
  status?: string
  month?: string
  clientName?: string
  orderId?: string
}

export interface OrdersReportFilters {
  status?: string
  month?: string
  customerId?: string
}
export type GetListErrorResponse = {
    error:string;
    status:string
}

