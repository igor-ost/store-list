import { axiosInstance } from "../instance";
import ApiRouter from "../constants";
import { AxiosError } from "axios";
import { GetListErrorResponse } from "@/@types/product-types";
import { DetailedMaterialsReport } from "@/app/api/materials-report/detailed/route";


export const getList = async (month?:string): Promise<DetailedMaterialsReport> => {
    try {
        const { data } = await axiosInstance.get(ApiRouter.MATERIALS_REPORT,{
            params:{
                month: month,
            }
        });
        return data as DetailedMaterialsReport;
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