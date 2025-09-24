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
    type: string;
    color: string;
    quantity: string;
}

type Fabrics = {
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