import { axiosInstance } from "../instance";
import ApiRouter from "../constants";
import { AxiosError } from "axios";
import { Materials } from "@/app/reference-books/page";
import { GetListErrorResponse } from "@/@types/materials-types";

export const getList = async (): Promise<Materials> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.MATERIALS_GET_LIST);
        return data as Materials;
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
