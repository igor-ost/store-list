import { LoginErrorResponse, LoginRequest, LoginResponse, LoginSuccessResponse, VerifyErrorResponse, VerifySuccessResponse } from "@/@types/auth-types";
import { axiosInstance } from "../instance";
import ApiRouter from "../constants";
import { AxiosError } from "axios";

export const login = async (request: LoginRequest): Promise<LoginSuccessResponse> => {
    try {
        const { data } = await axiosInstance.post(ApiRouter.AUTH_LOGIN, request);
        return data as LoginSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<LoginErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка авторизации:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`Ошибка авторизации: ${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка при входе. Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}

export const verify = async (): Promise<VerifySuccessResponse> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.AUTH_VERIFY);
        return data as VerifySuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<VerifyErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка авторизации:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`Ошибка авторизации: ${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка при входе. Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}

