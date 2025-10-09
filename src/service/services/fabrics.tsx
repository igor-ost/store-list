import { axiosInstance } from "../instance";
import ApiRouter from "../constants";
import { AxiosError } from "axios";
import { createErrorResponse, createSuccessResponse, GetListErrorResponse, GetListSuccessResponse, RemoveErrorResponse, RemoveSuccessResponse } from "@/@types/fabrics-types";


export const getList = async (): Promise<GetListSuccessResponse[]> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.FABRICS_GET_LIST);
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

export const create = async (request: {type:string,name:string,color:string,unit:string,price:number,qty:number}): Promise<createSuccessResponse> => {
    try {
        const { data } = await axiosInstance.post(ApiRouter.FABRICS_CREATE,request);
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
        const { data } = await axiosInstance.delete(ApiRouter.FABRICS_REMOVE_BY_ID + id);
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

export const update = async (req: {id:string,type:string,name:string,color:string,unit:string,price:number,qty:number}): Promise<RemoveSuccessResponse> => {
    try {
        const { data } = await axiosInstance.put(ApiRouter.FABRICS_UPDATE + req.id,req);
        return data as RemoveSuccessResponse;
    } catch (error) {
        const axiosError = error as AxiosError<RemoveErrorResponse>;
        
        if (axiosError.response) {
            const errorData = axiosError.response.data;
            console.log('Ошибка удалия:', {
                error: errorData.status,
                status: errorData.error,
            });

            throw new Error(`${errorData.error}.`);
        }
        throw new Error(`Произошла ошибка  . Попробуйте ещё раз позже. (${axiosError.message}).`);
    }   
}
