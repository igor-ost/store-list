import { Materials } from "@/app/reference-books/page"

export type GetListSuccessResponse = {
  id: string
  name: string
  description: string
  materials: Materials
}
export type GetListErrorResponse = {
    error:string;
    status:string
}

export type createSuccessResponse = {
  id: string
  name: string
  description: string
  materials: Materials
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

export type GetByIdSuccessResponse = {
  zippers: Zipperz[]
  fabrics: Fabrics[]
  threads: Threads[]
  velcro: Velcro[]
  buttons: Buttons[]
  accessories: Accessories[]
  name: string;
  description: string
}


export type Zipperz = {
    id: string;
    orderTemplateId:string;
    qty: number;
    zipperId: string
    zipper: {
      name: string;
      color: string;
      id:string
      price:number
      qty:number
      type:string
      unit:string
    }
}

export type Fabrics = {
    id: string;
    orderTemplateId:string;
    qty: number;
    fabricId: string
    fabric: {
      color: string;
      id:string
      price:number;
      name: string;
      qty:number
      type:string
      unit:string
    }
}

export type Threads = {
    id: string;
    orderTemplateId:string;
    qty: number;
    threadId: string
    thread: {
      color: string;
      id:string
      price:number
      qty:number
      type:string
      unit:string
    }
}

export type Buttons = {
    id: string;
    orderTemplateId:string;
    qty: number;
    buttonId: string
    button: {
      color: string;
      id:string
      price:number
      qty:number
      type:string
      unit:string
    }
}

export type Velcro = {
    id: string;
    orderTemplateId:string;
    qty: number;
    velcroId: string
    velcro: {
      color: string;
      name:string;
      id:string
      price:number
      qty:number
      type:string
      unit:string
    }
}
export type Accessories = {
    id: string;
    orderTemplateId:string;
    qty: number;
    accessoriesId: string
    accessory: {
      color: string;
      name: string;
      id:string
      price:number
      qty:number
      type:string
      unit:string
    }
}