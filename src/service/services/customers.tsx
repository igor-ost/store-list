
import { axiosInstance } from "../instance";
import ApiRouter from "../constants";
import { AxiosError } from "axios";
import { createErrorResponse, createSuccessResponse, GetListErrorResponse, GetListSuccessResponse, RemoveCustomerErrorResponse, RemoveCustomerSuccessResponse } from "@/@types/customer-types";

export const getList = async (): Promise<GetListSuccessResponse[]> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.CUSTOMERS_GET_LIST);
        return data as GetListSuccessResponse[];
    } catch (error) {
        const axiosError = error as AxiosError<GetListErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка получения заказчиков:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`Ошибка получения заказчиков: ${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка при получении заказчика. Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}

export const create = async (request: {name: string; bin?: string}): Promise<createSuccessResponse> => {
    try {
        const { data } = await axiosInstance.post(ApiRouter.CUSTOMERS_CREATE,request);
        return data as createSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<createErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка создания заказчика:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`Ошибка создания заказчика: ${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка при создании заказчика. Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}

export const removeById = async (id:string): Promise<RemoveCustomerSuccessResponse> => {
    try {
        const { data } = await axiosInstance.delete(ApiRouter.CUSTOMERS_REMOVE_BY_ID + id);
        return data as RemoveCustomerSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<RemoveCustomerErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка удалия заказа:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка при удалии заказа. Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}


