import KEYS from "src/globals/keys";

export default function resetPasswordEmail({
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
		subject: `Reset Password - Task Scheduler`,
		html:
			`Dear ${toName},<br><br>` +
			`To reset your password, please use the One-Time Password (OTP) below to verify your email address:<br>` +
			`Your OTP: ${otp}<br>` +
			`For security reasons, the OTP is valid for the next ${expiryTime}. Please enter it as soon as possible to reset your password.<br>` +
			`If you didn’t request, please ignore this email.<br>` +
			`Need help? Feel free to contact us at ${supportEmail}.<br><br>` +
			`Best Regards<br>Team Mindfire`,
	};
}
