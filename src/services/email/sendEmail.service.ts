import nodemailer, { SendMailOptions } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import KEYS from "src/globals/keys";

const mailTransporter = KEYS.APP_ENVS.ALLOW_EMAIL_SEND
	? nodemailer.createTransport(
			new SMTPTransport({
				host: KEYS.SMTP_KEYS.SMTPSERVER_HOST,
				port: KEYS.SMTP_KEYS.SMTPSERVER_PORT,
				secure: false,
				auth: {
					user: KEYS.SMTP_KEYS.SMTPSERVER_USER,
					pass: KEYS.SMTP_KEYS.SMTPSERVER_PASSWORD,
				},
				tls: {
					rejectUnauthorized: false,
				},
			}),
		)
	: null;

export interface SendEmailServicePayload {
	from?: string;
	to: string;
	subject: string;
	html: string;
	attachments?: Array<string>;
}

function sendEmailService({
	from = KEYS.SMTP_KEYS.SMTPSERVER_SENDER,
	to,
	subject,
	html,
	attachments,
}: SendEmailServicePayload) {
	return new Promise(function (
		resolve: (value: boolean) => void,
		reject: (error: Error) => void,
	) {
		if (mailTransporter) {
			const mailOptions: SendMailOptions = {
				from,
				to,
				subject,
				html,
			};
			if (attachments?.length) {
				mailOptions.attachments = attachments.map(path => ({ path }));
			}

			mailTransporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.error("Email ERROR", error);
					reject(error);
				} else {
					console.log(`Email sent: ${info.response} to: ${to}`);
					resolve(true);
				}
			});
		} else {
			reject(
				new Error(
					"Email sending not allowed in env. Kindly set ALLOW_EMAIL_SEND to true in env to continue sending email.",
				),
			);
		}
	});
}

export default sendEmailService;
