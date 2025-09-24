import { axiosInstance } from "../instance";
import ApiRouter from "../constants";
import { AxiosError } from "axios";
import { CreateWorkerErrorResponse, CreateWorkerRequest, CreateWorkerSuccessResponse, RemoveWorkerErrorResponse, RemoveWorkerSuccessResponse, WorkersListErrorResponse, WorkersListSuccessResponse } from "@/@types/workers-types";


export const create = async (request: CreateWorkerRequest): Promise<CreateWorkerSuccessResponse> => {
    try {
        const { data } = await axiosInstance.post(ApiRouter.WORKERS_CREATE, request);
        return data as CreateWorkerSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<CreateWorkerErrorResponse>;
        
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

export const getList = async (): Promise<WorkersListSuccessResponse> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.WORKERS_GET_LIST);
        return data as WorkersListSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<WorkersListErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка получения персонала:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`Ошибка создания персонала: ${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка при создании заказа. Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}

export const removeById = async (id:string): Promise<RemoveWorkerSuccessResponse> => {
    try {
        const { data } = await axiosInstance.delete(ApiRouter.WORKERS_REMOVE_BY_ID + id);
        return data as RemoveWorkerSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<RemoveWorkerErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка удалия персонала:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка при удалии персонала. Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}

