export type LoginRequest = {
    email: string;
    password: string;
}


export type LoginSuccessResponse = {
    id: string;
    email: string;
    name: string;
    token: string;
}
export type LoginErrorResponse = {
    error:string;
    status:string
}

export type VerifySuccessResponse = {
    id: string;
    email: string;
    name: string;
}
export type VerifyErrorResponse = {
    error:string;
    status:string
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse

