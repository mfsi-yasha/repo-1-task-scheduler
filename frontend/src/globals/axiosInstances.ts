import axios from "axios";

export interface SuccessResponse<T> {
	err: boolean;
	message: string;
	data: T;
}

export const axiosJSON = axios.create({
	baseURL: import.meta.env.BASE_API_URL,
	headers: { "Content-Type": "application/json" },
});
