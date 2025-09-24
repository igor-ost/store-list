
export type WorkersGeneral = {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
} 

export type WorkersListSuccessResponse = WorkersGeneral[]

export type WorkersListErrorResponse = {
    error:string;
    status:string
}


export type RemoveWorkerSuccessResponse = {
    success: boolean
}
export type RemoveWorkerErrorResponse = {
    error:string;
    status:string
}

export type CreateWorkerSuccessResponse = {
    status:string;
}
export type CreateWorkerErrorResponse = {
    error:string;
    status:string
}
export type CreateWorkerRequest = {
    name: string,
    email: string
    password: string
    role: string;
}
