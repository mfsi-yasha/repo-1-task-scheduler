import nodemailer, { SendMailOptions } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import KEYS from "src/globals/keys";

// Create a mail transporter based on environment (production or staging)
const mailTransporter =
	KEYS.APP_ENVS.NODE_ENV === "production" ||
	KEYS.APP_ENVS.NODE_ENV === "staging"
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

/**
 * Payload for the sendEmailService function that defines the email content and recipients.
 */
export interface SendEmailServicePayload {
	// Sender email address (optional, default is from config)
	from?: string;
	// Recipient email address
	to: string;
	// Subject of the email
	subject: string;
	// HTML content of the email
	html: string;
	// Optional array of file paths for attachments
	attachments?: Array<string>;
}

/**
 * Service function to send an email using Nodemailer.
 *
 * The email will be sent using a configured SMTP transporter if the environment is production or staging.
 * If the environment is development or testing, the email will not be sent but the function resolves successfully.
 *
 * @param from Sender email address (optional, defaults to the configured value)
 * @param to Recipient email address
 * @param subject Subject of the email
 * @param html HTML content of the email
 * @param attachments Optional array of file paths for attachments
 * @returns A promise that resolves if the email is sent successfully or resolves without action in non-production environments.
 */
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
			// If there are attachments, add them to the email options
			if (attachments?.length) {
				mailOptions.attachments = attachments.map(path => ({ path }));
			}

			// Send the email
			mailTransporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.error("Email ERROR", error.message);
					reject(error);
				} else {
					console.log(`Email sent: ${info.response} to: ${to}`);
					resolve(true);
				}
			});
		} else {
			console.log(`Email will not be sent in test or development environment.`);
			resolve(true);
		}
	});
}

export default sendEmailService;
