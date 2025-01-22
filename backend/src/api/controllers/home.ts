import { RequestType, ResponseDataType, ResponseType } from "src/globals/types";

/**
 * Controller function to handle the GET request for checking api route is working.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
const controller = async (
	req: RequestType<{}, {}, undefined>,
	res: ResponseType,
): Promise<void> => {
	res.status(200).json({
		err: false,
		msg: "Working",
		statusName: "success",
		errors: [],
	} as ResponseDataType<undefined>);
};

export default { controller };
