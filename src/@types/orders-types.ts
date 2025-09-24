export type CreateOrderRequest = {
    general: General,
    zippers: Zippers[],
    fabrics: Fabrics[]
}

export type OrderGeneral = {
    id: string;
    order_number: string
    order_date: string
    customer_name: string
    customer_bin: string
    product_name: string
    product_type: string
    size: string
    quantity: number,
    description: string
    status: string
    notes: string,
}
 type General = {
    order_number: string
    order_date: string
    customer_name: string
    customer_bin: string
    product_name: string
    product_type: string
    size: string
    quantity: number,
    description: string
    status: string
    notes: string,
}
type Zippers = {
    id?: string;
    type: string;
    color: string;
    quantity: string;
    stock_quantity?:string
}

type Fabrics = {
    id?: string;
    stock_meters?:number
    name: string;
    color: string;
    consumption: string;
}


export type CreateOrderSuccessResponse = {
    id: string;
    email: string;
    name: string;
}
export type CreateOrderErrorResponse = {
    error:string;
    status:string
}


export type OrdersListSuccessResponse = OrderGeneral[]

export type OrdersListErrorResponse = {
    error:string;
    status:string
}



export type RemoveOrderSuccessResponse = {
    success: boolean
}
export type RemoveOrderErrorResponse = {
    error:string;
    status:string
}

export type OrdersGetByIdErrorResponse = {
    error:string;
    status:string
}
 
export type OrderInfo = {
    id: string;
    order_number: string
    order_date: string
    customer_name: string
    customer_bin: string
    product_name: string
    product_type: string
    size: string
    quantity: number,
    description: string
    status: string
    notes: string,
    zippers: Zippers[],
    fabrics: Fabrics[]
}

export type OrdersGetByIdSuccessResponse = OrderInfo