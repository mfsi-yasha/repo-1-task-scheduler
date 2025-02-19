import { generateOTP } from "./auth";

describe("Testing auth utils", () => {
	test("Function: generateOTP should give a 6 digit nuber", () => {
		const otp = generateOTP();
		expect(typeof parseInt(otp)).toBe("number");
		expect(otp.length).toBe(6);
	});
});
