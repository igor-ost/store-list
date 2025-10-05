export type GetListSuccessResponse = {
  id: string
  name: string
  bin: string
  createdAt: string
  updatedAt: string
}
export type GetListErrorResponse = {
    error:string;
    status:string
}

export type createSuccessResponse = {
  id: string
  name: string
  bin: string
  createdAt: string
  updatedAt: string
}
export type createErrorResponse = {
    error:string;
    status:string
}

export type RemoveCustomerSuccessResponse = {
    success: boolean;
}

export type RemoveCustomerErrorResponse = {
    error:string;
    status:string
}

export type CustomerGeneral = {
  id: string
  name: string
  bin: string
  createdAt: string
  updatedAt: string 
}