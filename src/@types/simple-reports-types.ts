// Simple Salary Report Types
export interface SimpleSalaryReport {
  month: string
  workerName: string
  totalSalary: number
}

// Simple Orders Report Types
export interface SimpleOrderReport {
  orderNumber: string
  productName: string
  description: string
  required: number
  produced: number
}

// Materials Report Types
export interface MaterialsReport {
  orderNumber: string
  zippers: number
  threads: number
  buttons: number
  fabrics: number
  accessories: number
  velcro: number
  totalMaterialsCost: number
}
