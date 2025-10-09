import { axiosInstance } from "../instance";
import ApiRouter from "../constants";
import { AxiosError } from "axios";
import { createErrorResponse, createSuccessResponse, GetListErrorResponse, GetListSuccessResponse, RemoveErrorResponse, RemoveSuccessResponse } from "@/@types/velcro-types";


export const getList = async (): Promise<GetListSuccessResponse[]> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.VELCRO_GET_LIST);
        return data as GetListSuccessResponse[];
    } catch (error) {
        const axiosError = error as AxiosError<GetListErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`Ошибка: ${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка. Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}

export const create = async (request: {name: string}): Promise<createSuccessResponse> => {
    try {
        const { data } = await axiosInstance.post(ApiRouter.VELCRO_CREATE,request);
        return data as createSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<createErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`Ошибка: ${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка. Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}

export const removeById = async (id:string): Promise<RemoveSuccessResponse> => {
    try {
        const { data } = await axiosInstance.delete(ApiRouter.VELCRO_REMOVE_BY_ID + id);
        return data as RemoveSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<RemoveErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка . Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}

export const update = async (req: {id:string;name:string;}): Promise<RemoveSuccessResponse> => {
    try {
        const { data } = await axiosInstance.put(ApiRouter.VELCRO_UPDATE + req.id,req);
        return data as RemoveSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<RemoveErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка удалия заказа:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка  . Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}
