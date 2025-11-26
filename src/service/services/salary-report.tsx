import { axiosInstance } from "../instance";
import ApiRouter from "../constants";
import { AxiosError } from "axios";
import { GetListErrorResponse, GetListSuccessResponse } from "@/@types/salary-report-types";

export const getList = async (request: {month?:string;workerId?:string}): Promise<GetListSuccessResponse[]> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.SALART_REPORT_GET_LIST,{
            params:{
                month: request.month,
                workerId: request.workerId
            }
        });
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