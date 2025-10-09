export type GetListSuccessResponse = {
  id: string
  color: string
  type: string
  qty: number
}
export type GetListErrorResponse = {
    error:string;
    status:string
}

export type createSuccessResponse = {
  id: string
  color: string
  type: string
  qty: number
}
export type createErrorResponse = {
    error:string;
    status:string
}

export type RemoveSuccessResponse = {
    success: boolean;
}

export type RemoveErrorResponse = {
    error:string;
    status:string
}

export type General = {
  id: string
  color: string
  type: string
  qty: number
}