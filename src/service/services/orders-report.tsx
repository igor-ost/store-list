import { axiosInstance } from "../instance";
import ApiRouter from "../constants";
import { AxiosError } from "axios";
import { OrderReport, GetListErrorResponse, OrdersReportFilters } from "@/@types/orders-report-types";


export const getList = async (request: OrdersReportFilters): Promise<OrderReport[]> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.ORDERS_REPORT_GET_LIST,{
            params:{
                month: request.month,
                status: request.status
            }
        });
        return data as OrderReport[];
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