import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";

export interface UsersDetails {
	userId: string;
	email: string;
	userFullName: string;
	verified: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface GetUserDetailsI {
	user: UsersDetails;
}

export default async function () {
	const { data: res } =
		await axiosJSON.get<ResponseDataType<GetUserDetailsI>>("/user/");
	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return res.data;
	}
}
