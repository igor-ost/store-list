import { axiosInstance } from "../instance";
import ApiRouter from "../constants";
import { AxiosError } from "axios";
import { CreateOrderErrorResponse, CreateOrderRequest, CreateOrderSuccessResponse, OrderGeneral, OrdersListErrorResponse, OrdersListSuccessResponse, RemoveOrderErrorResponse, RemoveOrderSuccessResponse } from "@/@types/orders-types";

export const create = async (request: CreateOrderRequest): Promise<CreateOrderSuccessResponse> => {
    try {
        const { data } = await axiosInstance.post(ApiRouter.ORDER_CREATE, request);
        return data as CreateOrderSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<CreateOrderErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка создания заказа:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`Ошибка создания заказа: ${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка при создании заказа. Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}

export const getList = async (): Promise<OrdersListSuccessResponse> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.ORDER_GET_LIST);
        return data as OrdersListSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<OrdersListErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка создания заказа:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`Ошибка создания заказа: ${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка при создании заказа. Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}

export const removeById = async (id:string): Promise<RemoveOrderSuccessResponse> => {
    try {
        const { data } = await axiosInstance.delete(ApiRouter.ORDER_REMOVE_BY_ID + id);
        return data as RemoveOrderSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<RemoveOrderErrorResponse>;
        
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

