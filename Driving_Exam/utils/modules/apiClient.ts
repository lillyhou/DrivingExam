import { isModule, Module } from "@/types/Modules";
import { axiosInstance, createErrorResponse, ErrorResponse } from "../apiClient";


export async function getModules(): Promise<Module[] | ErrorResponse>{
    try{
        const moduleResponse = await axiosInstance.get("api/Modules");
        return moduleResponse.data.filter(isModule);
    }
    catch(e){
        return createErrorResponse(e);
    }
}