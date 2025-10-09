export type GetListSuccessResponse = {
  id: string
  name: string
  qty: number
}
export type GetListErrorResponse = {
    error:string;
    status:string
}

export type createSuccessResponse = {
  id: string
  name: string
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
  name: string
  qty: number
}