import { api } from "../api"
import { endpoints } from "../endpoints"

export interface UserDetailsResponse {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export const getUserDetailsRequest = async () => {
    const response = await api.get<UserDetailsResponse>(endpoints.userDetails)
    return response.data
}