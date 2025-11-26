import { axiosInstance } from "../instance";
import ApiRouter from "../constants";
import { AxiosError } from "axios";
import { GetListErrorResponse, GetListSuccessResponse } from "@/@types/worklog-types";


export const getList = async (): Promise<GetListSuccessResponse[]> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.WORKLOG_GET_LIST);
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

export const create = async (request: {orderId: string;workerId:string;workType:string;quantity:number}): Promise<GetListSuccessResponse> => {
    try {
        const { data } = await axiosInstance.post(ApiRouter.WORKLOG_CREATE,request);
        return data as GetListSuccessResponse;
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

export const getListById = async (id:string): Promise<GetListSuccessResponse[]> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.WORKLOG_GET_LIST_BY_ID + `?orderId=${id}`);
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