import KEYS from "src/globals/keys";

export default function signupEmail({
	toName,
	otp,
	expiryTime,
	supportEmail = KEYS.SMTP_KEYS.SMTPSERVER_SENDER,
}: {
	toName: string;
	otp: string;
	expiryTime: string;
	supportEmail?: string;
}) {
	return {
		subject: `Signup Verification - Task Scheduler`,
		html:
			`Dear ${toName},<br><br>` +
			`Thank you for signing up with us! We are excited to have you on board. To complete your registration, please use the One-Time Password (OTP) below to verify your email address:<br>` +
			`Your OTP: ${otp}<br>` +
			`For security reasons, the OTP is valid for the next ${expiryTime}. Please enter it as soon as possible to activate your account.<br>` +
			`If you didn’t sign up, please ignore this email.<br>` +
			`Need help? Feel free to contact us at ${supportEmail}.<br><br>` +
			`Best Regards<br>Team Mindfire`,
	};
}
