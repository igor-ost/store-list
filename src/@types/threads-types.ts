export type GetListSuccessResponse = {
  id: string
  type: string
  color: string
}
export type GetListErrorResponse = {
    error:string;
    status:string
}

export type createSuccessResponse = {
  id: string
  type: string
  color: string
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
  type: string
  color: string
}